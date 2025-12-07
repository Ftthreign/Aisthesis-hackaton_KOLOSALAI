"""
impl: [TEMP] From Gemini API response
"""

from typing import Any

from pydantic import BaseModel


class VisionResult(BaseModel):
    labels: list[str] | None = None
    colors: list[str] | None = None
    objects: list[str] | None = None
    mood: str | None = None
    raw: dict[str, Any] | None = None

    class Config:
        from_attributes = True
