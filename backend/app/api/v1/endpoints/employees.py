import os
import shutil
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.services.employee_service import employee_service
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter()

class PaginatedEmployeeResponse(BaseModel):
    items: List[EmployeeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=PaginatedEmployeeResponse)
async def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:read:all"))
):
    """Retrieve paginated list of employees with search, department filter, and sorting."""
    return await employee_service.list_employees(
        db,
        page=page,
        page_size=page_size,
        search=search,
        department_id=department_id,
        status_filter=status,
        gender_filter=gender,
        include_deleted=include_deleted,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/{id}", response_model=EmployeeResponse)
async def get_employee_by_id(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:read:all"))
):
    """Retrieve a single employee by unique ID."""
    employee = await employee_service.get(db, id)
    if not employee or employee.is_deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:create"))
):
    """Create a new employee record."""
    return await employee_service.create_employee(db, payload, created_by_id=current_user.id)

@router.put("/{id}", response_model=EmployeeResponse)
async def update_employee(
    id: str,
    payload: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:update:all"))
):
    """Update existing employee details."""
    return await employee_service.update_employee(db, id, payload, updated_by_id=current_user.id)

@router.delete("/{id}", response_model=EmployeeResponse)
async def soft_delete_employee(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:delete"))
):
    """Soft delete an employee record."""
    return await employee_service.soft_delete_employee(db, id)

@router.post("/{id}/restore", response_model=EmployeeResponse)
async def restore_employee(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:delete"))
):
    """Restore a soft-deleted employee record."""
    return await employee_service.restore_employee(db, id)

@router.post("/{id}/avatar", response_model=EmployeeResponse)
async def upload_employee_avatar(
    id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:update:all"))
):
    """Upload profile avatar image (JPG, JPEG, PNG, WEBP)."""
    employee = await employee_service.get(db, id)
    if not employee or employee.is_deleted:
        raise HTTPException(status_code=404, detail="Employee not found")

    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image file format. Supported: JPG, PNG, WEBP")

    ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
    filename = f"avatar_{id}_{uuid.uuid4().hex[:8]}{ext}"
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "uploads", "avatars")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/uploads/avatars/{filename}"
    employee.avatar_url = avatar_url
    await db.commit()
    await db.refresh(employee)
    return employee
