"""
Async Redis Queue Worker for background image analysis processing.
"""
import logging
from pathlib import Path
from uuid import UUID

from arq.connections import RedisSettings
from PIL import Image

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.analysis.analysis import Analysis, AnalysisStatus
from app.services.analysis_service import AnalysisService

logger = logging.getLogger(__name__)

UPLOAD_DIR = Path("/app/uploads")


async def process_analysis(ctx: dict, analysis_id: str, context_str: str | None = None) -> dict:
    """
    Background task to process image analysis.

    Args:
        ctx: ARQ context dictionary
        analysis_id: UUID of the analysis record
        context_str: Optional context string for analysis

    Returns:
        dict with status and message
    """
    logger.info(f"Starting analysis processing for ID: {analysis_id}")

    async with AsyncSessionLocal() as db:
        try:
            # Fetch the analysis record
            analysis = await db.get(Analysis, UUID(analysis_id))
            if not analysis:
                logger.error(f"Analysis {analysis_id} not found")
                return {"status": "error", "message": "Analysis not found"}

            # Update status to PROCESSING
            analysis.status = AnalysisStatus.PROCESSING.value
            await db.commit()
            await db.refresh(analysis)

            # Locate the image file
            image_path = UPLOAD_DIR / analysis.image_filename
            if not image_path.exists():
                raise FileNotFoundError(f"Image file not found: {image_path}")

            # Load the image
            image = Image.open(image_path)
            logger.info(f"Loaded image: {image_path}")

            # Execute the analysis pipeline
            await AnalysisService.analyze_product(
                db=db,
                analysis=analysis,
                images=[image],
                context=context_str,
            )

            # Status will be updated to COMPLETED by analyze_product
            # But let's ensure it's committed
            await db.commit()

            logger.info(f"Analysis {analysis_id} completed successfully")
            return {"status": "success", "analysis_id": analysis_id}

        except Exception as e:
            logger.exception(f"Error processing analysis {analysis_id}: {e}")

            # Update status to FAILED and save error message
            try:
                # Safely fetch analysis even if it wasn't set earlier
                if 'analysis' not in locals() or analysis is None:
                    analysis = await db.get(Analysis, UUID(analysis_id))
                
                if analysis:
                    analysis.status = AnalysisStatus.FAILED.value
                    analysis.error = str(e)
                    await db.commit()
            except Exception as commit_error:
                logger.error(f"Failed to update error status: {commit_error}")

            return {"status": "error", "message": str(e)}


class WorkerSettings:
    """ARQ Worker Settings."""

    functions = [process_analysis]

    redis_settings = RedisSettings(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
    )

    # Concurrency and job settings
    max_jobs = 5  # Limit concurrent jobs to avoid overload
    job_timeout = 600  # 10 minutes timeout for analysis jobs
    max_tries = 3  # Retry failed jobs up to 3 times
    
    # Use default ARQ queue (arq:queue)
    max_burst_jobs = 10

    # Health check
    health_check_interval = 60

    @staticmethod
    async def on_startup(ctx: dict) -> None:
        """Called when worker starts."""
        # Validate critical environment variables
        errors = []
        
        if not settings.GOOGLE_API_KEY:
            errors.append("GOOGLE_API_KEY must be set")
        
        if not settings.DATABASE_URL:
            errors.append("DATABASE_URL must be set")
        
        if not settings.REDIS_HOST:
            errors.append("REDIS_HOST must be set")
        
        if errors:
            error_msg = "Worker configuration validation failed: " + ", ".join(errors)
            logger.error(error_msg)
            raise RuntimeError(error_msg)
        
        logger.info("ARQ Worker started successfully")
        logger.info(f"Environment: {settings.ENVIRONMENT}")
        logger.info(f"Redis: {settings.REDIS_HOST}:{settings.REDIS_PORT}")

    @staticmethod
    async def on_shutdown(ctx: dict) -> None:
        """Called when worker shuts down."""
        logger.info("ARQ Worker shutting down gracefully...")
        # Allow in-progress jobs to complete
        logger.info("Waiting for active jobs to complete...")
