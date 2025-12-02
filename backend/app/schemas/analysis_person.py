from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class AnalysisPersonaResponse(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    demographics: Optional[Dict[str, Any]] = None
    motivations: Optional[List[str]] = None
    pain_points: Optional[List[str]] = None

    class Config:
        orm_mode = True
