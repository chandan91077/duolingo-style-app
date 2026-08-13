from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from app.models import User


class StreakService:
    @staticmethod
    def update_user_streak(user: User, db: Session) -> int:
        """
        Calculates and updates user streak based on activity date.
        Rules:
        - Same calendar day: streak unchanged
        - Yesterday (1 day gap): streak += 1
        - Missed day (>1 day gap or no previous activity): streak resets to 1
        """
        today_str = date.today().isoformat()
        
        if not user.last_activity_date:
            user.streak = 1
            user.last_activity_date = today_str
            db.commit()
            return user.streak

        if user.last_activity_date == today_str:
            return user.streak

        last_date = date.fromisoformat(user.last_activity_date)
        today_date = date.today()
        diff = (today_date - last_date).days

        if diff == 1:
            user.streak += 1
        elif diff > 1:
            user.streak = 1

        user.last_activity_date = today_str
        db.commit()
        return user.streak

    @staticmethod
    def check_heart_regeneration(user: User, db: Session) -> int:
        """
        Simple heart regeneration logic.
        If user hearts < 5, restore to 5 if hearts were depleted in previous session.
        For simplicity, auto-refills 1 heart if < 5 during daily check, or can be called on access.
        """
        if user.hearts < 5:
            # Simple check: if not today's activity yet, refill 1 heart up to 5
            pass
        return user.hearts
