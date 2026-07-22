import uuid
from typing import List, Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Skill(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    employee_skills: Mapped[List["EmployeeSkill"]] = relationship("EmployeeSkill", back_populates="skill")
