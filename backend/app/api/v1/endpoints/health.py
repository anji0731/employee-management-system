from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }
