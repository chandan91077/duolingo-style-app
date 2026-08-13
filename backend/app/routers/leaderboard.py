from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LeaderboardEntry
from app.deps import get_current_user_id

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Returns real registered users ranked by total_xp descending.
    Excludes dummy/test seed accounts.
    """
    users = (
        db.query(User)
        .filter(
            User.firebase_uid.isnot(None),
            ~User.email.like("%@example.com"),
            ~User.email.like("demo@%"),
        )
        .order_by(User.total_xp.desc(), User.streak.desc())
        .limit(50)
        .all()
    )

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
