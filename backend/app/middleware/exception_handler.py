import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app.exceptions")

async def global_exception_handler(request: Request, exc: Exception):
    """Catches all unhandled exceptions and returns standardized JSON error response."""
    logger.error(f"Unhandled Exception: {str(exc)} | Path: {request.url.path}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected server error occurred. Please contact system administrator.",
            "path": request.url.path
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Formats HTTP exceptions into standardized error payloads."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "detail": exc.detail,
            "path": request.url.path
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats Pydantic request validation errors into clean JSON response."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "path": request.url.path
        }
    )
