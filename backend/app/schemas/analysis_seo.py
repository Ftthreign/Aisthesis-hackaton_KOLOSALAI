from pydantic import BaseModel


class AnalysisSEOResponse(BaseModel):
    keywords: list[str] | None = None
    hashtags: list[str] | None = None

    class Config:
        from_attributes = True
