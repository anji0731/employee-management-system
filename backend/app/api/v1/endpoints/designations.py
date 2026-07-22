from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.repositories.master_repository import designation_repository
from app.services.master_service import MasterService
from app.schemas.department import DesignationCreate, DesignationUpdate, DesignationResponse

router = APIRouter()
designation_service = MasterService(designation_repository)

class PaginatedDesignationResponse(BaseModel):
    items: List[DesignationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedDesignationResponse)
async def list_designations(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("master:read"))
):
    return await designation_service.list_paginated(
        db, page=page, page_size=page_size, search=search,
        search_fields=["title", "code"], include_deleted=include_deleted,
        sort_by=sort_by, sort_order=sort_order
    )

@router.get("/{id}", response_model=DesignationResponse)
async def get_designation(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:read"))):
    return await designation_service.get_by_id(db, id)

@router.post("", response_model=DesignationResponse, status_code=status.HTTP_201_CREATED)
async def create_designation(payload: DesignationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await designation_service.create(db, payload)

@router.put("/{id}", response_model=DesignationResponse)
async def update_designation(id: str, payload: DesignationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await designation_service.update(db, id, payload)

@router.delete("/{id}", response_model=DesignationResponse)
async def soft_delete_designation(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await designation_service.soft_delete(db, id)

@router.post("/{id}/restore", response_model=DesignationResponse)
async def restore_designation(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await designation_service.restore(db, id)
