from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import uuid

from ..models.user import User
from ..schemas.auth import UserRegisterRequest, UserLoginRequest
from ..core.security import verify_password, get_password_hash, create_access_token, create_refresh_token


class AuthService:
    """Authentication service for user registration, login, and token management"""

    @staticmethod
    def register_user(db: Session, user_data: UserRegisterRequest) -> Optional[User]:
        """
        Register a new user

        Args:
            db: Database session
            user_data: User registration data

        Returns:
            Created user or None if email/username already exists

        Raises:
            IntegrityError: If email or username already exists
        """
        # Hash the password
        hashed_password = get_password_hash(user_data.password)

        # Create user
        db_user = User(
            id=str(uuid.uuid4()),
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            elo_rating=1000,  # Starting ELO
            accuracy=0.0,
            streak=0,
            level=1,
            xp=0,
            scan_credits=3,  # Free credits
            is_premium=False,
            total_earnings=0.0,
            available_balance=0.0,
            labels_submitted=0,
            labeling_accuracy=0.0,
        )

        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except IntegrityError:
            db.rollback()
            return None

    @staticmethod
    def authenticate_user(db: Session, login_data: UserLoginRequest) -> Optional[User]:
        """
        Authenticate a user with email and password

        Args:
            db: Database session
            login_data: Login credentials

        Returns:
            User if credentials are valid, None otherwise
        """
        # Find user by email
        user = db.query(User).filter(User.email == login_data.email).first()

        if not user:
            return None

        # Verify password
        if not verify_password(login_data.password, user.hashed_password):
            return None

        return user

    @staticmethod
    def create_tokens_for_user(user: User) -> dict:
        """
        Create access and refresh tokens for a user

        Args:
            user: User object

        Returns:
            Dictionary with access_token and refresh_token
        """
        token_data = {"sub": user.id, "email": user.email}

        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """
        Get user by ID

        Args:
            db: Database session
            user_id: User ID

        Returns:
            User or None if not found
        """
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Get user by email

        Args:
            db: Database session
            email: User email

        Returns:
            User or None if not found
        """
        return db.query(User).filter(User.email == email).first()
