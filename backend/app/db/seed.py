import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.db.base import Base
from app.core.security import get_password_hash
from app.models.role import Role, Permission
from app.models.user import User
from app.models.department import Department, Designation
from app.models.location import Country, State, City
from app.models.skill import Skill

async def seed_database(db: AsyncSession) -> None:
    """Populates the database with foundational master data and admin accounts."""

    # 1. Seed Permissions
    permissions_data = [
        ("user:create", "User Management", "Create user account"),
        ("user:read", "User Management", "View user account"),
        ("user:update", "User Management", "Update user account"),
        ("user:delete", "User Management", "Delete user account"),
        ("employee:create", "Employee Management", "Create employee profile"),
        ("employee:read", "Employee Management", "View employee profile"),
        ("employee:update", "Employee Management", "Update employee profile"),
        ("employee:delete", "Employee Management", "Delete employee profile"),
        ("department:manage", "Master Data", "Manage department records"),
        ("location:manage", "Master Data", "Manage location records"),
        ("audit:read", "Audit Log", "Access security audit logs"),
        ("notification:read", "Notifications", "View user notifications"),
    ]

    existing_perm = await db.execute(select(Permission).limit(1))
    db_permissions = []
    if not existing_perm.scalar_one_or_none():
        for code, module, desc in permissions_data:
            perm = Permission(id=str(uuid.uuid4()), code=code, module=module, description=desc)
            db.add(perm)
            db_permissions.append(perm)
        await db.flush()
    else:
        db_permissions = (await db.execute(select(Permission))).scalars().all()

    # 2. Seed Roles
    existing_roles = await db.execute(select(Role).limit(1))
    roles_map = {}
    if not existing_roles.scalar_one_or_none():
        roles_data = [
            ("Super Admin", "super_admin", "Full system access"),
            ("HR Manager", "hr_manager", "Human Resources management access"),
            ("Department Manager", "dept_manager", "Departmental oversight access"),
            ("Employee", "employee", "Standard employee self-service access"),
        ]

        for name, code, desc in roles_data:
            role = Role(
                id=str(uuid.uuid4()),
                name=name,
                code=code,
                description=desc,
                is_system=True,
                permissions=db_permissions if code == "super_admin" else [p for p in db_permissions if not p.code.startswith("audit:")]
            )
            db.add(role)
            roles_map[code] = role
        await db.flush()
    else:
        roles_list = (await db.execute(select(Role))).scalars().all()
        roles_map = {r.code: r for r in roles_list}

    # 3. Seed Default Users for Login
    admin_user = (await db.execute(select(User).where(User.email == "admin@jala.com"))).scalar_one_or_none()
    if not admin_user:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@jala.com",
            password_hash=get_password_hash("admin123"),
            full_name="System Administrator",
            role_id=roles_map.get("super_admin").id if roles_map.get("super_admin") else None,
            is_active=True,
            is_superuser=True
        )
        db.add(admin)

    demo_user = (await db.execute(select(User).where(User.email == "training@jalaacademy.com"))).scalar_one_or_none()
    if not demo_user:
        demo = User(
            id=str(uuid.uuid4()),
            email="training@jalaacademy.com",
            password_hash=get_password_hash("jobseekrit"),
            full_name="Magnus Demo User",
            role_id=roles_map.get("hr_manager").id if roles_map.get("hr_manager") else None,
            is_active=True,
            is_superuser=False
        )
        db.add(demo)

    await db.flush()

    # 4. Seed Departments & Designations
    existing_dept = await db.execute(select(Department).limit(1))
    if not existing_dept.scalar_one_or_none():
        depts_data = [
            ("ENG", "Software Engineering", ["Senior Architect", "Full Stack Developer", "Backend Engineer", "Frontend Specialist"]),
            ("QA", "Quality Assurance", ["Automation Test Lead", "QA Analyst", "Performance Engineer"]),
            ("HR", "Human Resources", ["HR Director", "Talent Acquisition Specialist", "HR Operations Lead"]),
            ("PRD", "Product & Design", ["Product Manager", "UI/UX Designer", "Technical Writer"]),
            ("FIN", "Finance & Accounting", ["Financial Controller", "Senior Accountant", "Payroll Specialist"]),
        ]

        for d_code, d_name, desig_list in depts_data:
            dept = Department(id=str(uuid.uuid4()), code=d_code, name=d_name, description=f"{d_name} Department")
            db.add(dept)
            await db.flush()

            for title in desig_list:
                desig = Designation(id=str(uuid.uuid4()), department_id=dept.id, title=title, code=title.upper().replace(" ", "_")[:10])
                db.add(desig)
        await db.flush()

    # 5. Seed Countries, States, Cities
    existing_country = await db.execute(select(Country).limit(1))
    if not existing_country.scalar_one_or_none():
        locations_data = [
            ("US", "United States", "+1", [("California", "CA", ["San Francisco", "Los Angeles", "San Jose"]), ("Texas", "TX", ["Austin", "Dallas", "Houston"])]),
            ("IN", "India", "+91", [("Karnataka", "KA", ["Bengaluru", "Mysore"]), ("Telangana", "TS", ["Hyderabad"]), ("Maharashtra", "MH", ["Mumbai", "Pune"])]),
            ("UK", "United Kingdom", "+44", [("England", "ENG", ["London", "Manchester"]), ("Scotland", "SCT", ["Edinburgh"])]),
            ("CA", "Canada", "+1", [("Ontario", "ON", ["Toronto", "Ottawa"]), ("British Columbia", "BC", ["Vancouver"])]),
        ]

        for c_code, c_name, phone, states_list in locations_data:
            country = Country(id=str(uuid.uuid4()), code=c_code, name=c_name, phone_code=phone)
            db.add(country)
            await db.flush()

            for s_name, s_code, cities_list in states_list:
                state = State(id=str(uuid.uuid4()), country_id=country.id, name=s_name, code=s_code)
                db.add(state)
                await db.flush()

                for city_name in cities_list:
                    city = City(id=str(uuid.uuid4()), state_id=state.id, name=city_name)
                    db.add(city)
        await db.flush()

    # 6. Seed Skills
    existing_skill = await db.execute(select(Skill).limit(1))
    if not existing_skill.scalar_one_or_none():
        skills_data = [
            ("React", "Frontend", "React 19 UI Framework"),
            ("TypeScript", "Language", "Typed JavaScript"),
            ("FastAPI", "Backend", "Python High-Performance ASGI Framework"),
            ("Python", "Language", "Python 3.11+ Core"),
            ("SQLAlchemy", "ORM", "SQLAlchemy 2.0 ORM & Expression Language"),
            ("PostgreSQL", "Database", "Relational Database Management System"),
            ("Docker", "DevOps", "Containerization Platform"),
            ("Selenium", "Testing", "Automated QA Web Testing"),
            ("Alembic", "Database", "SQLAlchemy Migration Tool"),
            ("Tailwind CSS", "Frontend", "Utility-First CSS Framework"),
        ]

        for name, category, desc in skills_data:
            skill = Skill(id=str(uuid.uuid4()), name=name, category=category, description=desc)
            db.add(skill)
        await db.flush()

    await db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    async def main():
        async with AsyncSessionLocal() as db:
            await seed_database(db)
    asyncio.run(main())
