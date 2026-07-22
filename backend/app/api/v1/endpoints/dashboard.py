from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.models.employee import Employee
from app.models.user import User
from app.models.department import Department
from app.models.location import Country, State, City
from app.models.audit import AuditLog
from app.models.role import Role
from app.schemas.dashboard import (
    DynamicDashboardResponse,
    DashboardStats,
    RecentEmployeeItem,
    RecentUserItem,
    RecentActivityItem,
)

router = APIRouter()

@router.get("", response_model=DynamicDashboardResponse)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch dynamic real-time dashboard statistics directly from PostgreSQL database.
    Narrows access to admin metrics based on permissions.
    """
    is_admin = current_user.is_superuser or (current_user.role and current_user.role.name == "Super Admin")
    user_perms = [p.code for p in current_user.role.permissions] if current_user.role else []

    # 1. Total Employees
    total_emp = 0
    if is_admin or "emp:read:all" in user_perms:
        total_emp = (
            await db.execute(select(func.count(Employee.id)).where(Employee.is_deleted == False))
        ).scalar() or 0

    # 2. Active Employees
    active_emp = 0
    if is_admin or "emp:read:all" in user_perms:
        active_emp = (
            await db.execute(select(func.count(Employee.id)).where(Employee.is_deleted == False, Employee.status == "Active"))
        ).scalar() or 0

    # 3. Total Users
    total_users = 0
    if is_admin or "admin:users" in user_perms:
        total_users = (
            await db.execute(select(func.count(User.id)).where(User.is_deleted == False))
        ).scalar() or 0

    # 4. Departments Count
    dept_count = 0
    if is_admin or "master:read" in user_perms:
        dept_count = (
            await db.execute(select(func.count(Department.id)).where(Department.is_deleted == False))
        ).scalar() or 0

    # 5. Countries Count
    country_count = 0
    if is_admin or "master:read" in user_perms:
        country_count = (
            await db.execute(select(func.count(Country.id)).where(Country.is_deleted == False))
        ).scalar() or 0

    # 6. States Count
    state_count = 0
    if is_admin or "master:read" in user_perms:
        state_count = (
            await db.execute(select(func.count(State.id)).where(State.is_deleted == False))
        ).scalar() or 0

    # 7. Cities Count
    city_count = 0
    if is_admin or "master:read" in user_perms:
        city_count = (
            await db.execute(select(func.count(City.id)).where(City.is_deleted == False))
        ).scalar() or 0

    # 8. Recent Employees (Last 5)
    recent_employees = []
    if is_admin or "emp:read:all" in user_perms:
        recent_emp_stmt = (
            select(Employee)
            .options(selectinload(Employee.department))
            .where(Employee.is_deleted == False)
            .order_by(Employee.created_at.desc())
            .limit(5)
        )
        recent_emp_rows = (await db.execute(recent_emp_stmt)).scalars().all()
        recent_employees = [
            RecentEmployeeItem(
                id=emp.id,
                employee_code=emp.employee_code,
                first_name=emp.first_name,
                last_name=emp.last_name,
                email=emp.email,
                department_name=emp.department.name if emp.department else None,
                status=emp.status,
                joining_date=str(emp.joining_date) if emp.joining_date else None,
            )
            for emp in recent_emp_rows
        ]

    # 9. Recent Users (Last 5)
    recent_users = []
    if is_admin or "admin:users" in user_perms:
        recent_user_stmt = (
            select(User)
            .options(selectinload(User.role))
            .where(User.is_deleted == False)
            .order_by(User.created_at.desc())
            .limit(5)
        )
        recent_user_rows = (await db.execute(recent_user_stmt)).scalars().all()
        recent_users = [
            RecentUserItem(
                id=usr.id,
                email=usr.email,
                full_name=usr.full_name,
                role_name=usr.role.name if usr.role else None,
                is_active=usr.is_active,
            )
            for usr in recent_user_rows
        ]

    # 10. Recent Activities (Last 5)
    recent_activities = []
    if is_admin or "admin:audit" in user_perms:
        recent_audit_stmt = (
            select(AuditLog)
            .order_by(AuditLog.timestamp.desc())
            .limit(5)
        )
        recent_audit_rows = (await db.execute(recent_audit_stmt)).scalars().all()
        recent_activities = [
            RecentActivityItem(
                id=log.id,
                action=log.action,
                user_email=log.user_email,
                entity_name=log.entity_name,
                timestamp=log.timestamp,
            )
            for log in recent_audit_rows
        ]

    stats = DashboardStats(
        total_employees=total_emp,
        active_employees=active_emp,
        total_users=total_users,
        departments_count=dept_count,
        countries_count=country_count,
        states_count=state_count,
        cities_count=city_count,
    )

    return DynamicDashboardResponse(
        stats=stats,
        recent_employees=recent_employees,
        recent_users=recent_users,
        recent_activities=recent_activities,
    )
