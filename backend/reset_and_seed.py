import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.base import Base
from app.db.session import engine
from app.seed import seed_initial_data

async def main():
    print("Dropping all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("Recreating all tables...")
        await conn.run_sync(Base.metadata.create_all)
    print("Running initial database seed...")
    await seed_initial_data()
    print("Reset and seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
