from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.schemas.role import RoleResponse

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True
    is_superuser: bool = False
    role_id: Optional[str] = None
    status: str = "Active"
    is_temporary_password: bool = False
    first_login: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    role_id: Optional[str] = None
    status: Optional[str] = None
    is_temporary_password: Optional[bool] = None
    first_login: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    role: Optional[RoleResponse] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
