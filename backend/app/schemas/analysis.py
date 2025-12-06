from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from . import DataResponse
from .analysis_action_plan import AnalysisActionPlanResponse
from .analysis_branding import AnalysisBrandThemeResponse
from .analysis_marketplace import AnalysisMarketplaceResponse
from .analysis_packaging import AnalysisPackagingResponse
from .analysis_person import AnalysisPersonaResponse
from .analysis_pricing import AnalysisPricingResponse
from .analysis_seo import AnalysisSEOResponse
from .analysis_story import AnalysisStoryResponse
from .analysis_taste import AnalysisTasteResponse
from .vision import VisionResult


class AnalysisBase(BaseModel):
    image_url: str
    image_filename: str
    vision_result: VisionResult | None = None


class AnalysisData(AnalysisBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    story: AnalysisStoryResponse | None = None
    taste: AnalysisTasteResponse | None = None
    pricing: AnalysisPricingResponse | None = None
    brand_theme: AnalysisBrandThemeResponse | None = None
    seo: AnalysisSEOResponse | None = None
    marketplace: AnalysisMarketplaceResponse | None = None
    persona: AnalysisPersonaResponse | None = None
    packaging: AnalysisPackagingResponse | None = None
    action_plan: AnalysisActionPlanResponse | None = None

    class Config:
        from_attributes = True


class AnalysisResponse(DataResponse[AnalysisData]):
    """Wrapped analysis response."""
    pass


class AnalysisListItem(BaseModel):
    id: UUID
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True
