import asyncio
from app.db.session import engine, AsyncSessionLocal
from app.db.base import Base
import app.models  # Ensures all models are registered in Base.metadata
from app.db.seed import seed_database

async def init_db():
    print("Creating database tables if not existing...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables initialized successfully.")

    async with AsyncSessionLocal() as db:
        await seed_database(db)

if __name__ == "__main__":
    asyncio.run(init_db())
