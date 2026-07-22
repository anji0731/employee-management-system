from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Boolean, String, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

class TimestampMixin:
    """Mixin for models requiring created_at and updated_at tracking."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

class AuditMixin:
    """Mixin for tracking which user created or last modified a record."""
    created_by_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    updated_by_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

class SoftDeleteMixin:
    """Mixin for logical soft-deletion of records."""
    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = datetime.now(timezone.utc)

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
