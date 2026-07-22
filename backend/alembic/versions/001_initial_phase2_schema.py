"""initial_phase2_schema

Revision ID: 001_initial_phase2_schema
Revises: 
Create Date: 2026-07-19 17:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_phase2_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Roles & Permissions
    op.create_table(
        'permissions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('code', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('module', sa.String(50), nullable=False, index=True),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'roles',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('code', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('is_system', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'role_permissions',
        sa.Column('role_id', sa.String(36), sa.ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('permission_id', sa.String(36), sa.ForeignKey('permissions.id', ondelete='CASCADE'), primary_key=True),
    )

    # 2. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=False, index=True),
        sa.Column('role_id', sa.String(36), sa.ForeignKey('roles.id', ondelete='SET NULL'), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False, index=True),
        sa.Column('is_superuser', sa.Boolean(), default=False, nullable=False),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 3. Master Data (Departments, Designations, Countries, States, Cities, Skills)
    op.create_table(
        'departments',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('code', sa.String(20), unique=True, nullable=False, index=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'designations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('department_id', sa.String(36), sa.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('title', sa.String(100), nullable=False, index=True),
        sa.Column('code', sa.String(20), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'countries',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('code', sa.String(5), unique=True, nullable=False, index=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('phone_code', sa.String(10), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'states',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('code', sa.String(10), nullable=True),
        sa.Column('name', sa.String(100), nullable=False, index=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'cities',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('state_id', sa.String(36), sa.ForeignKey('states.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('name', sa.String(100), nullable=False, index=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'skills',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('category', sa.String(50), nullable=True, index=True),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 4. Employee Core (Employees, EmployeeSkills, EmployeeDocuments)
    op.create_table(
        'employees',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), unique=True, nullable=True),
        sa.Column('employee_code', sa.String(30), unique=True, nullable=False, index=True),
        sa.Column('first_name', sa.String(50), nullable=False, index=True),
        sa.Column('last_name', sa.String(50), nullable=False, index=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('mobile', sa.String(20), nullable=False, index=True),
        sa.Column('gender', sa.String(20), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('joining_date', sa.Date(), nullable=False),
        sa.Column('department_id', sa.String(36), sa.ForeignKey('departments.id', ondelete='RESTRICT'), nullable=False, index=True),
        sa.Column('designation_id', sa.String(36), sa.ForeignKey('designations.id', ondelete='RESTRICT'), nullable=False, index=True),
        sa.Column('country_id', sa.String(36), sa.ForeignKey('countries.id', ondelete='RESTRICT'), nullable=False, index=True),
        sa.Column('state_id', sa.String(36), sa.ForeignKey('states.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('city_id', sa.String(36), sa.ForeignKey('cities.id', ondelete='RESTRICT'), nullable=False, index=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('status', sa.String(20), default='Active', nullable=False, index=True),
        sa.Column('created_by_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_by_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'employee_skills',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('employee_id', sa.String(36), sa.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('skill_id', sa.String(36), sa.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('proficiency_percentage', sa.Integer(), default=50, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        'employee_documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('employee_id', sa.String(36), sa.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('document_name', sa.String(255), nullable=False),
        sa.Column('document_type', sa.String(50), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('is_deleted', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 5. AuditLogs & Notifications
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('user_email', sa.String(255), nullable=True),
        sa.Column('action', sa.String(50), nullable=False, index=True),
        sa.Column('entity_name', sa.String(50), nullable=False, index=True),
        sa.Column('entity_id', sa.String(50), nullable=True, index=True),
        sa.Column('state_before', sa.JSON(), nullable=True),
        sa.Column('state_after', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False, index=True),
    )

    op.create_table(
        'notifications',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('type', sa.String(50), default='INFO', nullable=False, index=True),
        sa.Column('is_read', sa.Boolean(), default=False, nullable=False, index=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('audit_logs')
    op.drop_table('employee_documents')
    op.drop_table('employee_skills')
    op.drop_table('employees')
    op.drop_table('skills')
    op.drop_table('cities')
    op.drop_table('states')
    op.drop_table('countries')
    op.drop_table('designations')
    op.drop_table('departments')
    op.drop_table('users')
    op.drop_table('role_permissions')
    op.drop_table('roles')
    op.drop_table('permissions')
