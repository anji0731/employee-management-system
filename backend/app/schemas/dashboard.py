from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

class DashboardStats(BaseModel):
    total_employees: int
    active_employees: int
    total_users: int
    departments_count: int
    countries_count: int
    states_count: int
    cities_count: int

class RecentEmployeeItem(BaseModel):
    id: str
    employee_code: str
    first_name: str
    last_name: str
    email: str
    department_name: Optional[str] = None
    status: str
    joining_date: Optional[str] = None

class RecentUserItem(BaseModel):
    id: str
    email: str
    full_name: str
    role_name: Optional[str] = None
    is_active: bool

class RecentActivityItem(BaseModel):
    id: str
    action: str
    user_email: Optional[str] = None
    entity_name: str
    timestamp: Optional[datetime] = None

class DynamicDashboardResponse(BaseModel):
    stats: DashboardStats
    recent_employees: List[RecentEmployeeItem]
    recent_users: List[RecentUserItem]
    recent_activities: List[RecentActivityItem]

# Legacy / Compatibility schemas
class StatWidget(BaseModel):
    title: str
    count: int
    change: str
    icon: str
    color: str

class ChartDataPoint(BaseModel):
    name: str
    value: int

class DashboardResponse(BaseModel):
    stats: List[StatWidget]
    department_distribution: List[ChartDataPoint]
    gender_distribution: List[ChartDataPoint]
    skill_breakdown: List[ChartDataPoint]

class AuditLogResponse(BaseModel):
    id: str
    user_email: Optional[str] = None
    action: str
    entity_name: str
    entity_id: Optional[str] = None
    state_before: Optional[Dict[str, Any]] = None
    state_after: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
