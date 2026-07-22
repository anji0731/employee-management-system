from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from app.schemas.role import RoleResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    remember_me: Optional[bool] = False

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    is_superuser: bool
    status: str
    is_temporary_password: bool
    first_login: bool
    role: Optional[RoleResponse] = None
    permissions: List[str] = []

    model_config = ConfigDict(from_attributes=True)
