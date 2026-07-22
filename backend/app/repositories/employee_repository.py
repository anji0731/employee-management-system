from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from app.repositories.base import BaseRepository
from app.models.employee import Employee

class EmployeeRepository(BaseRepository[Employee]):
    def __init__(self):
        super().__init__(Employee)

    async def get_by_code(self, db: AsyncSession, employee_code: str) -> Optional[Employee]:
        stmt = select(Employee).where(Employee.employee_code == employee_code, Employee.is_deleted == False)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[Employee]:
        stmt = select(Employee).where(Employee.email == email, Employee.is_deleted == False)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_next_employee_code(self, db: AsyncSession) -> str:
        stmt = select(func.count(Employee.id))
        count = (await db.execute(stmt)).scalar() or 0
        return f"EMP-{(count + 1):04d}"

    async def get_paginated(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        department_id: Optional[str] = None,
        status: Optional[str] = None,
        gender: Optional[str] = None,
        include_deleted: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Employee], int]:
        query = select(Employee)

        if not include_deleted:
            query = query.where(Employee.is_deleted == False)

        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Employee.first_name.ilike(search_term),
                    Employee.last_name.ilike(search_term),
                    Employee.email.ilike(search_term),
                    Employee.employee_code.ilike(search_term),
                    Employee.mobile.ilike(search_term)
                )
            )

        if department_id:
            query = query.where(Employee.department_id == department_id)
        if status:
            query = query.where(Employee.status == status)
        if gender:
            query = query.where(Employee.gender == gender)

        # Count Total
        count_stmt = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_stmt)).scalar() or 0

        # Sorting
        sort_column = getattr(Employee, sort_by, Employee.created_at)
        if sort_order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        # Pagination
        query = query.offset(skip).limit(limit)
        results = (await db.execute(query)).scalars().all()

        return list(results), total

employee_repository = EmployeeRepository()
