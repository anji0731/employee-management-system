import uuid
from typing import Optional, Dict, Any, List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository

class MasterService:
    def __init__(self, repository: BaseRepository):
        self.repository = repository

    async def list_paginated(
        self,
        db: AsyncSession,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        search_fields: List[str] = None,
        include_deleted: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        skip = (page - 1) * page_size
        items, total = await self.repository.get_paginated(
            db,
            skip=skip,
            limit=page_size,
            search=search,
            search_fields=search_fields,
            include_deleted=include_deleted,
            sort_by=sort_by,
            sort_order=sort_order
        )
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

    async def get_by_id(self, db: AsyncSession, item_id: str):
        item = await self.repository.get_by_id(db, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item

    async def create(self, db: AsyncSession, schema_in: Any):
        data = schema_in.model_dump()
        data["id"] = str(uuid.uuid4())
        model_instance = self.repository.model(**data)
        return await self.repository.create(db, model_instance)

    async def update(self, db: AsyncSession, item_id: str, schema_in: Any):
        item = await self.get_by_id(db, item_id)
        data = schema_in.model_dump(exclude_unset=True)
        return await self.repository.update(db, item, data)

    async def soft_delete(self, db: AsyncSession, item_id: str):
        item = await self.get_by_id(db, item_id)
        if hasattr(item, "soft_delete"):
            item.soft_delete()
            await db.commit()
            await db.refresh(item)
            return item
        else:
            await self.repository.delete(db, item_id)
            return item

    async def restore(self, db: AsyncSession, item_id: str):
        item = await self.get_by_id(db, item_id)
        if hasattr(item, "restore"):
            item.restore()
            await db.commit()
            await db.refresh(item)
            return item
        return item
