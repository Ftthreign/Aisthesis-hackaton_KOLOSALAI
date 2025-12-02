from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

from .vision import VisionResult
from .analysis_story import AnalysisStoryResponse
from .analysis_taste import AnalysisTasteResponse
from .analysis_pricing import AnalysisPricingResponse
from .analysis_branding import AnalysisBrandThemeResponse
from .analysis_seo import AnalysisSEOResponse
from .analysis_marketplace import AnalysisMarketplaceResponse
from .analysis_person import AnalysisPersonaResponse
from .analysis_packaging import AnalysisPackagingResponse
from .analysis_action_plan import AnalysisActionPlanResponse


class AnalysisBase(BaseModel):
    image_url: str
    image_filename: str
    vision_result: Optional[VisionResult] = None


class AnalysisResponse(AnalysisBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    story: Optional[AnalysisStoryResponse] = None
    taste: Optional[AnalysisTasteResponse] = None
    pricing: Optional[AnalysisPricingResponse] = None
    brand_theme: Optional[AnalysisBrandThemeResponse] = None
    seo: Optional[AnalysisSEOResponse] = None
    marketplace: Optional[AnalysisMarketplaceResponse] = None
    persona: Optional[AnalysisPersonaResponse] = None
    packaging: Optional[AnalysisPackagingResponse] = None
    action_plan: Optional[AnalysisActionPlanResponse] = None

    class Config:
        orm_mode = True


class AnalysisListItem(BaseModel):
    id: UUID
    image_url: str
    created_at: datetime

    class Config:
        orm_mode = True
