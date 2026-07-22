from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    users,
    roles,
    permissions,
    employees,
    countries,
    states,
    cities,
    departments,
    designations,
    skills,
    export_import,
    dashboard,
)

api_router = APIRouter()

# Register /health endpoint
api_router.include_router(health.router)

# Register v1 endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(permissions.router, prefix="/permissions", tags=["Permissions"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(countries.router, prefix="/countries", tags=["Countries"])
api_router.include_router(states.router, prefix="/states", tags=["States"])
api_router.include_router(cities.router, prefix="/cities", tags=["Cities"])
api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(designations.router, prefix="/designations", tags=["Designations"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(export_import.router, prefix="/data", tags=["Bulk Data & Exports"])
