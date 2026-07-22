import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.role import Role, Permission
from app.models.user import User
from app.models.department import Department, Designation
from app.models.location import Country, State, City
from app.models.employee import Employee, EmployeeSkill
from app.models.skill import Skill

async def seed_initial_data():
    async with AsyncSessionLocal() as db:
        # 1. Check if seeded already
        stmt = select(User).where(User.email == "admin@jala.com")
        existing_admin = (await db.execute(stmt)).scalar_one_or_none()
        if existing_admin:
            return

        # 2. Permissions
        permissions_data = [
            ("auth:login", "Auth", "Authenticate into system"),
            ("emp:create", "Employee", "Create employee profile"),
            ("emp:read:all", "Employee", "View all employee records"),
            ("emp:update:all", "Employee", "Edit employee profile"),
            ("emp:delete", "Employee", "Delete employee record"),
            ("emp:export", "Employee", "Export employee data"),
            ("admin:users", "Admin", "Manage system users"),
            ("admin:roles", "Admin", "Manage roles & permissions"),
            ("admin:audit", "Admin", "Access audit logs"),
            ("admin:settings", "Admin", "Access system settings"),
            ("master:read", "Master", "View master database records"),
            ("master:write", "Master", "Create, update, delete master database records"),
        ]
        
        db_permissions = []
        for code, module, desc in permissions_data:
            perm = Permission(id=str(uuid.uuid4()), code=code, module=module, description=desc)
            db.add(perm)
            db_permissions.append(perm)
            
        await db.flush()

        # 3. Roles
        admin_role = Role(
            id=str(uuid.uuid4()),
            name="Super Admin",
            code="super_admin",
            description="Unrestricted administrative access",
            is_system=True,
            permissions=db_permissions
        )
        hr_role = Role(
            id=str(uuid.uuid4()),
            name="HR Manager",
            code="hr_manager",
            description="Human resources manager",
            is_system=True,
            permissions=[p for p in db_permissions if not p.code.startswith("admin:") and p.code != "master:write"]
        )
        emp_role = Role(
            id=str(uuid.uuid4()),
            name="Standard Employee",
            code="standard_employee",
            description="Standard employee user",
            is_system=True,
            permissions=[p for p in db_permissions if p.code == "auth:login"]
        )
        
        db.add_all([admin_role, hr_role, emp_role])
        await db.flush()

        # 4. Users (Admin + HR + Employee + Magnus JALA demo user)
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@jala.com",
            password_hash=get_password_hash("admin123"),
            full_name="System Administrator",
            role_id=admin_role.id,
            is_active=True
        )
        hr_user = User(
            id=str(uuid.uuid4()),
            email="hr@jala.com",
            password_hash=get_password_hash("hr123"),
            full_name="HR Manager User",
            role_id=hr_role.id,
            is_active=True
        )
        emp_user = User(
            id=str(uuid.uuid4()),
            email="employee@jala.com",
            password_hash=get_password_hash("employee123"),
            full_name="Standard Employee User",
            role_id=emp_role.id,
            is_active=True
        )
        demo_user = User(
            id=str(uuid.uuid4()),
            email="training@jalaacademy.com",
            password_hash=get_password_hash("jobprogram"),
            full_name="Magnus Demo User",
            role_id=hr_role.id,
            is_active=True
        )
        db.add_all([admin_user, hr_user, emp_user, demo_user])
        await db.flush()

        # 5. Master Data: Departments & Designations
        depts_data = [
            ("ENG", "Software Engineering", ["Senior Architect", "Full Stack Lead", "Frontend Developer", "Backend Engineer"]),
            ("QA", "Quality Assurance", ["QA Lead", "Automation Test Engineer", "Performance Specialist"]),
            ("HR", "Human Resources", ["HR Director", "Talent Acquisition Lead", "HR Operations Specialist"]),
            ("PRD", "Product & Design", ["Product Manager", "UI/UX Designer", "Technical Writer"])
        ]
        
        dept_objects = {}
        desig_objects = {}
        
        for code, name, desigs in depts_data:
            dept = Department(id=str(uuid.uuid4()), code=code, name=name, description=f"{name} Department")
            db.add(dept)
            dept_objects[code] = dept
            await db.flush()
            
            for d_title in desigs:
                desig = Designation(id=str(uuid.uuid4()), department_id=dept.id, title=d_title)
                db.add(desig)
                desig_objects[d_title] = desig
                
        await db.flush()

        # 6. Master Data: Countries, States & Cities
        locs_data = [
            ("US", "United States", "New York State", ["New York", "San Francisco", "Austin", "Seattle"]),
            ("IN", "India", "Karnataka", ["Bengaluru"]),
            ("IN", "India", "Telangana", ["Hyderabad"]),
            ("IN", "India", "Maharashtra", ["Mumbai", "Pune"]),
            ("UK", "United Kingdom", "England", ["London", "Manchester", "Edinburgh"]),
            ("CA", "Canada", "Ontario", ["Toronto", "Vancouver", "Montreal"])
        ]
        
        country_objects = {}
        state_objects = {}
        city_objects = {}
        
        for c_code, c_name, s_name, c_cities in locs_data:
            if c_code not in country_objects:
                country = Country(id=str(uuid.uuid4()), code=c_code, name=c_name)
                db.add(country)
                country_objects[c_code] = country
                await db.flush()
            else:
                country = country_objects[c_code]
            
            state_key = f"{c_code}_{s_name}"
            if state_key not in state_objects:
                state = State(id=str(uuid.uuid4()), country_id=country.id, name=s_name, code=c_code)
                db.add(state)
                state_objects[state_key] = state
                await db.flush()
            else:
                state = state_objects[state_key]
            
            for city_name in c_cities:
                city = City(id=str(uuid.uuid4()), state_id=state.id, name=city_name)
                db.add(city)
                city_objects[city_name] = city
                
        await db.flush()

        # 7. Seed Demo Employees
        demo_employees = [
            {
                "code": "EMP-1001",
                "first_name": "Jala",
                "last_name": "Tech",
                "email": "training@jalaacademy.com",
                "mobile": "+91 9876543210",
                "gender": "Male",
                "dob": date(1992, 5, 15),
                "joining": date(2021, 1, 10),
                "dept": "ENG",
                "desig": "Full Stack Lead",
                "country": "IN",
                "city": "Bengaluru",
                "user_id": demo_user.id,
                "skills": [("React", 95), ("FastAPI", 90), ("PostgreSQL", 88), ("Docker", 85)]
            },
            {
                "code": "EMP-1002",
                "first_name": "Sarah",
                "last_name": "Jenkins",
                "email": "sarah.jenkins@magnus.com",
                "mobile": "+1 4155552671",
                "gender": "Female",
                "dob": date(1994, 8, 22),
                "joining": date(2022, 3, 1),
                "dept": "QA",
                "desig": "Automation Test Engineer",
                "country": "US",
                "city": "San Francisco",
                "user_id": None,
                "skills": [("Selenium", 92), ("Playwright", 88), ("Python", 85)]
            },
            {
                "code": "EMP-1003",
                "first_name": "Rajesh",
                "last_name": "Kumar",
                "email": "rajesh.kumar@magnus.com",
                "mobile": "+91 9123456789",
                "gender": "Male",
                "dob": date(1989, 11, 4),
                "joining": date(2020, 6, 15),
                "dept": "ENG",
                "desig": "Senior Architect",
                "country": "IN",
                "city": "Hyderabad",
                "user_id": None,
                "skills": [("System Architecture", 98), ("Python", 95), ("Kubernetes", 90)]
            },
            {
                "code": "EMP-1004",
                "first_name": "Emily",
                "last_name": "Watson",
                "email": "emily.watson@magnus.com",
                "mobile": "+44 2079460912",
                "gender": "Female",
                "dob": date(1996, 2, 18),
                "joining": date(2023, 2, 10),
                "dept": "HR",
                "desig": "Talent Acquisition Lead",
                "country": "UK",
                "city": "London",
                "user_id": None,
                "skills": [("Recruitment", 95), ("People Operations", 90)]
            }
        ]

        # Seed distinct Skill master records first
        all_skills = set()
        for e in demo_employees:
            for sk_name, _ in e["skills"]:
                all_skills.add(sk_name)
                
        skill_objects = {}
        for sk_name in all_skills:
            skill = Skill(id=str(uuid.uuid4()), name=sk_name, category="General", description=f"{sk_name} technology skill")
            db.add(skill)
            skill_objects[sk_name] = skill
        await db.flush()

        for e in demo_employees:
            emp = Employee(
                id=str(uuid.uuid4()),
                user_id=e["user_id"],
                employee_code=e["code"],
                first_name=e["first_name"],
                last_name=e["last_name"],
                email=e["email"],
                mobile=e["mobile"],
                gender=e["gender"],
                date_of_birth=e["dob"],
                joining_date=e["joining"],
                department_id=dept_objects[e["dept"]].id,
                designation_id=desig_objects[e["desig"]].id,
                country_id=country_objects[e["country"]].id,
                state_id=city_objects[e["city"]].state_id,
                city_id=city_objects[e["city"]].id,
                address="123 Technology Park Boulevard",
                status="Active"
            )
            db.add(emp)
            await db.flush()
            
            for sk_name, sk_prof in e["skills"]:
                emp_skill = EmployeeSkill(
                    id=str(uuid.uuid4()),
                    employee_id=emp.id,
                    skill_id=skill_objects[sk_name].id,
                    proficiency_percentage=sk_prof
                )
                db.add(emp_skill)

        await db.commit()

