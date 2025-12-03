from typing import Any

from pydantic import BaseModel


class AnalysisPersonaResponse(BaseModel):
    name: str | None = None
    bio: str | None = None
    demographics: dict[str, Any] | None = None
    motivations: list[str] | None = None
    pain_points: list[str] | None = None

    class Config:
        orm_mode = True
