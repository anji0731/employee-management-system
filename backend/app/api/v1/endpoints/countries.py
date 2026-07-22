from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.repositories.master_repository import country_repository
from app.services.master_service import MasterService
from app.schemas.location import CountryCreate, CountryUpdate, CountryResponse

router = APIRouter()
country_service = MasterService(country_repository)

class PaginatedCountryResponse(BaseModel):
    items: List[CountryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedCountryResponse)
async def list_countries(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("master:read"))
):
    return await country_service.list_paginated(
        db, page=page, page_size=page_size, search=search,
        search_fields=["name", "code"], include_deleted=include_deleted,
        sort_by=sort_by, sort_order=sort_order
    )

@router.get("/{id}", response_model=CountryResponse)
async def get_country(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:read"))):
    return await country_service.get_by_id(db, id)

@router.post("", response_model=CountryResponse, status_code=status.HTTP_201_CREATED)
async def create_country(payload: CountryCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await country_service.create(db, payload)

@router.put("/{id}", response_model=CountryResponse)
async def update_country(id: str, payload: CountryUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await country_service.update(db, id, payload)

@router.delete("/{id}", response_model=CountryResponse)
async def soft_delete_country(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await country_service.soft_delete(db, id)

@router.post("/{id}/restore", response_model=CountryResponse)
async def restore_country(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("master:write"))):
    return await country_service.restore(db, id)
