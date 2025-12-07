from pydantic import BaseModel


class AnalysisMarketplaceResponse(BaseModel):
    shopee_desc: str | None = None
    tokopedia_desc: str | None = None
    instagram_desc: str | None = None

    class Config:
        from_attributes = True
