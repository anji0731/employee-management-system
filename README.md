# 🏢 Enterprise Employee Management System

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_2.0-CC292B?style=for-the-badge)](https://www.sqlalchemy.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, secure, and highly-performant enterprise-grade platform for employee lifecycle management, access control, and master data administration. Engineered with Clean Architecture, SOLID principles, asynchronous FastAPI, React 19, and Tailwind CSS.

---

## 📖 3. Project Overview

The **Enterprise Employee Management System** is a robust web application engineered to streamline human resource workflows and corporate governance. Built with production-ready patterns, the system is designed to handle employee onboarding, role-based access management, geographical structures, and departmental audits.

### Why It Was Built
Corporate administrations require secure, transparent, and auditable systems to manage personnel. This application was built to serve as an industry-standard template demonstrating:
* **Decoupled Architecture**: Seamless separation between high-performance FastAPI backends and rich React 19 frontend interfaces.
* **Strict Role-Based Access Control (RBAC)**: Custom permissions assigned directly to functional corporate roles.
* **Operational Visibility**: Audit trails logging administrator activities for security compliance.

---

## ⚡ 4. Features

### 🔐 Authentication & Access Control
- **Secure Logins & Signups**: Robust authentication flow powered by access/refresh token pairs.
- **Password Visibility Toggles**: Interactive eye toggles (`Eye` / `EyeOff`) to preview passwords safely during Login and Signup.
- **JWT token management**: Secure client-side localStorage token persistence with a 401 response interceptor for silent token refresh.
- **Fine-grained RBAC**: Restricts UI elements and server endpoints based on active user permission lists.

### 📊 Dashboard
- **Live Statistics Cards**: Real-time counter of active corporate personnel, departments, and active users.
- **Recent Employees Registry**: Compact overview of the latest employee profiles added to the system.
- **Quick Action Links**: Rapid access to create new employees, view audit logs, or edit master departments.

### 👥 Employee Management
- **Comprehensive CRUD Operations**: Fully-featured interface to add, view details, modify, and delete employees.
- **Advanced Searching & Sorting**: Global text search on email/name, plus column sorting.
- **Multi-parameter Filtering**: Instant filtration of employee databases by Gender, Department, and Active/Inactive statuses.
- **Soft Deletion & Restore**: Accident-proof employee deletions with soft-delete safety buffers and administrative restore routes.
- **Avatar Uploads**: Integration of local profile picture uploads directly to disk storage.

### 🗺️ Master Modules
- **Geographic Hierarchies**: Self-managing datasets for **Countries**, **States**, and **Cities** with relational constraints.
- **Operational Structuring**: Fully auditable records for **Departments** and **Designations** (e.g., Software Engineering ➔ Full Stack Developer).
- **Skill Inventories**: Shared system repository of core professional skills with user-defined proficiency percentages.

### 🛠️ User & Security Management
- **User Directory**: Global user directory showing linked employees, system access parameters, and active statuses.
- **Permissions Matrix**: Toggle system access capabilities (e.g., `emp:create`, `admin:roles`) on individual user roles.

### 📂 "More Menu" Data Tools
- **Data Export Formats**: Instant download configurations for **CSV**, **Excel XML**, and **PDF**.
- **Interactive Copy & Print**: Single-click table contents copy to clipboard and responsive CSS table printing formats.
- **Data Import Parser**: Standardized CSV file validation and parser for bulk uploading employee structures.
- **Column Visibility Filters**: Dynamic toggling of visible table columns persisted locally per administrator session.

---

## 🛠️ 5. Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript | Core application rendering and component logic. |
| **Frontend Tooling** | Vite, Rollup | High-speed hot module replacement and building pipeline. |
| **State & API Queries** | TanStack Query v5, Axios | Server state management, caching, and token refresh. |
| **Styling** | Tailwind CSS v4, Lucide React | Modern utility-first stylesheet layouts and SVG icon sets. |
| **Backend Core** | FastAPI (Python 3.10+) | High-performance async ASGI web framework. |
| **Database ORM** | SQLAlchemy 2.0 (declarative) | Database mapping layer with fully-typed `Mapped` schemas. |
| **Database Migration** | Alembic | Version-controlled relational database schema migrations. |
| **Driver** | asyncpg | High-speed, async PostgreSQL client library. |
| **Authentication** | PyJWT, bcrypt | JSON Web Token issuance and secure password hashing. |
| **Testing** | pytest, httpx | Automated backend request and service validation test suite. |

---

## 📂 6. Project Structure

```text
jalatask/
├── backend/
│   ├── alembic/                 # Alembic migration versions and configuration
│   ├── app/
│   │   ├── api/                 # API endpoint routers
│   │   │   └── v1/
│   │   │       └── endpoints/   # Individual resource endpoints (auth, employees, etc.)
│   │   ├── core/                # Core configurations, databases, and JWT security
│   │   ├── db/                  # DB sessions, Base model, and initial seeds
│   │   ├── dependencies/        # Common injection parameters (DB, current user)
│   │   ├── models/              # SQLAlchemy declarative models
│   │   ├── schemas/             # Pydantic schemas (request/response validation)
│   │   ├── services/            # Business logic and service layers
│   │   └── main.py              # FastAPI application entrypoint
│   ├── tests/                   # Pytest automation scripts
│   ├── requirements.txt         # Python library dependencies
│   └── alembic.ini              # Alembic environment config
├── frontend/
│   ├── src/
│   │   ├── assets/              # Static assets, images, and global logos
│   │   ├── components/          # Reusable shared UI elements and guards
│   │   ├── context/             # React authentication and theme contexts
│   │   ├── features/            # Feature modules (employee lists, dashboards)
│   │   ├── pages/               # Top-level page routers (LoginPage, UsersPage)
│   │   ├── services/            # Axios API config and route interceptors
│   │   ├── types/               # Global TypeScript typings
│   │   └── App.tsx              # React routing tree
│   ├── package.json             # NPM dependencies
│   └── vite.config.ts           # Vite configuration
└── README.md                    # System Documentation
```

---

## 🏗️ 7. System Architecture

```mermaid
graph TD
    subgraph "Frontend Client (Vite + React 19)"
        UI[React Components] --> Auth[AuthContext]
        UI --> API[Axios API client]
    end

    subgraph "Backend Server (FastAPI)"
        API -->|HTTPS Request + Bearer JWT| Main[FastAPI Router]
        Main -->|Validate Request| Schemas[Pydantic Schemas]
        Main --> Dep[Dependencies & RBAC Guard]
        Dep --> Services[Service Business Logic]
        Services --> DB[SQLAlchemy AsyncSession]
    end

    subgraph "Relational Database"
        DB -->|asyncpg driver| Postgres[(PostgreSQL Database)]
    end
```

---

## 🗄️ 8. Database Modules

The relational database consists of the following key tables and configurations:

* **`users`**: System access accounts.
  - `id` (PK, UUID), `email` (Unique), `password_hash`, `full_name`, `role_id` (FK), `is_active`, `is_superuser`, `created_at`, `updated_at`, `is_deleted`.
* **`roles`**: System permissions groupings.
  - `id` (PK, UUID), `name` (Unique), `description`, `is_system`.
* **`permissions`**: Fine-grained capability scopes.
  - `id` (PK, UUID), `code` (Unique, e.g., `emp:create`), `module`, `description`.
* **`employees`**: Personal records.
  - `id` (PK, UUID), `user_id` (FK, Nullable), `employee_code` (Unique), `first_name`, `last_name`, `email` (Unique), `mobile`, `gender`, `date_of_birth`, `joining_date`, `department_id` (FK), `designation_id` (FK), `country_id` (FK), `city_id` (FK), `address`, `status` (Active/Inactive), `avatar_url`, `created_at`.
* **`departments`**: Functional units.
  - `id` (PK, UUID), `code` (Unique), `name`, `description`.
* **`designations`**: Positional titles.
  - `id` (PK, UUID), `department_id` (FK), `title`.
* **`countries`**: Geographic region registry.
  - `id` (PK, UUID), `code` (Unique), `name`.
* **`states`**: State regions.
  - `id` (PK, UUID), `country_id` (FK), `name`.
* **`cities`**: Local cities.
  - `id` (PK, UUID), `country_id` (FK), `name`.
* **`skills`**: Master skills inventory.
  - `id` (PK, UUID), `name` (Unique).
* **`audit_logs`**: System event logger.
  - `id` (PK, UUID), `user_id` (FK), `user_email`, `action`, `entity_name`, `entity_id`, `ip_address`, `timestamp`.

---

## 🖼️ 9. Screenshots

<details>
  <summary>📸 Click to expand layout previews</summary>

  ### Login Page & Password Eye Toggle
  `[Screenshot Placeholder: Login Page showing Sign In/Sign Up tabs and password visibility eye buttons]`

  ### Dashboard Overview
  `[Screenshot Placeholder: Dashboard statistics cards, quick links, and recent employee charts]`

  ### Employee Directory Listing
  `[Screenshot Placeholder: Data table displaying employee grids with pagination and filtering]`

  ### Employee Registration Portal
  `[Screenshot Placeholder: Employee profile creation form with input steps]`

  ### Master Modules (Countries & Departments)
  `[Screenshot Placeholder: Countries list and corporate department configuration views]`

  ### User Management & Permissions
  `[Screenshot Placeholder: Administration panel displaying user active states and custom role assignments]`

  ### Advanced Exporter (More Menu)
  `[Screenshot Placeholder: Dropdown showing CSV, PDF, and print layouts with column visibility filters]`

  ### Settings
  `[Screenshot Placeholder: Dark mode toggle and personal profile configurations]`
</details>

---

## 🚀 10. Installation Guide

Ensure you have **Python 3.10+**, **Node.js 18+**, and **PostgreSQL** installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/anji0731/Enterprise-Employee-Management.git
cd Enterprise-Employee-Management
```

### Step 2: Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and configure variables:
   ```bash
   cp .env.example .env
   ```
5. Apply Alembic migrations to setup database schema:
   ```bash
   alembic upgrade head
   ```
6. Seed the database with core permissions, roles, and initial admins:
   ```bash
   python -m app.seed
   ```
7. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Create local env file:
   ```bash
   cp .env.example .env
   ```
4. Run the Vite developer server:
   ```bash
   npm run dev
   ```
   *The client will start running locally at: `http://localhost:5173`*

---

## ⚙️ 11. Environment Variables

### Backend Configuration (`backend/.env`)

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/magnus_db` | Connection string for PostgreSQL database. |
| `SECRET_KEY` | `your-high-entropy-jwt-secret-key-signature` | Secret key used to encrypt and verify JWT signatures. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Lifespan of access tokens in minutes. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Lifespan of refresh tokens in days. |
| `DEBUG` | `True` | Toggle FastAPI detailed error page response. |
| `BACKEND_CORS_ORIGINS` | `["http://localhost:5173", "http://127.0.0.1:5173"]` | Authorized CORS origins for the frontend. |

### Frontend Configuration (`frontend/.env`)

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | Root URL pointing to the active FastAPI backend router. |

---

## 🔐 12. Default Login Credentials

> [!WARNING]
> These are default credentials meant solely for local development and demonstration. Change these immediately in production!

| Role | Email Address | Password | Clear Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@jala.com` | `admin123` | Unrestricted full system access. |
| **HR Manager** | `hr@jala.com` | `hr123` | Create/modify employees, view lists, view master data. |
| **HR Manager (JALA)** | `training@jalaacademy.com` | `jobprogram` | Training user account with HR Manager permissions. |
| **Standard Employee** | `employee@jala.com` | `employee123` | Basic login, view personal profile, change password. |

---

## 👥 13. Employee Onboarding Workflows

The system supports two secure methods for adding new employee profiles and generating active login accounts.

### Method 1: Employee Self-Registration & Approval Workflow

```mermaid
graph TD
    A[Employee Registers via Sign Up] --> B(Status: Pending Approval / Inactive)
    B --> C{Admin/HR Reviews Request}
    C -->|Approve| D[User Status: Active]
    C -->|Approve| E[Auto-create Employee Profile]
    C -->|Reject| F[User Status: Rejected / Inactive]
```

1. **Self-Registration Submission**: A new employee goes to the login page, selects the **Sign Up** tab, fills in their details (Full Name, Email, Password), and submits.
2. **Approval Queue**:
   - The user's account is created with `status = "Pending Approval"` and `is_active = False` (they are blocked from logging in).
   - The request appears in the **Pending Registration Requests** dashboard page for both HR Managers and Super Admins.
3. **Approval Decision**:
   - **Approve**: The user status becomes `Active`, a matching corporate `Employee` profile is automatically generated (if not already existing), and they are linked to the user account with the **Standard Employee** role.
   - **Reject**: The request status becomes `Rejected` and they cannot log in.

---

### Method 2: HR/Admin Manual Creation (with Temporary Credentials)

1. **Employee Profile Creation**: An HR Manager or Admin goes to **Employee Management** -> click **Add Employee** -> fill out all operational details.
2. **Optional Login Generation Checkbox**:
   - Check the **Create Login Account** checkbox on the creation modal.
   - Upon submitting, the system generates an active `User` account with `Role = Standard Employee` linked to the profile.
   - A secure temporary password (e.g. `Temp@18392`) is automatically generated.
3. **Copy Credentials Warning**: The temporary password is displayed to the creator once inside a secure modal. The password must be copied immediately.

---

### 🔑 First-Time Login (Force Password Reset)

If a user account was generated with a temporary password (or has the `first_login` flag set):
- Upon their first login, they are immediately intercepted and force-redirected to the dedicated **Change Password** screen (`/change-password`).
- The sidebar, header, and other system pages are hidden. They cannot browse the app or view dashboard data.
- Once they successfully change their password, the `first_login` flag is cleared in the backend, and they are redirected to the home **Dashboard**.

---

## 🔗 14. API Documentation

Once the backend FastAPI server is running, interactive API documentations are automatically served:

* **Interactive Swagger UI**: `http://localhost:8000/docs`
* **Static ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 📋 15. Features Checklist

- [x] JWT Authentication & Token Refresh Interceptors
- [x] Password Visibility Toggle Icons (Login & Signup)
- [x] Account Sign Up / Register UI & Endpoint
- [x] Admin Role-Based Access Controls (RBAC)
- [x] Employee Self-Registration Approval/Rejection Workflow
- [x] HR/Admin Manual Employee Creation with Temp Password
- [x] Force Redirect on Temporary Password first login
- [x] Dashboard Statistics & Activity Panel
- [x] Employee Profile CRUD Operations
- [x] Soft Delete & Bulk Restore for Employees
- [x] Comprehensive Search, Sort, and Multi-parameter Filters
- [x] Master Module Configurations (Geographic & Operational)
- [x] User Account Profiles & Role Editor
- [x] PDF, Excel, and CSV Export Modules
- [x] CSV Bulk Employee Importer
- [x] Session-persistent Column Visibility Selector
- [ ] Redis Session/Token Caching

---

## 🔮 16. Future Improvements

- [ ] **Real-time Notifications**: Notify administrators on important employee profile actions.
- [ ] **SMTP Email Integration**: Deliver password reset links and account verification mail.
- [ ] **Dockerization**: Orchestrate backend, frontend, and database services via `docker-compose`.
- [ ] **Redis Caching**: Optimize master data structures (countries, cities) for fast delivery.
- [ ] **Advanced Data Charts**: Incorporate dashboard graphical metrics using Recharts.

---

## 🛠️ 17. Troubleshooting & FAQ

#### Q: I receive a `ModuleNotFoundError: No module named 'app'` error when trying to run tests.
Ensure you run tests with python's module executor rather than running pytest directly to ensure correct `PYTHONPATH`:
```bash
python -m pytest
```

#### Q: How can I seed the database if I reset my database schemas?
Run standard alembic rollbacks or updates, then run the seed script:
```bash
alembic upgrade head
python -m app.seed
```

#### Q: Why is my registration throwing an event loop error in pytest?
Our test config overrides standard pools with `NullPool` during test executions to handle the clean destruction of connections between synchronous event loops spun up by Starlette's sync `TestClient`. Ensure you run tests with the updated `conftest.py` setup.

---

## 🤝 18. Contributing

1. Fork the Project.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request.

---

## 📄 19. License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 👤 20. Author

* **Sripalasetti Sri Anjaneyulu**
  - GitHub: [@anji0731](https://github.com/anji0731)
  - LinkedIn: [srianjaneyulu0731](https://linkedin.com/in/srianjaneyulu0731)
  - Email: srianjaneyulu0731@gmail.com

---

## 💝 21. Footer

*Thank you for exploring the Enterprise Employee Management System! For any inquiries, bugs, or suggestions, feel free to open a GitHub issue or contact the developer directly.*
