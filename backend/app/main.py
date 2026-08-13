import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import learner, course, lessons, leaderboard, profile, auth

load_dotenv()

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Duolingo-Style Language Learning API",
    description="Backend API for gamified language learning web app built with FastAPI, SQLAlchemy & SQLite.",
    version="1.0.0",
)

# Configure CORS to support Vercel deployments & localhost
frontend_url = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if frontend_url else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(learner.router)
app.include_router(course.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(profile.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to Duolingo-Style Language Learning API",
        "docs_url": "/docs",
    }
