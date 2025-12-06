from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.config import settings
from app.database import get_db
from app.models.user import User

logger = logging.getLogger(__name__)

oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: str = Depends(oauth_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            logger.warning("Token missing 'sub' claim")
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        logger.warning(f"JWT decode error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        logger.warning(f"User {user_id} not found in database")
        raise HTTPException(status_code=404, detail="User not found")

    return user
