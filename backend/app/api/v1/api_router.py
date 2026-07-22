from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    employees,
    master,
    dashboard,
    more_features,
    audit
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employee Management"])
api_router.include_router(master.router, prefix="/master", tags=["Master Data"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Executive Dashboard"])
api_router.include_router(more_features.router, prefix="/more", tags=["More Showcase Features"])
api_router.include_router(audit.router, prefix="/admin/audit-logs", tags=["Audit Logging"])
