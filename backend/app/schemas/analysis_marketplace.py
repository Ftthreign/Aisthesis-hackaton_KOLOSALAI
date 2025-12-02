from pydantic import BaseModel
from typing import Optional


class AnalysisMarketplaceResponse(BaseModel):
    shopee_desc: Optional[str] = None
    tokopedia_desc: Optional[str] = None
    instagram_desc: Optional[str] = None

    class Config:
        orm_mode = True
