import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    entity_name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    entity_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    state_before: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    state_after: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")
