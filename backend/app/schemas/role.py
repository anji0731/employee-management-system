from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class PermissionBase(BaseModel):
    code: str
    module: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseModel):
    code: Optional[str] = None
    module: Optional[str] = None
    description: Optional[str] = None

class PermissionResponse(PermissionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RoleBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_system: bool = False

class RoleCreate(RoleBase):
    permission_ids: Optional[List[str]] = []

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    permission_ids: Optional[List[str]] = None

class RoleResponse(RoleBase):
    id: str
    permissions: List[PermissionResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
