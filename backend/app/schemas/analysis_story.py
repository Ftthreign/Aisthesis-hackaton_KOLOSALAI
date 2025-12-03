from pydantic import BaseModel


class AnalysisStoryResponse(BaseModel):
    product_name: str | None = None
    tagline: str | None = None
    short_desc: str | None = None
    long_desc: str | None = None
    caption_casual: str | None = None
    caption_professional: str | None = None
    caption_storytelling: str | None = None

    class Config:
        orm_mode = True
