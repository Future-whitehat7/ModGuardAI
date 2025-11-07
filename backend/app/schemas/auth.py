from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# Request Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class TokenRefreshRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh token")


# Response Schemas
class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    avatar: Optional[str] = None
    elo_rating: int = Field(alias="eloRating")
    accuracy: float
    streak: int
    level: int
    xp: int
    scan_credits: int = Field(alias="scanCredits")
    is_premium: bool = Field(alias="isPremium")

    class Config:
        from_attributes = True
        populate_by_name = True


class TokenResponse(BaseModel):
    access_token: str = Field(alias="token")
    refresh_token: str = Field(alias="refreshToken")
    token_type: str = "bearer"

    class Config:
        populate_by_name = True


class AuthResponse(BaseModel):
    user: UserResponse
    token: str
    refresh_token: str = Field(alias="refreshToken")

    class Config:
        populate_by_name = True
