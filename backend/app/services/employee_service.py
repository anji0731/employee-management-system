from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.services.base import BaseService
from app.repositories.employee_repository import EmployeeRepository, employee_repository
from app.models.employee import Employee, EmployeeSkill
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

class EmployeeService(BaseService[EmployeeRepository]):
    def __init__(self, repository: EmployeeRepository = employee_repository):
        super().__init__(repository)

    async def list_employees(
        self,
        db: AsyncSession,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        department_id: Optional[str] = None,
        status_filter: Optional[str] = None,
        gender_filter: Optional[str] = None,
        include_deleted: bool = False,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        skip = (page - 1) * page_size
        items, total = await self.repository.get_paginated(
            db,
            skip=skip,
            limit=page_size,
            search=search,
            department_id=department_id,
            status=status_filter,
            gender=gender_filter,
            include_deleted=include_deleted,
            sort_by=sort_by,
            sort_order=sort_order
        )
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

    async def create_employee(self, db: AsyncSession, obj_in: EmployeeCreate, created_by_id: Optional[str] = None) -> Employee:
        # 1. Unique Email Check
        existing_email = await self.repository.get_by_email(db, obj_in.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Employee with this email address already exists.")

        from app.models.user import User
        from app.models.role import Role
        from app.core.security import get_password_hash
        from sqlalchemy import select
        import random

        temp_password = None
        new_user = None

        if obj_in.create_login_account:
            # Check if user already exists
            user_stmt = select(User).where(User.email == obj_in.email)
            existing_user = (await db.execute(user_stmt)).scalar_one_or_none()
            if existing_user:
                raise HTTPException(status_code=400, detail="User account with this email address already exists.")

            # Find Standard Employee role
            role_stmt = select(Role).where(Role.name == "Standard Employee")
            role = (await db.execute(role_stmt)).scalar_one_or_none()
            role_id = role.id if role else None

            # Generate random temp password
            temp_password = f"Temp@{random.randint(10000, 99999)}"
            new_user = User(
                id=str(uuid.uuid4()),
                email=obj_in.email,
                password_hash=get_password_hash(temp_password),
                full_name=f"{obj_in.first_name} {obj_in.last_name}",
                role_id=role_id,
                is_active=True,
                status="Active",
                is_temporary_password=True,
                first_login=True
            )
            db.add(new_user)
            await db.flush()

        # 2. Generate Employee Code
        employee_code = await self.repository.get_next_employee_code(db)

        # 3. Create Employee Instance
        employee_data = obj_in.model_dump(exclude={"skills", "create_login_account"})
        employee = Employee(
            id=str(uuid.uuid4()),
            employee_code=employee_code,
            created_by_id=created_by_id,
            user_id=new_user.id if new_user else None,
            **employee_data
        )

        # 4. Attach Skills if provided
        if obj_in.skills:
            for skill_in in obj_in.skills:
                emp_skill = EmployeeSkill(
                    id=str(uuid.uuid4()),
                    employee_id=employee.id,
                    skill_id=skill_in.skill_id,
                    proficiency_percentage=skill_in.proficiency_percentage
                )
                employee.employee_skills.append(emp_skill)

        db.add(employee)
        await db.commit()
        await db.refresh(employee)

        # Set temporary password on model dynamically so schema picks it up
        if temp_password:
            employee.temporary_password = temp_password

        return employee

    async def update_employee(self, db: AsyncSession, employee_id: str, obj_in: EmployeeUpdate, updated_by_id: Optional[str] = None) -> Employee:
        employee = await self.repository.get_by_id(db, employee_id)
        if not employee or employee.is_deleted:
            raise HTTPException(status_code=404, detail="Employee not found")

        if obj_in.email and obj_in.email != employee.email:
            existing_email = await self.repository.get_by_email(db, obj_in.email)
            if existing_email:
                raise HTTPException(status_code=400, detail="Employee with this email address already exists.")

        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(employee, field, value)

        if updated_by_id:
            employee.updated_by_id = updated_by_id

        await db.commit()
        await db.refresh(employee)
        return employee

    async def soft_delete_employee(self, db: AsyncSession, employee_id: str) -> Employee:
        employee = await self.repository.get_by_id(db, employee_id)
        if not employee or employee.is_deleted:
            raise HTTPException(status_code=404, detail="Employee not found")

        employee.soft_delete()
        await db.commit()
        return employee

    async def restore_employee(self, db: AsyncSession, employee_id: str) -> Employee:
        employee = await self.repository.get_by_id(db, employee_id)
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        employee.restore()
        await db.commit()
        return employee

employee_service = EmployeeService()
