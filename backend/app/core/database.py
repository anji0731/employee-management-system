from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings
import os

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

engine = create_async_engine(
    settings.get_database_url(),
    echo=False,
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in settings.get_database_url() else {"statement_cache_size": 0}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
