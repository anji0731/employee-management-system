from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.repositories.master_repository import city_repository
from app.services.master_service import MasterService
from app.schemas.location import CityCreate, CityUpdate, CityResponse

router = APIRouter()
city_service = MasterService(city_repository)

class PaginatedCityResponse(BaseModel):
    items: List[CityResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedCityResponse)
async def list_cities(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("master:read"))
):
    return await city_service.list_paginated(
        db, page=page, page_size=page_size, search=search,
        search_fields=["name"], include_deleted=include_deleted,
        sort_by=sort_by, sort_order=sort_order
    )

@router.get("/{id}", response_model=CityResponse)
async def get_city(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:read"))):
    return await city_service.get_by_id(db, id)

@router.post("", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
async def create_city(payload: CityCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await city_service.create(db, payload)

@router.put("/{id}", response_model=CityResponse)
async def update_city(id: str, payload: CityUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await city_service.update(db, id, payload)

@router.delete("/{id}", response_model=CityResponse)
async def soft_delete_city(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await city_service.soft_delete(db, id)

@router.post("/{id}/restore", response_model=CityResponse)
async def restore_city(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await city_service.restore(db, id)
