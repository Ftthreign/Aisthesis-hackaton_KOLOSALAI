from pydantic import BaseModel
from typing import List, Optional


class AnalysisSEOResponse(BaseModel):
    keywords: Optional[List[str]] = None
    hashtags: Optional[List[str]] = None

    class Config:
        orm_mode = True
