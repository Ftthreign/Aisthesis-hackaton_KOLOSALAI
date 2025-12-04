from fastapi import APIRouter, Depends, HTTPException, Header
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
import time

from app.database import get_db
from app.config import settings
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from .service import UserService

router = APIRouter(prefix="/auth", tags=["Auth"])


# --- Helper: Token Factory ---
def create_tokens(user_id: str, email: str):
    access_payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": time.time() + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    }
    refresh_payload = {
        "sub": user_id,
        "email": email,
        "type": "refresh",
        "exp": time.time() + (settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)
    }

    return {
        "access_token": jwt.encode(access_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM),
        "refresh_token": jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM),
        "token_type": "bearer"
    }


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    body: GoogleAuthRequest,
    session: AsyncSession = Depends(get_db)
):
    try:
        id_info = id_token.verify_oauth2_token(
            body.id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )

        email = id_info.get("email")
        provider_account_id = id_info.get("sub")  # Google's unique user ID
        name = id_info.get("name")
        avatar_url = id_info.get("picture")

        service = UserService(session)
        user = await service.get_or_create_google(
            email=email,
            provider_account_id=provider_account_id,
            name=name,
            avatar_url=avatar_url,
        )

        return create_tokens(str(user.id), user.email)

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        return create_tokens(payload["sub"], payload["email"])

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
