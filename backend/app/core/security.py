from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional, Dict
import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against an encoded bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generates a bcrypt hash for a given password."""
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Encodes a JWT Access Token with expiration payload."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Encodes a JWT Refresh Token with expiration payload."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """Decodes and validates a JWT token."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
