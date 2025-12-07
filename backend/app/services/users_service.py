from app.schemas.auth import GoogleTokenPayload
from datetime import datetime, timedelta
from jose import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.models.user import User
from app.models.oauth import OAuthAccount

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    async def verify_google_token(id_token_str: str) -> GoogleTokenPayload:
        try:
            logger.debug(f"Verifying Google token with client ID: {settings.GOOGLE_CLIENT_ID[:20]}...")
            payload = id_token.verify_oauth2_token(
                id_token_str,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            logger.info(f"Token verified successfully for: {payload.get('email')}")
            return GoogleTokenPayload(
                sub=payload['sub'],
                email=payload['email'],
                name=payload.get('name') or payload.get('email'),  
                picture=payload.get('picture'),
            )
        except ValueError as e:
            # Token validation errors (wrong audience, expired, etc.)
            logger.error(f"Google token validation failed: {str(e)}")
            raise ValueError(f"Invalid Google token: {str(e)}") from e
        except Exception as e:
            # Other errors (network, parsing, etc.)
            logger.error(f"Unexpected error verifying Google token: {type(e).__name__}: {str(e)}")
            raise ValueError(f"Token verification error: {str(e)}") from e


    @staticmethod
    async def get_or_create_user(db: AsyncSession, payload: GoogleTokenPayload) -> User:
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalar_one_or_none()

        if not user:
            logger.info(f"Creating new user: {payload.email}")
            user = User(
                email=payload.email,
                name=payload.name,
                avatar_url=payload.picture,
            )

            db.add(user)

            await db.flush()
        else:
            logger.info(f"Existing user logged in: {payload.email}")

        result = await db.execute(
            select(OAuthAccount).where(
                OAuthAccount.user_id == user.id,
                OAuthAccount.provider == "google"
            )
        )

        oauth = result.scalar_one_or_none()

        if not oauth:
            logger.info(f"Creating OAuth account for user: {user.email}")
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
