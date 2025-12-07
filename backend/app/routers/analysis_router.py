import asyncio
import logging
import os
from io import BytesIO
from pathlib import Path
from uuid import UUID, uuid4

from arq import create_pool
from arq.connections import RedisSettings
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.core.auth import get_current_user
from app.database import AsyncSessionLocal, get_db
from app.models.analysis.analysis import Analysis, AnalysisStatus
from app.schemas.analysis import (
    AnalysisCreateData,
    AnalysisCreateResponse,
    AnalysisData,
    AnalysisResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analysis", tags=["Analysis"])

# Use absolute path for Docker compatibility - matches volume mount at /app/uploads
# In Docker: /app/uploads, in local dev: backend/app/uploads (relative to code)
if os.environ.get("ENVIRONMENT") == "production" or os.path.exists("/app/uploads"):
    UPLOAD_DIR = Path("/app/uploads")
else:
    BASE_DIR = Path(__file__).resolve().parent.parent
    UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# Background task processor for development mode
async def process_bg_task(analysis_id: UUID, save_path: Path, context: str | None):
    """Process analysis in background task (development mode or Redis fallback)."""
    async with AsyncSessionLocal() as bg:
        try:
            # Fetch fresh analysis row
            res = await bg.execute(
                select(Analysis).where(Analysis.id == analysis_id)
            )
            a = res.scalar_one()

            a.status = AnalysisStatus.PROCESSING.value
            await bg.commit()

            # Gemini inline_data
            with open(save_path, "rb") as f:
                img_bytes = f.read()

            gemini_image = {
                "inline_data": {"mime_type": "image/png", "data": img_bytes}
            }

            from app.services.analysis_service import AnalysisService

            # Run full pipeline
            await AnalysisService.analyze_product(
                bg, a, [gemini_image], context
            )

            logger.info(f"✔ Completed analysis {analysis_id}")

        except Exception as e:
            logger.error(f"❌ Background task failed: {e}")
            # Mark FAILED
            async with AsyncSessionLocal() as bg2:
                res = await bg2.execute(
                    select(Analysis).where(Analysis.id == analysis_id)
                )
                a2 = res.scalar_one()
                a2.status = AnalysisStatus.FAILED.value
                a2.error = str(e)
                await bg2.commit()


# -------------------------------------------------------------
# POST /analysis — Upload image and start processing
# -------------------------------------------------------------
@router.post("", response_model=AnalysisCreateResponse, status_code=202)
async def create_analysis(
    file: UploadFile = File(...),
    context: str | None = None,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    analysis = None

    try:
        # Validate file MIME
        if not file.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")

        image_bytes = await file.read()

        # Validate size
        if len(image_bytes) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(413, "File size too large")

        # Validate image content
        try:
            img = Image.open(BytesIO(image_bytes))
            img.verify()
        except:
            raise HTTPException(400, "Invalid image format")

        # Validate extension
        ext = file.filename.split(".")[-1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(400, f"Extension .{ext} not allowed")

        # Save locally
        new_filename = f"{uuid4()}.png"
        save_path = UPLOAD_DIR / new_filename
        img = Image.open(BytesIO(image_bytes))
        img.save(save_path)

        # Create DB record
        analysis = Analysis(
            user_id=user.id,
            image_url=f"/uploads/{new_filename}",
            image_filename=new_filename,
            status=AnalysisStatus.PENDING.value,
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)

        analysis_id = analysis.id
        logger.info(f"Created analysis {analysis_id}")

        # --------------------------------------------------
        # Queue job for background processing
        # --------------------------------------------------
        if settings.ENVIRONMENT == "production":
            # Production: Use Redis queue with ARQ worker
            try:
                from arq import create_pool
                from arq.connections import RedisSettings
                
                redis_settings = RedisSettings(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                )
                
                redis = await create_pool(redis_settings)
                await redis.enqueue_job(
                    "process_analysis",
                    str(analysis_id),
                    context,
                )
                await redis.close()
                logger.info(f"✓ Enqueued analysis {analysis_id} to Redis queue")
                
            except Exception as e:
                logger.error(f"Failed to enqueue job to Redis: {e}")
                # Fallback to background task if Redis fails
                logger.warning(f"Falling back to background task processing")
                asyncio.create_task(process_bg_task(analysis_id, save_path, context))
        else:
            # Development: Process directly without Redis
            logger.warning(f"⚠ DEV MODE: Processing {analysis_id} without Redis queue")
            asyncio.create_task(process_bg_task(analysis_id, save_path, context))

        return AnalysisCreateResponse(
            data=AnalysisCreateData(id=analysis_id, status=analysis.status)
        )

    except HTTPException:
        if analysis:
            await db.rollback()
        raise

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        if analysis:
            await db.rollback()
        raise HTTPException(500, "Internal Server Error")


# -------------------------------------------------------------
# GET /analysis/{id} — Get analysis status/results
# -------------------------------------------------------------
@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: UUID,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    stmt = (
        select(Analysis)
        .where(Analysis.id == analysis_id)
        .options(
            selectinload(Analysis.story),
            selectinload(Analysis.taste),
            selectinload(Analysis.pricing),
            selectinload(Analysis.brand_theme),
            selectinload(Analysis.seo),
            selectinload(Analysis.marketplace),
            selectinload(Analysis.persona),
            selectinload(Analysis.packaging),
            selectinload(Analysis.action_plan),
        )
    )

    result = await db.execute(stmt)
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(404, "Analysis not found")

    if analysis.user_id != user.id:
        raise HTTPException(404, "Analysis not found")

    return AnalysisResponse(data=AnalysisData.model_validate(analysis))
