from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.repositories.master_repository import skill_repository
from app.services.master_service import MasterService
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse

router = APIRouter()
skill_service = MasterService(skill_repository)

class PaginatedSkillResponse(BaseModel):
    items: List[SkillResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedSkillResponse)
async def list_skills(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("master:read"))
):
    return await skill_service.list_paginated(
        db, page=page, page_size=page_size, search=search,
        search_fields=["name", "category", "description"], include_deleted=include_deleted,
        sort_by=sort_by, sort_order=sort_order
    )

@router.get("/{id}", response_model=SkillResponse)
async def get_skill(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:read"))):
    return await skill_service.get_by_id(db, id)

@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(payload: SkillCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await skill_service.create(db, payload)

@router.put("/{id}", response_model=SkillResponse)
async def update_skill(id: str, payload: SkillUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await skill_service.update(db, id, payload)

@router.delete("/{id}", response_model=SkillResponse)
async def soft_delete_skill(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await skill_service.soft_delete(db, id)

@router.post("/{id}/restore", response_model=SkillResponse)
async def restore_skill(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await skill_service.restore(db, id)
