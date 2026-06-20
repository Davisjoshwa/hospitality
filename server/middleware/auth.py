from fastapi import Request, HTTPException, status
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication token, authorization denied."
        )
    
    parts = auth_header.split(' ')
    if len(parts) != 2 or parts[0] != 'Bearer':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token format is invalid. Must be Bearer <token>"
        )
        
    token = parts[1]
    
    try:
        secret_key = os.getenv("JWT_SECRET") or "supersecretjwtkeyhospihire2026"
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        # Payload holds: {"id": user_id, "role": role}
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not valid."
        )
