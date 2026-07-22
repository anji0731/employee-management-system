from typing import Generic, TypeVar, Type, Optional, List, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """Generic async repository providing foundational data access operations."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        stmt = select(self.model).where(self.model.id == id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ModelType]:
        stmt = select(self.model).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, obj_in: ModelType) -> ModelType:
        db.add(obj_in)
        await db.commit()
        await db.refresh(obj_in)
        return obj_in

    async def update(self, db: AsyncSession, db_obj: ModelType, obj_in_data: dict) -> ModelType:
        for field, value in obj_in_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id: Any) -> bool:
        db_obj = await self.get_by_id(db, id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
            return True
        return False

    async def get_paginated(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        search_fields: List[str] = None,
        include_deleted: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[ModelType], int]:
        query = select(self.model)

        if hasattr(self.model, "is_deleted") and not include_deleted:
            query = query.where(self.model.is_deleted == False)

        if search and search_fields:
            search_conditions = []
            search_term = f"%{search}%"
            for field in search_fields:
                if hasattr(self.model, field):
                    col = getattr(self.model, field)
                    search_conditions.append(col.ilike(search_term))
            if search_conditions:
                query = query.where(or_(*search_conditions))

        # Count Total
        count_stmt = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_stmt)).scalar() or 0

        # Sorting
        sort_col_name = sort_by if hasattr(self.model, sort_by) else "created_at"
        if hasattr(self.model, sort_col_name):
            sort_column = getattr(self.model, sort_col_name)
            if sort_order.lower() == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))

        # Pagination
        query = query.offset(skip).limit(limit)
        results = (await db.execute(query)).scalars().all()

        return list(results), total
