import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.models.role import Role, Permission
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse

router = APIRouter(dependencies=[Depends(require_permission("admin:roles"))])

@router.get("", response_model=List[RoleResponse])
async def list_roles(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Role)
    results = (await db.execute(stmt)).scalars().all()
    return list(results)

@router.get("/{id}", response_model=RoleResponse)
async def get_role(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Role).where(Role.id == id)
    role = (await db.execute(stmt)).scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(payload: RoleCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = (await db.execute(select(Role).where(Role.code == payload.code))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Role code already exists")

    permissions = []
    if payload.permission_ids:
        perm_stmt = select(Permission).where(Permission.id.in_(payload.permission_ids))
        permissions = list((await db.execute(perm_stmt)).scalars().all())

    new_role = Role(
        id=str(uuid.uuid4()),
        name=payload.name,
        code=payload.code,
        description=payload.description,
        is_system=payload.is_system,
        permissions=permissions
    )
    db.add(new_role)
    await db.commit()
    await db.refresh(new_role)
    return new_role

@router.put("/{id}", response_model=RoleResponse)
async def update_role(id: str, payload: RoleUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Role).where(Role.id == id)
    role = (await db.execute(stmt)).scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if payload.name:
        role.name = payload.name
    if payload.code:
        role.code = payload.code
    if payload.description is not None:
        role.description = payload.description

    if payload.permission_ids is not None:
        perm_stmt = select(Permission).where(Permission.id.in_(payload.permission_ids))
        role.permissions = list((await db.execute(perm_stmt)).scalars().all())

    await db.commit()
    await db.refresh(role)
    return role

@router.delete("/{id}")
async def delete_role(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Role).where(Role.id == id)
    role = (await db.execute(stmt)).scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    if role.is_system:
        raise HTTPException(status_code=400, detail="Cannot delete system role")

    await db.delete(role)
    await db.commit()
    return {"message": "Role deleted successfully"}
