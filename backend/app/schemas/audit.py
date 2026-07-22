from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class AuditLogBase(BaseModel):
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: str
    entity_name: str
    entity_id: Optional[str] = None
    state_before: Optional[Dict[str, Any]] = None
    state_after: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
