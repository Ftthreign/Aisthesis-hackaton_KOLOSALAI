from datetime import datetime
from enum import Enum
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


class AnalysisStatusEnum(str, Enum):
    """Status enum for analysis processing."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AnalysisBase(BaseModel):
    image_url: str
    image_filename: str
    vision_result: VisionResult | None = None


class AnalysisCreateData(BaseModel):
    """Response data for newly created analysis (async job queued)."""
    id: UUID
    status: AnalysisStatusEnum

    class Config:
        from_attributes = True


class AnalysisCreateResponse(DataResponse[AnalysisCreateData]):
    """Wrapped response for POST /analysis (202 Accepted)."""
    pass


class AnalysisStatusData(BaseModel):
    """Response data for pending/processing analysis."""
    id: UUID
    status: AnalysisStatusEnum
    error: str | None = None

    class Config:
        from_attributes = True


class AnalysisStatusResponse(DataResponse[AnalysisStatusData]):
    """Wrapped response for analysis status check."""
    pass


class AnalysisData(AnalysisBase):
    """Full analysis data for completed analysis."""
    id: UUID
    status: AnalysisStatusEnum
    error: str | None = None
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
    """Wrapped analysis response for GET /analysis/{id}."""
    pass


class AnalysisListItem(BaseModel):
    id: UUID
    image_url: str
    status: AnalysisStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True
