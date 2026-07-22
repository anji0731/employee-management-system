from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "INFO"
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
