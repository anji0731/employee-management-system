import uuid
from datetime import date
from typing import List, Optional
from sqlalchemy import String, Integer, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin, AuditMixin, SoftDeleteMixin

class Employee(Base, TimestampMixin, AuditMixin, SoftDeleteMixin):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True)
    employee_code: Mapped[str] = mapped_column(String(30), unique=True, nullable=False, index=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    mobile: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)

    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False, index=True)
    designation_id: Mapped[str] = mapped_column(String(36), ForeignKey("designations.id", ondelete="RESTRICT"), nullable=False, index=True)
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False, index=True)
    state_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("states.id", ondelete="SET NULL"), nullable=True, index=True)
    city_id: Mapped[str] = mapped_column(String(36), ForeignKey("cities.id", ondelete="RESTRICT"), nullable=False, index=True)

    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Active", nullable=False, index=True)

    user: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="employee_profile",
        foreign_keys=[user_id]
    )
    department: Mapped["Department"] = relationship("Department", back_populates="employees", lazy="selectin")
    designation: Mapped["Designation"] = relationship("Designation", back_populates="employees", lazy="selectin")
    country: Mapped["Country"] = relationship("Country", back_populates="employees", lazy="selectin")
    state: Mapped[Optional["State"]] = relationship("State", back_populates="employees", lazy="selectin")
    city: Mapped["City"] = relationship("City", back_populates="employees", lazy="selectin")

    employee_skills: Mapped[List["EmployeeSkill"]] = relationship("EmployeeSkill", back_populates="employee", cascade="all, delete-orphan", lazy="selectin")
    documents: Mapped[List["EmployeeDocument"]] = relationship("EmployeeDocument", back_populates="employee", cascade="all, delete-orphan", lazy="selectin")

class EmployeeSkill(Base, TimestampMixin):
    __tablename__ = "employee_skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id: Mapped[str] = mapped_column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency_percentage: Mapped[int] = mapped_column(Integer, default=50, nullable=False)

    employee: Mapped[Employee] = relationship("Employee", back_populates="employee_skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="employee_skills", lazy="selectin")

class EmployeeDocument(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "employee_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    document_name: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)

    employee: Mapped[Employee] = relationship("Employee", back_populates="documents")
