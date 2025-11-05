# ModGuardAI Backend API

FastAPI backend for the ModGuardAI mobile app, providing deepfake detection, user management, challenges, and crowdsourced labeling.

## Features

- 🔐 JWT Authentication with refresh tokens
- 📸 Media upload and verification (video, image, audio)
- 🎯 Daily challenges with ELO rating system
- 💰 Crowdsourced labeling with payment processing
- 🏆 Achievement and badge system
- 📚 Educational content management
- 🔍 ML-powered deepfake detection

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **File Storage**: AWS S3
- **ML**: OpenCV, Librosa, custom models
- **Payments**: Stripe
- **Task Queue**: Celery + Redis
- **Testing**: pytest

## Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth/         # Authentication endpoints
│   │   ├── verify/       # Media verification
│   │   ├── challenges/   # Daily challenges
│   │   ├── labs/         # Crowdsourced labeling
│   │   ├── badges/       # C2PA badges
│   │   ├── lessons/      # Educational content
│   │   └── users/        # User management
│   ├── core/             # Core configuration
│   │   ├── config.py     # Settings
│   │   ├── database.py   # DB connection
│   │   └── security.py   # Auth utilities
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py
│   │   ├── challenge.py
│   │   ├── verification.py
│   │   └── ...
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py
│   │   ├── auth.py
│   │   └── ...
│   ├── services/         # Business logic
│   │   ├── auth.py
│   │   ├── verification.py
│   │   ├── challenges.py
│   │   └── ...
│   ├── ml/               # ML models and pipelines
│   │   ├── video_detector.py
│   │   ├── audio_detector.py
│   │   └── image_detector.py
│   └── main.py           # FastAPI app entry point
├── tests/                # Test suite
├── alembic/              # Database migrations
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- AWS account (for S3)
- Stripe account (for payments)

### Installation

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create environment file:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/modguardai
SECRET_KEY=your-secret-key-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
STRIPE_API_KEY=your-stripe-key
REDIS_URL=redis://localhost:6379
```

4. **Setup database:**
```bash
# Create database
createdb modguardai

# Run migrations
alembic upgrade head
```

5. **Start the server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
```
POST /v1/auth/register      - Create new account
POST /v1/auth/login         - Login user
POST /v1/auth/refresh       - Refresh access token
POST /v1/auth/logout        - Logout user
```

### Verification
```
POST /v1/verify             - Upload media for verification
GET  /v1/verify/{job_id}    - Get verification status
POST /v1/batch/verify       - Batch verification
```

### Challenges
```
GET  /v1/challenges/daily        - Get daily challenges
POST /v1/challenges/submit       - Submit challenge answer
GET  /v1/challenges/leaderboard  - Get leaderboard
GET  /v1/challenges/history      - Get user's challenge history
```

### Labs (Crowdsourcing)
```
GET  /v1/labs/tasks         - Get available labeling tasks
POST /v1/labs/submit        - Submit label
GET  /v1/labs/earnings      - Get earnings breakdown
POST /v1/labs/payout        - Request payout
GET  /v1/labs/stats         - Get labeling statistics
```

### Badges
```
GET    /v1/badges           - List user's badges
POST   /v1/badges/issue     - Issue C2PA badge
DELETE /v1/badges/{id}      - Revoke badge
GET    /v1/badges/analytics - Get badge analytics
```

### Lessons
```
GET  /v1/lessons            - List all lessons
GET  /v1/lessons/{id}       - Get lesson details
POST /v1/lessons/{id}/complete - Mark lesson complete
GET  /v1/lessons/recommended   - Get personalized recommendations
```

### User
```
GET  /v1/user/profile       - Get user profile
PUT  /v1/user/profile       - Update profile
GET  /v1/user/stats         - Get user statistics
GET  /v1/user/achievements  - Get achievements
```

## Database Migrations

### Create migration
```bash
alembic revision --autogenerate -m "Description"
```

### Run migrations
```bash
alembic upgrade head
```

### Rollback
```bash
alembic downgrade -1
```

## ML Models

### Setup Models
```bash
# Download pre-trained models
python scripts/download_models.py

# Or train from scratch
python scripts/train_video_model.py
python scripts/train_audio_model.py
python scripts/train_image_model.py
```

### Model Architecture

**Video Detection:**
- Face detection and tracking
- Eye movement analysis
- Lighting consistency checks
- Temporal coherence analysis

**Audio Detection:**
- Spectral analysis (FFT)
- Voice quality metrics (MFCCs)
- Prosody patterns
- Formant analysis

**Image Detection:**
- Edge artifact detection
- Noise pattern analysis
- EXIF metadata validation
- GAN fingerprint detection

## Background Tasks

Start Celery worker for async tasks:
```bash
celery -A app.tasks worker --loglevel=info
```

Start Celery beat for scheduled tasks:
```bash
celery -A app.tasks beat --loglevel=info
```

## Testing

Run tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

## Deployment

### Using Docker

1. **Build image:**
```bash
docker build -t modguardai-backend .
```

2. **Run container:**
```bash
docker run -p 8000:8000 --env-file .env modguardai-backend
```

### Using Docker Compose

```bash
docker-compose up -d
```

### Production Deployment

1. **Set environment variables:**
```bash
export DATABASE_URL=postgresql://...
export SECRET_KEY=...
export AWS_ACCESS_KEY_ID=...
# ... etc
```

2. **Run with Gunicorn:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

3. **Setup Nginx reverse proxy**
4. **Enable SSL with Let's Encrypt**
5. **Setup monitoring (Sentry, DataDog, etc.)**

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `SECRET_KEY` | JWT signing key | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |
| `S3_BUCKET_NAME` | S3 bucket for media | modguardai-media |
| `STRIPE_API_KEY` | Stripe API key | - |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 104857600 (100MB) |

## Performance Optimization

- Database indexes on frequently queried fields
- Redis caching for hot data
- S3 pre-signed URLs for direct uploads
- Background tasks for heavy ML processing
- Connection pooling for database
- Rate limiting on API endpoints

## Security

- JWT tokens with short expiration
- Password hashing with bcrypt
- CORS configured for mobile app only
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- File upload validation (size, type)
- Rate limiting per IP/user

## Monitoring

### Health Check
```bash
curl http://localhost:8000/health
```

### Metrics
- Request latency
- Error rates
- Active users
- ML model accuracy
- Database query times

## Troubleshooting

**Database connection error:**
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL
```

**Redis connection error:**
```bash
# Check Redis is running
redis-cli ping

# Should return PONG
```

**ML model not loading:**
```bash
# Check model files exist
ls -l ml_models/

# Download models if missing
python scripts/download_models.py
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

Proprietary - All rights reserved

## Support

For issues: support@modguardai.com
