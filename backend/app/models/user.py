import uuid

from app.models.base import Base, TimestampMixin
from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, nullable=False
    )
    email = Column(String(255), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    oauth_accounts = relationship(
        "OAuthAccount", back_populates="user", cascade="all, delete-orphan"
    )
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
