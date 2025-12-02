from pydantic import BaseModel
from typing import List, Optional


class AnalysisPricingResponse(BaseModel):
    recommended_price: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    reasoning: Optional[str] = None
    promo_strategy: Optional[List[str]] = None
    best_posting_time: Optional[str] = None

    class Config:
        orm_mode = True
