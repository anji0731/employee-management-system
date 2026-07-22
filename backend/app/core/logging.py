import logging
import sys
from app.core.config import settings

def setup_logging():
    logging.basicConfig(
        level=logging.DEBUG if settings.DEBUG else logging.INFO,
        format="%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
    
    # Suppress verbose loggers
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

logger = logging.getLogger("magnus_enterprise")
