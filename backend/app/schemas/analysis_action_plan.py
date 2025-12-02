from pydantic import BaseModel
from typing import Optional


class AnalysisActionPlanResponse(BaseModel):
    day_1: Optional[str] = None
    day_2: Optional[str] = None
    day_3: Optional[str] = None
    day_4: Optional[str] = None
    day_5: Optional[str] = None
    day_6: Optional[str] = None
    day_7: Optional[str] = None

    class Config:
        orm_mode = True
