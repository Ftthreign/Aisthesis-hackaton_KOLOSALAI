from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import  UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin
import uuid

class AnalysisActionPlan(Base, TimestampMixin):
    __tablename__ = "analysis_action_plans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    
    day_1 = Column(Text, nullable=True)
    day_2 = Column(Text, nullable=True)
    day_3 = Column(Text, nullable=True)
    day_4 = Column(Text, nullable=True)
    day_5 = Column(Text, nullable=True)
    day_6 = Column(Text, nullable=True)
    day_7 = Column(Text, nullable=True)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="action_plan")
