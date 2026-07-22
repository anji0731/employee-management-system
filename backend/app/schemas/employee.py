from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from app.schemas.department import DepartmentResponse, DesignationResponse
from app.schemas.location import CountryResponse, StateResponse, CityResponse
from app.schemas.skill import SkillResponse

class EmployeeSkillBase(BaseModel):
    skill_id: str
    proficiency_percentage: int = Field(default=50, ge=0, le=100)

class EmployeeSkillCreate(EmployeeSkillBase):
    pass

class EmployeeSkillResponse(EmployeeSkillBase):
    id: str
    skill: Optional[SkillResponse] = None
    model_config = ConfigDict(from_attributes=True)

class EmployeeDocumentBase(BaseModel):
    document_name: str
    document_type: str
    file_path: str
    file_size: int

class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass

class EmployeeDocumentResponse(EmployeeDocumentBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    mobile: str
    gender: str
    date_of_birth: date
    joining_date: date
    department_id: str
    designation_id: str
    country_id: str
    state_id: Optional[str] = None
    city_id: str
    address: Optional[str] = None
    status: str = "Active"

class EmployeeCreate(EmployeeBase):
    user_id: Optional[str] = None
    skills: Optional[List[EmployeeSkillCreate]] = []
    create_login_account: Optional[bool] = False

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    joining_date: Optional[date] = None
    department_id: Optional[str] = None
    designation_id: Optional[str] = None
    country_id: Optional[str] = None
    state_id: Optional[str] = None
    city_id: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: str
    employee_code: str
    avatar_url: Optional[str] = None
    department: Optional[DepartmentResponse] = None
    designation: Optional[DesignationResponse] = None
    country: Optional[CountryResponse] = None
    state: Optional[StateResponse] = None
    city: Optional[CityResponse] = None
    employee_skills: List[EmployeeSkillResponse] = []
    documents: List[EmployeeDocumentResponse] = []
    temporary_password: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
