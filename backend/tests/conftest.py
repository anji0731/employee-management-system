import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import engine

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
