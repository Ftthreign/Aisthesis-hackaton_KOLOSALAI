from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from . import DataResponse


class UserBase(BaseModel):
    email: str
    name: str | None = None
    avatar_url: str | None = None
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None


class UserData(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserResponse(DataResponse[UserData]):
    """Wrapped user response."""
    pass
