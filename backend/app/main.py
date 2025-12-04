from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_router import router as auth_router

from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Aisthesis API",
    description="API for Aisthesis",
    version="0.0.1",

    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
