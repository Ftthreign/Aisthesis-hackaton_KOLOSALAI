from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID, uuid4
from pathlib import Path
from PIL import Image
from io import BytesIO
import logging
import asyncio

from app.config import settings
from app.database import get_db, AsyncSessionLocal
from app.core.auth import get_current_user

from app.schemas.analysis import (
    AnalysisCreateResponse,
    AnalysisCreateData,
    AnalysisResponse,
    AnalysisData,
)

from app.models.analysis.analysis import Analysis, AnalysisStatus

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analysis", tags=["Analysis"])

UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


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
        # DEV MODE: process directly without Redis
        # --------------------------------------------------
        if settings.ENVIRONMENT == "development":
            logger.warning(f"⚠ DEV MODE: Processing {analysis_id} without Redis queue")

            # Gemini inline_data (NO upload_file!)
            with open(save_path, "rb") as f:
                img_bytes = f.read()

            gemini_image = {
                "inline_data": {
                    "mime_type": "image/png",
                    "data": img_bytes
                }
            }

            from app.services.analysis_service import AnalysisService

            async def process_bg():
                async with AsyncSessionLocal() as bg:
                    try:
                        # Fetch fresh analysis row
                        res = await bg.execute(select(Analysis).where(Analysis.id == analysis_id))
                        a = res.scalar_one()

                        a.status = AnalysisStatus.PROCESSING.value
                        await bg.commit()

                        # Run full pipeline
                        await AnalysisService.analyze_product(
                            bg, a, [gemini_image], context
                        )

                        logger.info(f"✔ Completed analysis {analysis_id}")

                    except Exception as e:
                        logger.error(f"❌ Background failed: {e}")
                        # Mark FAILED
                        async with AsyncSessionLocal() as bg2:
                            res = await bg2.execute(select(Analysis).where(Analysis.id == analysis_id))
                            a2 = res.scalar_one()
                            a2.status = AnalysisStatus.FAILED.value
                            a2.error = str(e)
                            await bg2.commit()

            asyncio.create_task(process_bg())

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
