from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LearnerResponse
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/api/learner", tags=["Learner"])


@router.get("", response_model=LearnerResponse)
def get_learner(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Returns current learner information (Default User ID = 1).
    Calculates daily XP earned.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Learner not found")

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
def refill_hearts(user_id: int = 1, db: Session = Depends(get_db)):
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
