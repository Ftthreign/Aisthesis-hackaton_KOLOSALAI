import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AnalysisBrandTheme(Base, TimestampMixin):
    __tablename__ = "analysis_brand_themes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    primary_color = Column(String(50), nullable=True)
    secondary_color = Column(String(50), nullable=True)
    accent_color = Column(String(50), nullable=True)
    tone = Column(String(255), nullable=True)
    style_suggestions = Column(JSONB, nullable=True)

    # Relationships
    analysis = relationship("Analysis", back_populates="brand_theme")
