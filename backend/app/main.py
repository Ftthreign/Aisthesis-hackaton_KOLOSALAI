from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import logging
import sys
import time

from app.config import settings
from app.database import get_db
from app.routers.auth_router import router as auth_router
from app.routers.analysis_router import router as analysis_router
from app.middleware import RateLimitMiddleware

from fastapi.staticfiles import StaticFiles
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Aisthesis API",
    description="API for Aisthesis",
    version="0.0.1",
    docs_url="/api/v1/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/v1/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/api/v1/openapi.json" if settings.ENVIRONMENT != "production" else None
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "app" / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Security: Trusted Host middleware
if settings.ENVIRONMENT == "production" and settings.ALLOWED_ORIGINS:
    trusted_hosts = [origin.replace("https://", "").replace("http://", "") for origin in settings.ALLOWED_ORIGINS]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)

# Rate limiting
if settings.ENVIRONMENT == "production":
    app.middleware("http")(RateLimitMiddleware(requests_per_minute=100))

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if settings.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Request timing middleware (for performance monitoring)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.3f}"
    
    if process_time > 1.0:  # > 1 second
        logger.warning(f"  SLOW REQUEST: {request.method} {request.url.path} took {process_time:.2f}s")
    else:
        logger.info(f"{request.method} {request.url.path} - {process_time:.3f}s")
    
    return response

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

app.include_router(auth_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")


@app.on_event("startup")
async def validate_config():
    """Validate required configuration on startup."""
    errors = []
    
    if not settings.GOOGLE_API_KEY:
        errors.append("GOOGLE_API_KEY must be set")
    
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
