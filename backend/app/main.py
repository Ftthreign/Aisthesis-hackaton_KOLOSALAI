from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.config import settings
from app.database import get_db
from app.routers.auth_router import router as auth_router
from app.routers.analysis_router import router as analysis_router

from fastapi.staticfiles import StaticFiles
from pathlib import Path


app = FastAPI(
    title="Aisthesis API",
    description="API for Aisthesis",
    version="0.0.1",

    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json"
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "app" / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if settings.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")

logger = logging.getLogger(__name__)


@app.on_event("startup")
async def validate_config():
    """Validate required configuration on startup."""
    errors = []
    
    if not settings.GOOGLE_API_KEY:
        errors.append("GOOGLE_API_KEY must be set")
    
    if not settings.GOOGLE_CLIENT_SECRET:
        errors.append("GOOGLE_CLIENT_SECRET must be set")
    
    if not settings.SECRET_KEY:
        errors.append("SECRET_KEY must be set")
    
    if not settings.DATABASE_URL:
        errors.append("DATABASE_URL must be set")
    
    if errors:
        error_msg = "Configuration validation failed: " + ", ".join(errors)
        logger.error(error_msg)
        raise RuntimeError(error_msg)
    
    logger.info("Configuration validation passed")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS origins: {settings.ALLOWED_ORIGINS}")


@app.get("/api/v1/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint with dependency checks."""
    from sqlalchemy import text
    
    checks = {
        "status": "healthy",
        "database": "unknown",
        "redis": "unknown"
    }
    
    # Check database
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = "unhealthy"
        checks["status"] = "unhealthy"
        logger.error(f"Database health check failed: {e}")
    
    # Check Redis
    try:
        from app.routers.analysis_router import get_redis_pool
        redis = await get_redis_pool()
        try:
            await redis.ping()
            checks["redis"] = "healthy"
        finally:
            await redis.close()
    except Exception as e:
        checks["redis"] = "unhealthy"
        checks["status"] = "unhealthy"
        logger.error(f"Redis health check failed: {e}")
    
    status_code = 200 if checks["status"] == "healthy" else 503
    return JSONResponse(content=checks, status_code=status_code)
