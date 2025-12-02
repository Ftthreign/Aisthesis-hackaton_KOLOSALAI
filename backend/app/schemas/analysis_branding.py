from pydantic import BaseModel
from typing import List, Optional


class AnalysisBrandThemeResponse(BaseModel):
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    tone: Optional[str] = None
    style_suggestions: Optional[List[str]] = None

    class Config:
        orm_mode = True
