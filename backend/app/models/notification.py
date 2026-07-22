import uuid
from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin

class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="INFO", nullable=False, index=True) # INFO, WARNING, SUCCESS, ERROR
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    user: Mapped["User"] = relationship("User", back_populates="notifications")
