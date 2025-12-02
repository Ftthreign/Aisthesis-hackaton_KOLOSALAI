from sqlalchemy.ext.asyncio import AsyncSession
from .models import User
from .schemas import UserCreate

class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email, 
            hashed_password=user_in.password + "hashed" # Fake hash (temp)
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user