from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LearnerResponse
from app.services.progress_service import ProgressService
from app.services.streak_service import StreakService
from app.deps import get_current_user_id

router = APIRouter(prefix="/api/learner", tags=["Learner"])


@router.get("", response_model=LearnerResponse)
def get_learner(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Returns current learner information.
    Calculates daily XP earned and updates streak.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Learner not found")

    StreakService.update_user_streak(user, db)
    today_xp = ProgressService.get_today_xp(user.id, db)

    return LearnerResponse(
        id=user.id,
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


@router.post("/refill-hearts", response_model=LearnerResponse)
def refill_hearts(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Refills user hearts back to 5.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Learner not found")

    user.hearts = 5
    db.commit()
    db.refresh(user)

    today_xp = ProgressService.get_today_xp(user.id, db)

    return LearnerResponse(
        id=user.id,
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
