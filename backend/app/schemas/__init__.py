from app.schemas.role import RoleBase, RoleCreate, RoleUpdate, RoleResponse, PermissionBase, PermissionCreate, PermissionResponse
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse
from app.schemas.location import CountryBase, CountryCreate, CountryResponse, StateBase, StateCreate, StateResponse, CityBase, CityCreate, CityResponse
from app.schemas.department import DepartmentBase, DepartmentCreate, DepartmentResponse, DesignationBase, DesignationCreate, DesignationResponse
from app.schemas.skill import SkillBase, SkillCreate, SkillResponse
from app.schemas.employee import EmployeeBase, EmployeeCreate, EmployeeUpdate, EmployeeResponse, EmployeeSkillCreate, EmployeeSkillResponse, EmployeeDocumentCreate, EmployeeDocumentResponse
from app.schemas.audit import AuditLogBase, AuditLogCreate, AuditLogResponse
from app.schemas.notification import NotificationBase, NotificationCreate, NotificationResponse

__all__ = [
    "RoleBase", "RoleCreate", "RoleUpdate", "RoleResponse",
    "PermissionBase", "PermissionCreate", "PermissionResponse",
    "UserBase", "UserCreate", "UserUpdate", "UserResponse",
    "CountryBase", "CountryCreate", "CountryResponse",
    "StateBase", "StateCreate", "StateResponse",
    "CityBase", "CityCreate", "CityResponse",
    "DepartmentBase", "DepartmentCreate", "DepartmentResponse",
    "DesignationBase", "DesignationCreate", "DesignationResponse",
    "SkillBase", "SkillCreate", "SkillResponse",
    "EmployeeBase", "EmployeeCreate", "EmployeeUpdate", "EmployeeResponse",
    "EmployeeSkillCreate", "EmployeeSkillResponse",
    "EmployeeDocumentCreate", "EmployeeDocumentResponse",
    "AuditLogBase", "AuditLogCreate", "AuditLogResponse",
    "NotificationBase", "NotificationCreate", "NotificationResponse",
]
