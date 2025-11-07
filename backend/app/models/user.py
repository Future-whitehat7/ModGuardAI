from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String, nullable=True)

    # Stats
    elo_rating = Column(Integer, default=1000)
    accuracy = Column(Float, default=0.0)
    streak = Column(Integer, default=0)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    scan_credits = Column(Integer, default=3)

    # Subscription
    is_premium = Column(Boolean, default=False)
    premium_expires_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Labs
    total_earnings = Column(Float, default=0.0)
    available_balance = Column(Float, default=0.0)
    labels_submitted = Column(Integer, default=0)
    labeling_accuracy = Column(Float, default=0.0)
