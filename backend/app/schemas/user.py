from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None


class User(UserBase):
    id: str
    avatar: Optional[str] = None
    elo_rating: int = Field(alias="eloRating")
    accuracy: float
    streak: int
    level: int
    xp: int
    scan_credits: int = Field(alias="scanCredits")
    is_premium: bool = Field(alias="isPremium")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True


class UserStats(BaseModel):
    challenges_completed: int = Field(alias="challengesCompleted")
    accuracy: float
    elo_rating: int = Field(alias="eloRating")
    streak: int
    level: int
    xp: int
    total_earnings: float = Field(alias="totalEarnings")
    badges_earned: list[str] = Field(alias="badgesEarned")

    class Config:
        populate_by_name = True
