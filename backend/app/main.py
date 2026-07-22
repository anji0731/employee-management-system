import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.api.v1.api import api_router
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.exception_handler import (
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Register Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Configure CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Ensure upload directory exists
os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Magnus Enterprise Employee Management System API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/health"
    }
