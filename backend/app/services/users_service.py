from app.schemas.auth import GoogleTokenPayload
from datetime import datetime, timedelta
from jose import jwt
from google.oauth2 import id_token
from google.auth.transport import requests

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.models.user import User
from app.models.oauth import OAuthAccount

class UserService:
    @staticmethod
    async def verify_google_token(id_token_str: str) -> GoogleTokenPayload:
        try:
            payload = id_token.verify_oauth2_token(
                id_token_str,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            return GoogleTokenPayload(
                sub=payload['sub'],
                email=payload['email'],
                name=payload['name'],
                picture=payload['picture'],
            )
        except Exception as e:
            raise ValueError("Invalid Google token") from e


    @staticmethod
    async def get_or_create_user(db: AsyncSession, payload: GoogleTokenPayload) -> User:
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                email=payload.email,
                name=payload.name,
                avatar_url=payload.picture,
            )

            db.add(user)

            await db.flush()

        result = await db.execute(
            select(OAuthAccount).where(
                OAuthAccount.user_id == user.id,
                OAuthAccount.provider == "google"
            )
        )

        oauth = result.scalar_one_or_none()

        if not oauth:
            oauth= OAuthAccount(
                user_id=user.id,
                provider="google",
                provider_account_id=payload.sub,
            )

            db.add(oauth)

        return user

    @staticmethod
    def create_access_token(data: dict) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        payload = data.copy()
        payload.update({"exp": expire})

        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def create_refresh_token(data: dict) -> str:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        payload = data.copy()
        payload.update({"exp": expire})

        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
