from app.repositories.base import BaseRepository
from app.models.location import Country, State, City
from app.models.department import Department, Designation
from app.models.skill import Skill

class CountryRepository(BaseRepository[Country]):
    def __init__(self):
        super().__init__(Country)

class StateRepository(BaseRepository[State]):
    def __init__(self):
        super().__init__(State)

class CityRepository(BaseRepository[City]):
    def __init__(self):
        super().__init__(City)

class DepartmentRepository(BaseRepository[Department]):
    def __init__(self):
        super().__init__(Department)

class DesignationRepository(BaseRepository[Designation]):
    def __init__(self):
        super().__init__(Designation)

class SkillRepository(BaseRepository[Skill]):
    def __init__(self):
        super().__init__(Skill)

country_repository = CountryRepository()
state_repository = StateRepository()
city_repository = CityRepository()
department_repository = DepartmentRepository()
designation_repository = DesignationRepository()
skill_repository = SkillRepository()
