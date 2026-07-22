from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.models.role import Permission
from app.schemas.role import PermissionResponse

router = APIRouter(dependencies=[Depends(require_permission("admin:roles"))])

@router.get("", response_model=List[PermissionResponse])
async def list_permissions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Permission).order_by(Permission.module, Permission.code)
    results = (await db.execute(stmt)).scalars().all()
    return list(results)
