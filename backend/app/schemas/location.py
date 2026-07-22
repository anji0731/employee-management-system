from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# City
class CityBase(BaseModel):
    name: str
    state_id: str

class CityCreate(CityBase):
    pass

class CityUpdate(BaseModel):
    name: Optional[str] = None
    state_id: Optional[str] = None

class CityResponse(CityBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# State
class StateBase(BaseModel):
    name: str
    country_id: str
    code: Optional[str] = None

class StateCreate(StateBase):
    pass

class StateUpdate(BaseModel):
    name: Optional[str] = None
    country_id: Optional[str] = None
    code: Optional[str] = None

class StateResponse(StateBase):
    id: str
    cities: List[CityResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Country
class CountryBase(BaseModel):
    name: str
    code: str
    phone_code: Optional[str] = None

class CountryCreate(CountryBase):
    pass

class CountryUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    phone_code: Optional[str] = None

class CountryResponse(CountryBase):
    id: str
    states: List[StateResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
