from pydantic import BaseModel 
from typing import Optional 

class AnalysisTasteResponse(BaseModel):
    taste_profile: Optional[List[str]] = None 
    aroma_profile: Optional[List[str]] = None 
    sensory_persona: Optional[str] = None 
    pairing: Optional[List[str]] = None 

    class Config:
        orm_mode = True

