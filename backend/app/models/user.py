import uuid
from typing import Optional, List
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class User(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    role_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("roles.id", ondelete="SET NULL"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Active", nullable=False, index=True)
    is_temporary_password: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    first_login: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    role: Mapped[Optional["Role"]] = relationship("Role", back_populates="users", lazy="selectin")
    employee_profile: Mapped[Optional["Employee"]] = relationship(
        "Employee",
        back_populates="user",
        uselist=False,
        foreign_keys="[Employee.user_id]"
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user")
