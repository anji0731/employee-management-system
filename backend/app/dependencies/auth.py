from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.security import decode_token
from app.dependencies.db import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if not user_id or token_type != "access":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id, User.is_deleted == False)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or suspended"
        )
    return user

class RoleChecker:
    def __init__(self, required_role: str):
        self.required_role = required_role

    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_superuser or (current_user.role and current_user.role.name == "Super Admin"):
            return current_user
        
        if not current_user.role or current_user.role.name != self.required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Required role [{self.required_role}]"
            )
        return current_user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_superuser or (current_user.role and current_user.role.name == "Super Admin"):
            return current_user
        
        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User has no role assigned"
            )
        
        user_permissions = [p.code for p in current_user.role.permissions]
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Missing required permission [{self.required_permission}]"
            )
        return current_user

def require_role(role_name: str):
    return RoleChecker(role_name)

def require_permission(permission_code: str):
    return PermissionChecker(permission_code)
