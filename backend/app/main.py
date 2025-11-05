from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="ModGuardAI Mobile App Backend API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "ModGuardAI API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include routers (these would be created separately)
# from .api import auth, verify, challenges, labs, badges, lessons, users
# app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
# app.include_router(verify.router, prefix=f"{settings.API_V1_PREFIX}/verify", tags=["verify"])
# app.include_router(challenges.router, prefix=f"{settings.API_V1_PREFIX}/challenges", tags=["challenges"])
# app.include_router(labs.router, prefix=f"{settings.API_V1_PREFIX}/labs", tags=["labs"])
# app.include_router(badges.router, prefix=f"{settings.API_V1_PREFIX}/badges", tags=["badges"])
# app.include_router(lessons.router, prefix=f"{settings.API_V1_PREFIX}/lessons", tags=["lessons"])
# app.include_router(users.router, prefix=f"{settings.API_V1_PREFIX}/user", tags=["user"])
