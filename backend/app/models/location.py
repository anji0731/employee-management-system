import uuid
from typing import List, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin, SoftDeleteMixin

class Country(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "countries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(5), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    phone_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    states: Mapped[List["State"]] = relationship("State", back_populates="country", cascade="all, delete-orphan", lazy="selectin")
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="country")

class State(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "states"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    country_id: Mapped[str] = mapped_column(String(36), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    country: Mapped[Country] = relationship("Country", back_populates="states")
    cities: Mapped[List["City"]] = relationship("City", back_populates="state", cascade="all, delete-orphan", lazy="selectin")
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="state")

class City(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "cities"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    state_id: Mapped[str] = mapped_column(String(36), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    state: Mapped[State] = relationship("State", back_populates="cities")
    employees: Mapped[List["Employee"]] = relationship("Employee", back_populates="city")
