from pydantic import BaseModel


class AnalysisPackagingResponse(BaseModel):
    suggestions: list[str] | None = None
    material_recommendations: list[str] | None = None

    class Config:
        from_attributes = True
