from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

class SkillResponse(SkillBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
