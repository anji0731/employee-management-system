import uuid
from typing import List, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Department(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    designations: Mapped[List["Designation"]] = relationship("Designation", back_populates="department", cascade="all, delete-orphan", lazy="selectin")
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="department")

class Designation(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "designations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    department: Mapped[Department] = relationship("Department", back_populates="designations")
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="designation")
