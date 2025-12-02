from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session
from .schemas import UserCreate, UserPublic
from .service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    return UserService(session)

@router.post("/", response_model=UserPublic)
async def create_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service) 
):
    return await service.create(user_in)