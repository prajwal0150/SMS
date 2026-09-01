from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.core.security import decode_access_token, security


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    return decode_access_token(credentials)
