import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AnalysisTaste(Base, TimestampMixin):
    __tablename__ = "analysis_tastes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    taste_profile = Column(JSONB, nullable=True)  # Array of strings
    aroma_profile = Column(JSONB, nullable=True)  # Array of strings
    sensory_persona = Column(Text, nullable=True)
    pairing = Column(JSONB, nullable=True)  # Array of strings

    # Relationships
    analysis = relationship("Analysis", back_populates="taste")
