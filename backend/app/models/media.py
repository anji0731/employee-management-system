import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from app.core.database import Base

class MediaAsset(Base):
    __tablename__ = "media_assets"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
