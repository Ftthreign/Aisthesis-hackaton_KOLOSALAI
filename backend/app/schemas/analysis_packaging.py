from pydantic import BaseModel


class AnalysisPackagingResponse(BaseModel):
    suggestions: list[str] | None = None
    material_recommendations: list[str] | None = None

    class Config:
        orm_mode = True
