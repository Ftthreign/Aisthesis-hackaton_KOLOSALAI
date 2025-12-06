from pydantic import BaseModel


class AnalysisTasteResponse(BaseModel):
    taste_profile: list[str] | None = None
    aroma_profile: list[str] | None = None
    sensory_persona: str | None = None
    pairing: list[str] | None = None

    class Config:
        from_attributes = True
