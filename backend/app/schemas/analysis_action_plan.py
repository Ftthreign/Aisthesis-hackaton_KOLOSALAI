from pydantic import BaseModel


class AnalysisActionPlanResponse(BaseModel):
    day_1: str | None = None
    day_2: str | None = None
    day_3: str | None = None
    day_4: str | None = None
    day_5: str | None = None
    day_6: str | None = None
    day_7: str | None = None

    class Config:
        orm_mode = True
