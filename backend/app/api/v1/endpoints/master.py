from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.department import Department, Designation
from app.models.location import Country, City
from app.schemas.department import DepartmentSchema, DesignationSchema, CountrySchema, CitySchema

router = APIRouter()

@router.get("/departments", response_model=List[DepartmentSchema])
async def list_departments(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    stmt = select(Department).order_by(Department.name)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/designations", response_model=List[DesignationSchema])
async def list_designations(
    department_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    stmt = select(Designation)
    if department_id:
        stmt = stmt.where(Designation.department_id == department_id)
    stmt = stmt.order_by(Designation.title)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/countries", response_model=List[CountrySchema])
async def list_countries(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    stmt = select(Country).order_by(Country.name)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/cities", response_model=List[CitySchema])
async def list_cities(
    country_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    stmt = select(City)
    if country_id:
        stmt = stmt.where(City.country_id == country_id)
    stmt = stmt.order_by(City.name)
    result = await db.execute(stmt)
    return result.scalars().all()
