from os import environ
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = environ.get("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set")

# Engine setup remains similar, but Postgres handles connection pooling differently.
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Disable in production to reduce log noise
    pool_size=20,  # Connection pool size (adjust based on traffic)
    max_overflow=0,  # Prevent too many extra connections
)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

