from pydantic import BaseModel
from typing import Any, Dict, List, Optional

"""
impl: [TEMP] From Gemini API response
"""
class VisionResult(BaseModel):
    labels: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    objects: Optional[List[str]] = None
    mood: Optional[str] = None
    raw: Optional[Dict[str, Any]] = None 

    class Config:
        orm_mode = True
