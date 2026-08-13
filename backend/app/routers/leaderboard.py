from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Returns users ranked by total_xp descending.
    """
    users = db.query(User).order_by(User.total_xp.desc()).limit(50).all()

    leaderboard = []
    for rank, user in enumerate(users, start=1):
        leaderboard.append(
            LeaderboardEntry(
                id=user.id,
                name=user.name,
                avatar=user.avatar,
                total_xp=user.total_xp,
                streak=user.streak,
                rank=rank,
                is_current_user=(user.id == user_id),
            )
        )

    return leaderboard
