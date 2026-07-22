from app.services.base import BaseService
from app.repositories.user_repository import UserRepository, user_repository

class UserService(BaseService[UserRepository]):
    def __init__(self, repository: UserRepository = user_repository):
        super().__init__(repository)

user_service = UserService()
