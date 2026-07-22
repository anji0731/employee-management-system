import csv
import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.user import User
from app.models.employee import Employee
from app.models.location import Country, State, City
from app.models.department import Department, Designation
from app.models.skill import Skill

router = APIRouter()

class BulkActionPayload(BaseModel):
    ids: List[str]

MODEL_MAP = {
    "employees": Employee,
    "users": User,
    "countries": Country,
    "states": State,
    "cities": City,
    "departments": Department,
    "designations": Designation,
    "skills": Skill,
}

def check_module_permission(module: str, action: str, user: User):
    if user.is_superuser or (user.role and user.role.name == "Super Admin"):
        return

    if not user.role:
        raise HTTPException(status_code=403, detail="Access denied: No role assigned")

    user_perms = [p.code for p in user.role.permissions]
    mod = module.lower()

    if mod == "users":
        required = "admin:users"
    elif mod in ["roles", "permissions"]:
        required = "admin:roles"
    elif mod == "employees":
        if action == "delete":
            required = "emp:delete"
        elif action == "export":
            required = "emp:export"
        else:
            required = "emp:read:all"
    elif mod in ["countries", "states", "cities", "departments", "designations", "skills"]:
        if action in ["delete", "write"]:
            required = "master:write"
        else:
            required = "master:read"
    else:
        raise HTTPException(status_code=404, detail="Invalid module")

    if required not in user_perms:
        raise HTTPException(
            status_code=403,
            detail=f"Access denied: Missing required permission [{required}]"
        )

@router.post("/{module}/bulk-delete")
async def bulk_soft_delete(
    module: str,
    payload: BulkActionPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete multiple records by ID array."""
    check_module_permission(module, "delete", current_user)
    model_cls = MODEL_MAP.get(module.lower())
    if not model_cls:
        raise HTTPException(status_code=404, detail="Invalid module")

    if hasattr(model_cls, "is_deleted"):
        stmt = (
            update(model_cls)
            .where(model_cls.id.in_(payload.ids))
            .values(is_deleted=True)
        )
        await db.execute(stmt)
        await db.commit()
    return {"message": f"Successfully soft-deleted {len(payload.ids)} records."}

@router.post("/{module}/bulk-restore")
async def bulk_restore(
    module: str,
    payload: BulkActionPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Restore multiple soft-deleted records by ID array."""
    check_module_permission(module, "delete", current_user)
    model_cls = MODEL_MAP.get(module.lower())
    if not model_cls:
        raise HTTPException(status_code=404, detail="Invalid module")

    if hasattr(model_cls, "is_deleted"):
        stmt = (
            update(model_cls)
            .where(model_cls.id.in_(payload.ids))
            .values(is_deleted=False)
        )
        await db.execute(stmt)
        await db.commit()
    return {"message": f"Successfully restored {len(payload.ids)} records."}

@router.get("/{module}/export-csv")
async def export_csv(
    module: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export all module records as a downloadable CSV spreadsheet."""
    check_module_permission(module, "export", current_user)
    model_cls = MODEL_MAP.get(module.lower())
    if not model_cls:
        raise HTTPException(status_code=404, detail="Invalid module")

    stmt = select(model_cls)
    if hasattr(model_cls, "is_deleted"):
        stmt = stmt.where(model_cls.is_deleted == False)

    records = (await db.execute(stmt)).scalars().all()

    output = io.StringIO()
    if not records:
        return Response(content="No data available", media_type="text/csv")

    col_names = [c.name for c in model_cls.__table__.columns]
    writer = csv.writer(output)
    writer.writerow(col_names)

    for row in records:
        writer.writerow([getattr(row, col, "") for col in col_names])

    content = output.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={module}_export.csv"}
    )
