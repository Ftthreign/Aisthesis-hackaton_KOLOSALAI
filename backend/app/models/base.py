from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  # flake8: F401


class TimestampMixin:
    """
    Mixin class for timestamp columns
    """

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
