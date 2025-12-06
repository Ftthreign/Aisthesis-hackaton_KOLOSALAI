from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.users_service import UserService
from app.models.user import User as UserModel
from app.schemas.auth import GoogleAuthRequest, TokenResponse, TokenData
from app.schemas.user import UserResponse, UserData

from app.core.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/google/login", response_model=TokenResponse)
async def google_login(
    payload: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        google_data = await UserService.verify_google_token(payload.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google token"
        )

    user: UserModel = await UserService.get_or_create_user(db, google_data)

    access_token = UserService.create_access_token({"sub": str(user.id)})
    refresh_token = UserService.create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        data=TokenData(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user = Depends(get_current_user)):
    return UserResponse(data=UserData.model_validate(current_user))
