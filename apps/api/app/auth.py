from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings
from .schemas import TokenPair, UserOut


ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)


def create_token(subject: str, expires_delta: timedelta, extra: Optional[Dict[str, Any]] = None) -> str:
    now = datetime.now(timezone.utc)
    payload: Dict[str, Any] = {"sub": subject, "iat": int(now.timestamp()), "exp": int((now + expires_delta).timestamp())}
    if extra:
        payload.update(extra)
    token = jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)
    return token


def create_token_pair(email: str) -> TokenPair:
    access = create_token(email, timedelta(minutes=settings.access_token_expire_minutes), {"role": "engineer"})
    refresh = create_token(email, timedelta(minutes=settings.refresh_token_expire_minutes), {"type": "refresh"})
    return TokenPair(access_token=access, refresh_token=refresh, expires_in=settings.access_token_expire_minutes * 60)


def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> UserOut:
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Yetkilendirme bilgisi bulunamadı")
    try:
        claims = jwt.decode(creds.credentials, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Geçersiz token")
    email = claims.get("sub")
    role = claims.get("role", "engineer")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token içeriği eksik")
    return UserOut(email=email, role=role)


def dev_login(x_dev_user: Optional[str] = Header(default=None, alias="X-Dev-User")) -> TokenPair:
    if not settings.dev_auth_bypass:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Geliştirici modu kapalı")
    email = x_dev_user or "dev@local"
    return create_token_pair(email)


