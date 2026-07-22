import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import engine

from app.db.base import Base

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    loop = asyncio.new_event_loop()
    try:
        async def create_tables():
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        loop.run_until_complete(create_tables())
    finally:
        loop.close()
    yield

@pytest.fixture(autouse=True)
def cleanup_connections():
    yield
    try:
        # Dispose the engine connections to prevent event loop mismatch between sync tests
        loop = asyncio.new_event_loop()
        loop.run_until_complete(engine.dispose())
        loop.close()
    except Exception:
        pass

@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
