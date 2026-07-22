from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

db_url = settings.get_database_url()

# Fallback to local sqlite if postgresql connection string isn't active or local dev mode
if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

import sys
from sqlalchemy.pool import NullPool

extra_args = {}
if "pytest" in sys.modules:
    extra_args["poolclass"] = NullPool

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    connect_args=connect_args,
    **extra_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)
