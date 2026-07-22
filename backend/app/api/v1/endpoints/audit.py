from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, require_permission
from app.models.audit import AuditLog
from app.schemas.dashboard import AuditLogResponse

router = APIRouter(dependencies=[Depends(require_permission("admin:audit"))])

@router.get("", response_model=List[AuditLogResponse])
async def list_audit_logs(
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
