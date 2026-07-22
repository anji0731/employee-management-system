import uuid
from typing import List, Optional
from sqlalchemy import String, Boolean, Table, Column, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin

# Association Table for Role <-> Permission
role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', String(36), ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('permission_id', String(36), ForeignKey('permissions.id', ondelete='CASCADE'), primary_key=True)
)

class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    permissions: Mapped[List["Permission"]] = relationship(
        "Permission",
        secondary=role_permissions,
        back_populates="roles",
        lazy="selectin"
    )
    users: Mapped[List["User"]] = relationship("User", back_populates="role")

class Permission(Base, TimestampMixin):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    module: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    roles: Mapped[List[Role]] = relationship(
        "Role",
        secondary=role_permissions,
        back_populates="permissions"
    )
