from sqlalchemy import Column,  ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, TimestampMixin
import uuid

class AnalysisPackaging(Base, TimestampMixin):
    __tablename__ = "analysis_packagings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    
    suggestions = Column(JSONB, nullable=True) 
    material_recommendations = Column(JSONB, nullable=True)  
    
    analysis = relationship("Analysis", back_populates="packaging")
