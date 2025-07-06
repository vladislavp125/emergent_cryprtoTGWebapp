from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import uuid

from database import get_db
from models import User
from . import schemas

# Secret key to encode and decode JWT tokens
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme for password (username and password) authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to create a new access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to get the current user from the token
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username, is_active=True)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

# Function to get the current active user
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Function to handle TON Connect authentication
async def ton_connect_auth(request: schemas.TonConnectRequest, db: Session = Depends(get_db)):
    # Check if a user with the provided wallet address exists
    user = db.query(User).filter(User.wallet_address == request.wallet_address).first()

    if not user:
        # If the user does not exist, create a new user
        user = User(
            username=request.username,
            wallet_address=request.wallet_address
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create a JWT token for authentication
    access_token = create_access_token(data={"sub": user.username})

    # Return user data along with the token
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "wallet_address": user.wallet_address,
            "is_active": user.is_active
        }
    }

# Middleware to handle session management
async def session_middleware(request: Request, call_next):
    # Get the token from the Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            # Decode the token to get the username
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            if username:
                # Get the user from the database
                db = next(get_db())
                user = db.query(User).filter(User.username == username).first()
                if user:
                    # Store the user in the request state for later use
                    request.state.user = user
        except JWTError:
            pass

    # Call the next middleware or route handler
    response = await call_next(request)
    return response
