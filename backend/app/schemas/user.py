from pydantic import BaseModel 
from uuid import UUID
from datetime import datetime 
from typing import Optional 

class UserBase(BaseModel):
    email: str 
    name: Optional[str] = None 
    avatar_url: Optional[str] = None
    is_active: bool = True

class UserResponse(UserBase):
    id: UUID
    created_at: datetime 
    updated_at: datetime 

    class Config:
        orm_mode = True