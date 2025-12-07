from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    DATABASE_URL: str
    DATABASE_URL_SYNC: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_API_KEY: str
    GEMINI_VISION_MODEL: str = "gemini-1.5-flash-8b"
    GEMINI_LLM_MODEL: str = "gemini-1.5-flash-8b"

    # Redis Configuration
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379

    # Stored as comma-separated strings in env
    ALLOWED_ORIGINS_STR: str = ""
    ALLOWED_EXTENSIONS_STR: str = "jpg,jpeg,png,webp"

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024

    ENVIRONMENT: str = "development"

    @computed_field
    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        if not self.ALLOWED_ORIGINS_STR:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS_STR.split(",") if origin.strip()]

    @computed_field
    @property
    def ALLOWED_EXTENSIONS(self) -> list[str]:
        if not self.ALLOWED_EXTENSIONS_STR:
            return ["jpg", "jpeg", "png", "webp"]
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS_STR.split(",") if ext.strip()]



settings = Settings()
