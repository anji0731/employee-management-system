from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.user import User

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email, User.is_deleted == False)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

user_repository = UserRepository()
