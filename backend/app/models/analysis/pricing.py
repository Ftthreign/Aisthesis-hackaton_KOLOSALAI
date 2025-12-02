from sqlalchemy import Column, String, Text, Float, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin
import uuid

class AnalysisPricing(Base, TimestampMixin):
    __tablename__ = "analysis_pricings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    
    recommended_price = Column(Float, nullable=True)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    reasoning = Column(Text, nullable=True)
    promo_strategy = Column(JSONB, nullable=True)  
    best_posting_time = Column(String(255), nullable=True)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="pricing")
