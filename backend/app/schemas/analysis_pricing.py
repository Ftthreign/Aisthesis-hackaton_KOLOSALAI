from pydantic import BaseModel


class AnalysisPricingResponse(BaseModel):
    recommended_price: float | None = None
    min_price: float | None = None
    max_price: float | None = None
    reasoning: str | None = None
    promo_strategy: list[str] | None = None
    best_posting_time: str | None = None

    class Config:
        from_attributes = True
