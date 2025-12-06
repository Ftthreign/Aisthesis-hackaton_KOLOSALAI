from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from pathlib import Path
from PIL import Image
from io import BytesIO
import logging

from arq import create_pool
from arq.connections import RedisSettings

from app.config import settings
from app.database import get_db
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
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)


async def get_redis_pool():
    """Get ARQ Redis connection pool."""
    return await create_pool(
        RedisSettings(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
        )
    )


@router.post(
    "",
    response_model=AnalysisCreateResponse,
    status_code=202,
    responses={202: {"description": "Analysis job queued"}},
)
async def create_analysis(
    file: UploadFile = File(...),
    context: str | None = None,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Upload product image for AI analysis.

    Returns 202 Accepted with analysis ID. Use GET /analysis/{id} to check status.
    """
    analysis = None
    redis = None
    
    try:
        # 1. Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image.",
            )

        # 2. Validate file size before reading
        if hasattr(file, 'size') and file.size:
            if file.size > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE} bytes."
                )

        # 3. Read and validate image
        try:
            image_bytes = await file.read()
            
            # Double-check size after reading
            if len(image_bytes) > settings.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE} bytes."
                )
            
            image = Image.open(BytesIO(image_bytes))
            image.verify()  # Verify it's actually a valid image
            
            # Re-open after verify (verify closes the file)
            image = Image.open(BytesIO(image_bytes))
        except Exception as e:
            logger.warning(f"Invalid image upload attempt: {e}")
            raise HTTPException(status_code=400, detail="Invalid image format.")

        # 4. Validate file extension
        if file.filename:
            ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
            if ext not in settings.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"File extension .{ext} not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
                )

        # 5. Save file to disk with UUID
        new_filename = f"{uuid4()}.png"
        save_path = UPLOAD_DIR / new_filename
        image.save(save_path)
        logger.info(f"Saved uploaded image: {new_filename}")

        # 6. Create Analysis record with PENDING status
        analysis = Analysis(
            user_id=user.id,
            image_url=f"/uploads/{new_filename}",
            image_filename=new_filename,
            status=AnalysisStatus.PENDING.value,
        )
        db.add(analysis)
        await db.commit()
        await db.refresh(analysis)
        
        logger.info(f"Created analysis record {analysis.id} for user {user.id}")

        # 7. Enqueue job to Redis with proper cleanup
        try:
            redis = await get_redis_pool()
            await redis.enqueue_job(
                "process_analysis",
                str(analysis.id),
                context,
            )
            logger.info(f"Enqueued analysis job {analysis.id} to Redis")
        finally:
            if redis:
                await redis.close()

        # 8. Return 202 Accepted with analysis ID
        return AnalysisCreateResponse(
            data=AnalysisCreateData(
                id=analysis.id,
                status=analysis.status,
            )
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        if analysis:
            await db.rollback()
        raise
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error creating analysis: {e}", exc_info=True)
        if analysis:
            await db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request."
        )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: UUID,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Get analysis status and result.

    Returns current status and full result when completed.
    """
    analysis = await db.get(Analysis, analysis_id)

    if not analysis:
        logger.warning(f"Analysis {analysis_id} not found")
        raise HTTPException(status_code=404, detail="Analysis not found")

    if analysis.user_id != user.id:
        logger.warning(f"User {user.id} attempted to access analysis {analysis_id} owned by {analysis.user_id}")
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    logger.info(f"User {user.id} retrieved analysis {analysis_id} with status {analysis.status}")
    return AnalysisResponse(data=AnalysisData.model_validate(analysis))
