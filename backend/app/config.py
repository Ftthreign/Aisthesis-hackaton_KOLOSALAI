from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_SYNC: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GOOGLE_API_KEY: str
    GEMINI_VISION_MODEL: str = "gemini-2.0-flash-exp"
    GEMINI_LLM_MODEL: str = "gemini-2.0-flash-exp"

    ALLOWED_ORIGINS: list[str] = []

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024
    ALLOWED_EXTENSIONS: list[str] = ["jpg", "jpeg", "png", "webp"]

    ENVIRONMENT: str = "development"

    class Config: 
        env_file = ".env"
        case_sensitive = True

settings = Settings()