from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.database import get_db
from app.core.security import ALGORITHM
from app.models.user import User
from app.models.role import Role

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
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive or non-existent user")
    
    return user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if not current_user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User has no role assigned"
            )
        
        # Super Admin bypasses all checks
        if current_user.role.name == "Super Admin":
            return current_user
        
        user_permissions = [p.code for p in current_user.role.permissions]
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Required [{self.required_permission}]"
            )
        
        return current_user
