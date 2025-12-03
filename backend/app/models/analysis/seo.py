import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AnalysisSEO(Base, TimestampMixin):
    __tablename__ = "analysis_seo"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    keywords = Column(JSONB, nullable=True)
    hashtags = Column(JSONB, nullable=True)

    analysis = relationship("Analysis", back_populates="seo")
