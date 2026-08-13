from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import AuthSyncRequest, LearnerResponse
from app.services.progress_service import ProgressService
from app.services.streak_service import StreakService

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/sync", response_model=LearnerResponse)
def sync_user(data: AuthSyncRequest, db: Session = Depends(get_db)):
    """
    Syncs Firebase user with SQLite database.
    If user exists by firebase_uid or email, returns existing user.
    Otherwise creates a brand new user with 0 XP and default stats.
    """
    user = db.query(User).filter(User.firebase_uid == data.firebase_uid).first()
    
    if not user:
        # Check by email if firebase_uid was not linked yet
        user = db.query(User).filter(User.email == data.email).first()
        if user:
            user.firebase_uid = data.firebase_uid
            if data.avatar and not user.avatar:
                user.avatar = data.avatar
            db.commit()
            db.refresh(user)
        else:
            # Create new user
            user = User(
                firebase_uid=data.firebase_uid,
                name=data.name or data.email.split("@")[0],
                email=data.email,
                avatar=data.avatar or "👤",
                total_xp=0,
                streak=1,
                hearts=5,
                gems=120,
                daily_xp_goal=50,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    # Ensure streak is active and updated for today
    StreakService.update_user_streak(user, db)
    today_xp = ProgressService.get_today_xp(user.id, db)

    return LearnerResponse(
        id=user.id,
        firebase_uid=user.firebase_uid,
        name=user.name,
        email=user.email,
        avatar=user.avatar,
        total_xp=user.total_xp,
        streak=user.streak,
        hearts=user.hearts,
        gems=user.gems,
        daily_xp_goal=user.daily_xp_goal,
        today_xp=today_xp,
    )
