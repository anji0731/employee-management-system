from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class DesignationBase(BaseModel):
    title: str
    department_id: str
    code: Optional[str] = None

class DesignationCreate(DesignationBase):
    pass

class DesignationUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[str] = None
    code: Optional[str] = None

class DesignationResponse(DesignationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: str
    designations: List[DesignationResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
