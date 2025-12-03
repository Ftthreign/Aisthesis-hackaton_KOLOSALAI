import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AnalysisPersona(Base, TimestampMixin):
    __tablename__ = "analysis_personas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    name = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    demographics = Column(JSONB, nullable=True)
    motivations = Column(JSONB, nullable=True)
    pain_points = Column(JSONB, nullable=True)

    analysis = relationship("Analysis", back_populates="persona")
