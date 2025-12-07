import uuid
from enum import Enum as PyEnum

from app.models.base import Base, TimestampMixin
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AnalysisStatus(str, PyEnum):
    """Status enum for analysis processing."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Analysis(Base, TimestampMixin):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Status tracking (using String for simpler migrations)
    status = Column(
        String(20),
        default=AnalysisStatus.PENDING.value,
        server_default="PENDING",
        nullable=False,
    )
    error = Column(Text, nullable=True)

    # Image info
    image_url = Column(String(500), nullable=False)
    image_filename = Column(String(255), nullable=False)

    # Vision analysis (JSONB untuk fleksibilitas)
    vision_result = Column(JSONB, nullable=True)

    # Relationships
    user = relationship("User", back_populates="analyses")
    story = relationship(
        "AnalysisStory", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    taste = relationship(
        "AnalysisTaste", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    pricing = relationship(
        "AnalysisPricing", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    brand_theme = relationship(
        "AnalysisBrandTheme", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    seo = relationship(
        "AnalysisSEO", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    marketplace = relationship(
        "AnalysisMarketplace",
        back_populates="analysis",
        uselist=False,
        cascade="all, delete-orphan",
    )
    persona = relationship(
        "AnalysisPersona", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    packaging = relationship(
        "AnalysisPackaging", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
    action_plan = relationship(
        "AnalysisActionPlan", back_populates="analysis", uselist=False, cascade="all, delete-orphan"
    )
