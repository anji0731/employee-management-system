import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func, desc, asc
from pydantic import BaseModel, EmailStr, ConfigDict

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.core.security import get_password_hash
from app.models.user import User
from app.models.role import Role
from app.models.audit import AuditLog
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

class PaginatedUserResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    model_config = ConfigDict(from_attributes=True)

class ResetPasswordPayload(BaseModel):
    new_password: str

class AssignRolePayload(BaseModel):
    role_id: str

@router.get("", response_model=PaginatedUserResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    role_id: Optional[str] = Query(None),
    include_deleted: bool = Query(False),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("admin:users"))
):
    query = select(User)
    if not include_deleted:
        query = query.where(User.is_deleted == False)

    if search:
        term = f"%{search}%"
        query = query.where(or_(User.full_name.ilike(term), User.email.ilike(term)))

    if role_id:
        query = query.where(User.role_id == role_id)

    count_stmt = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    sort_col = getattr(User, sort_by, User.created_at)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(asc(sort_col))

    skip = (page - 1) * page_size
    query = query.offset(skip).limit(page_size)
    results = (await db.execute(query)).scalars().all()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    return {
        "items": list(results),
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

@router.get("/{id}", response_model=UserResponse)
async def get_user(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("admin:users"))):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("admin:users"))
):
    existing = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    new_user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        full_name=payload.full_name,
        role_id=payload.role_id,
        is_active=payload.is_active,
        is_superuser=payload.is_superuser
    )
    db.add(new_user)

    # Auto-link to existing Employee profile if email matches
    from app.models.employee import Employee
    emp_stmt = select(Employee).where(Employee.email == payload.email)
    employee = (await db.execute(emp_stmt)).scalar_one_or_none()
    if employee:
        employee.user_id = new_user.id

    audit = AuditLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        user_email=current_user.email,
        action="CREATE_USER",
        entity_name="User",
        entity_id=new_user.id
    )
    db.add(audit)

    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.put("/{id}", response_model=UserResponse)
async def update_user(
    id: str,
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("admin:users"))
):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.email and payload.email != user.email:
        existing = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email address already in use.")

    update_data = payload.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        user.password_hash = get_password_hash(update_data.pop("password"))

    for field, val in update_data.items():
        setattr(user, field, val)

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{id}", response_model=UserResponse)
async def soft_delete_user(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.soft_delete()
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/{id}/restore", response_model=UserResponse)
async def restore_user(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.restore()
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/{id}/toggle-status", response_model=UserResponse)
async def toggle_user_status(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_permission("admin:users"))):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/{id}/reset-password")
async def reset_user_password(
    id: str,
    payload: ResetPasswordPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("admin:users"))
):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(payload.new_password)
    await db.commit()
    return {"message": f"Password reset successfully for {user.email}"}

@router.post("/{id}/assign-role", response_model=UserResponse)
async def assign_user_role(
    id: str,
    payload: AssignRolePayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("admin:users"))
):
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = (await db.execute(select(Role).where(Role.id == payload.role_id))).scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    user.role_id = role.id
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/registrations/pending", response_model=List[UserResponse])
async def list_pending_registrations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:create"))
):
    """List all user registration requests pending approval."""
    stmt = select(User).where(User.status == "Pending Approval", User.is_deleted == False)
    result = await db.execute(stmt)
    return list(result.scalars().all())

@router.post("/registrations/{id}/approve", response_model=UserResponse)
async def approve_registration(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:create"))
):
    """Approve a user registration request."""
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Registration request not found")

    user.status = "Active"
    user.is_active = True
    
    # Create employee record if not existing
    from app.models.employee import Employee
    from app.models.department import Department, Designation
    from app.models.location import Country, City
    from datetime import datetime

    emp_stmt = select(Employee).where(Employee.email == user.email)
    employee = (await db.execute(emp_stmt)).scalar_one_or_none()
    if not employee:
        # Get defaults
        dept_id = (await db.execute(select(Department.id))).scalars().first()
        desig_id = (await db.execute(select(Designation.id))).scalars().first()
        country_id = (await db.execute(select(Country.id))).scalars().first()
        city_id = (await db.execute(select(City.id))).scalars().first()

        if not dept_id or not desig_id or not country_id or not city_id:
            raise HTTPException(status_code=400, detail="Ensure master data exists before approving registrations")

        employee = Employee(
            id=str(uuid.uuid4()),
            user_id=user.id,
            employee_code=f"EMP-{uuid.uuid4().hex[:6].upper()}",
            first_name=user.full_name.split(" ")[0] if " " in user.full_name else user.full_name,
            last_name=user.full_name.split(" ")[1] if " " in user.full_name else "Employee",
            email=user.email,
            mobile="9999999999",
            gender="Male",
            date_of_birth=datetime.now().date(),
            joining_date=datetime.now().date(),
            department_id=dept_id,
            designation_id=desig_id,
            country_id=country_id,
            city_id=city_id,
            status="Active"
        )
        db.add(employee)
    else:
        employee.user_id = user.id

    audit = AuditLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        user_email=current_user.email,
        action="APPROVE_USER_REGISTRATION",
        entity_name="User",
        entity_id=user.id
    )
    db.add(audit)

    await db.commit()
    await db.refresh(user)
    return user

class RejectionPayload(BaseModel):
    reason: Optional[str] = None

@router.post("/registrations/{id}/reject", response_model=UserResponse)
async def reject_registration(
    id: str,
    payload: RejectionPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("emp:create"))
):
    """Reject a user registration request."""
    stmt = select(User).where(User.id == id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Registration request not found")

    user.status = "Rejected"
    user.is_active = False

    audit = AuditLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        user_email=current_user.email,
        action="REJECT_USER_REGISTRATION",
        entity_name="User",
        entity_id=user.id
    )
    db.add(audit)

    await db.commit()
    await db.refresh(user)
    return user
