from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import jwt
import uuid
from datetime import datetime, timezone

from app.db.session import AsyncSessionLocal
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.models.user import User
from app.models.role import Role
from app.models.audit import AuditLog
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserProfileResponse
)

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(
    request_data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.email == request_data.email, User.is_deleted == False)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user or not verify_password(request_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Login failed: Your account status is '{user.status}'. Please wait for administrator approval.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is currently inactive",
        )

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    # Log Login Audit Event
    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        user_id=user.id,
        user_email=user.email,
        action="LOGIN",
        entity_name="User",
        entity_id=user.id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit_entry)
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request_data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.email == request_data.email)
    existing_user = (await db.execute(stmt)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    role_stmt = select(Role).where(Role.name == "Standard Employee")
    default_role = (await db.execute(role_stmt)).scalar_one_or_none()
    role_id = default_role.id if default_role else None

    new_user = User(
        id=str(uuid.uuid4()),
        email=request_data.email,
        password_hash=get_password_hash(request_data.password),
        full_name=request_data.full_name,
        role_id=role_id,
        is_active=False,
        status="Pending Approval",
        is_superuser=False
    )
    db.add(new_user)
    await db.flush()

    # Auto-link to existing Employee profile if email matches
    from app.models.employee import Employee
    emp_stmt = select(Employee).where(Employee.email == request_data.email)
    employee = (await db.execute(emp_stmt)).scalar_one_or_none()
    if employee:
        employee.user_id = new_user.id

    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        user_id=new_user.id,
        user_email=new_user.email,
        action="REGISTER",
        entity_name="User",
        entity_id=new_user.id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit_entry)
    await db.commit()

    return {"message": "Registration request submitted successfully. Your account is pending administrator approval."}

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        payload = decode_token(request_data.refresh_token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if not user_id or token_type != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Expired or invalid refresh token")

    stmt = select(User).where(User.id == user_id, User.is_deleted == False)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive")

    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserProfileResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    permissions = []
    if current_user.role and current_user.role.permissions:
        permissions = [p.code for p in current_user.role.permissions]

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_superuser": current_user.is_superuser,
        "status": current_user.status,
        "is_temporary_password": current_user.is_temporary_password,
        "first_login": current_user.first_login,
        "role": current_user.role,
        "permissions": permissions
    }

@router.post("/change-password")
async def change_password(
    request_data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(request_data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.password_hash = get_password_hash(request_data.new_password)
    current_user.is_temporary_password = False
    current_user.first_login = False
    await db.commit()
    return {"message": "Password changed successfully"}

@router.post("/forgot-password")
async def forgot_password(request_data: ForgotPasswordRequest):
    # Placeholder for password reset email delivery
    return {"message": f"Password reset instructions sent to {request_data.email}"}

@router.post("/reset-password")
async def reset_password(request_data: ResetPasswordRequest):
    # Placeholder for token validation & password update
    return {"message": "Password has been reset successfully"}
