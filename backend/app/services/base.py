from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository

RepoType = TypeVar("RepoType", bound=BaseRepository)

class BaseService(Generic[RepoType]):
    """Generic base service class encapsulating repository operations."""

    def __init__(self, repository: RepoType):
        self.repository = repository

    async def get(self, db: AsyncSession, id: Any):
        return await self.repository.get_by_id(db, id)

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        return await self.repository.get_all(db, skip=skip, limit=limit)
