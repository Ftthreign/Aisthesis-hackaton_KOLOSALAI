import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class AnalysisMarketplace(Base, TimestampMixin):
    __tablename__ = "analysis_marketplaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )

    shopee_desc = Column(Text, nullable=True)
    tokopedia_desc = Column(Text, nullable=True)
    instagram_desc = Column(Text, nullable=True)

    analysis = relationship("Analysis", back_populates="marketplace")
