from pydantic import BaseModel
from typing import List, Optional


class AnalysisPackagingResponse(BaseModel):
    suggestions: Optional[List[str]] = None
    material_recommendations: Optional[List[str]] = None

    class Config:
        orm_mode = True
