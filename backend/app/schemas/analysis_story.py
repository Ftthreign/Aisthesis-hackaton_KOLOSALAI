from pydantic import BaseModel 
from typing import Optional 

class AnalysisStoryResponse(BaseModel):
    product_name: Optional[str] = None
    tagline: Optional[str] = None
    short_desc: Optional[str] = None
    long_desc: Optional[str] = None
    caption_casual: Optional[str] = None
    caption_professional: Optional[str] = None
    caption_storytelling: Optional[str] = None

    class Config:
        orm_mode = True