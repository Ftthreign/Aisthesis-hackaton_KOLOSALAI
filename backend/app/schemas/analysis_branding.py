from pydantic import BaseModel


class AnalysisBrandThemeResponse(BaseModel):
    primary_color: str | None = None
    secondary_color: str | None = None
    accent_color: str | None = None
    tone: str | None = None
    style_suggestions: list[str] | None = None

    class Config:
        orm_mode = True
