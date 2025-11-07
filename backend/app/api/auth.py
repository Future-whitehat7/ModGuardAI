from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.security import verify_token
from ..schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenRefreshRequest,
    AuthResponse,
    UserResponse,
    TokenResponse,
)
from ..services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user

    - **email**: Valid email address (unique)
    - **username**: Username between 3-50 characters (unique)
    - **password**: Password with minimum 6 characters

    Returns user object with access and refresh tokens
    """
    # Check if user already exists
    existing_user = AuthService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = AuthService.register_user(db, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create tokens
    tokens = AuthService.create_tokens_for_user(user)

    return {
        "user": UserResponse.from_orm(user),
        "token": tokens["access_token"],
        "refreshToken": tokens["refresh_token"],
    }


@router.post("/login", response_model=AuthResponse)
async def login(
    login_data: UserLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with email and password

    - **email**: Registered email address
    - **password**: User password

    Returns user object with access and refresh tokens
    """
    # Authenticate user
    user = AuthService.authenticate_user(db, login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create tokens
    tokens = AuthService.create_tokens_for_user(user)

    return {
        "user": UserResponse.from_orm(user),
        "token": tokens["access_token"],
        "refreshToken": tokens["refresh_token"],
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    token_data: TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token

    - **refresh_token**: Valid refresh token

    Returns new access token
    """
    # Verify refresh token
    user_id = verify_token(token_data.refresh_token, token_type="refresh")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user
    user = AuthService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create new tokens
    tokens = AuthService.create_tokens_for_user(user)

    return {
        "token": tokens["access_token"],
        "refreshToken": tokens["refresh_token"],
    }


@router.post("/logout")
async def logout():
    """
    Logout user

    Note: Token invalidation is handled client-side by removing the token.
    Server-side token blacklisting can be implemented with Redis if needed.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: str = Depends(lambda: None),  # We'll add proper auth dependency later
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user

    Requires Authorization header with Bearer token
    """
    # This is a placeholder - we'll implement proper auth dependency
    return {"message": "Not implemented yet"}
