from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "ModGuardAI API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/v1"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/modguardai"

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:19000", "http://localhost:19001", "exp://localhost:19000"]

    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = "modguardai-media"

    # Stripe
    STRIPE_API_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # ML Models
    MODEL_PATH: str = "./ml_models"
    VIDEO_MODEL_PATH: str = "./ml_models/video_detector.pkl"
    AUDIO_MODEL_PATH: str = "./ml_models/audio_detector.pkl"
    IMAGE_MODEL_PATH: str = "./ml_models/image_detector.pkl"

    # File Upload
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_VIDEO_TYPES: list = ["video/mp4", "video/mov", "video/avi"]
    ALLOWED_IMAGE_TYPES: list = ["image/jpeg", "image/jpg", "image/png"]
    ALLOWED_AUDIO_TYPES: list = ["audio/mp3", "audio/wav", "audio/m4a"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
