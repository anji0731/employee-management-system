from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.repositories.master_repository import state_repository
from app.services.master_service import MasterService
from app.schemas.location import StateCreate, StateUpdate, StateResponse

router = APIRouter()
state_service = MasterService(state_repository)

class PaginatedStateResponse(BaseModel):
    items: List[StateResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedStateResponse)
async def list_states(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("master:read"))
):
    return await state_service.list_paginated(
        db, page=page, page_size=page_size, search=search,
        search_fields=["name", "code"], include_deleted=include_deleted,
        sort_by=sort_by, sort_order=sort_order
    )

@router.get("/{id}", response_model=StateResponse)
async def get_state(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:read"))):
    return await state_service.get_by_id(db, id)

@router.post("", response_model=StateResponse, status_code=status.HTTP_201_CREATED)
async def create_state(payload: StateCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await state_service.create(db, payload)

@router.put("/{id}", response_model=StateResponse)
async def update_state(id: str, payload: StateUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await state_service.update(db, id, payload)

@router.delete("/{id}", response_model=StateResponse)
async def soft_delete_state(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await state_service.soft_delete(db, id)

@router.post("/{id}/restore", response_model=StateResponse)
async def restore_state(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await state_service.restore(db, id)
