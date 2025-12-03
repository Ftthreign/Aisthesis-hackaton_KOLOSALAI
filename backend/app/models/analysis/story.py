import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class AnalysisStory(Base, TimestampMixin):
    __tablename__ = "analysis_stories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    product_name = Column(String(255), nullable=True)
    tagline = Column(String(500), nullable=True)
    short_desc = Column(Text, nullable=True)
    long_desc = Column(Text, nullable=True)
    caption_casual = Column(Text, nullable=True)
    caption_professional = Column(Text, nullable=True)
    caption_storytelling = Column(Text, nullable=True)

    analysis = relationship("Analysis", back_populates="story")
