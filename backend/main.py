from fastapi import APIRouter, FastAPI
from pydantic import BaseModel
from users.router import router as users_router
from users.auth_router import router as auth_router

# Main app with /api/v1 prefix for docs
app = FastAPI(
    title="Aisthesis API",
    version="1.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json",
)


class HealthResponse(BaseModel):
    status: str
    speed: str


router = APIRouter(prefix="/api/v1")
router.include_router(users_router)
router.include_router(auth_router)


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", speed="blazing")


app.include_router(router)
