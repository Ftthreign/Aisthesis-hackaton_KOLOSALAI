from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.models.oauth import OAuthAccount
from app.schemas.user import UserCreate


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_or_create_google(
        self,
        email: str,
        provider_account_id: str,
        name: str | None = None,
        avatar_url: str | None = None,
        access_token: str | None = None,
        refresh_token: str | None = None,
        expires_at: int | None = None,
    ) -> User:
        user = await self.get_by_email(email)
        if user:
            return user

        db_user = User(
            email=email,
            name=name or email.split("@")[0],
            avatar_url=avatar_url,
        )
        self.session.add(db_user)
        await self.session.flush()

        oauth_account = OAuthAccount(
            user_id=db_user.id,
            provider="google",
            provider_account_id=provider_account_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=expires_at,
        )
        self.session.add(oauth_account)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def create(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            name=user_in.name,
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user
