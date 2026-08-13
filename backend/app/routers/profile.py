from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import (
    User,
    UserLessonProgress,
    UserSkillProgress,
    Achievement,
    UserAchievement,
)
from app.schemas import ProfileResponse, LearnerResponse, AchievementSchema
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
def get_profile(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Returns user profile stats, completed counts, achievements, and daily goal progress.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Evaluate achievements
    ProgressService.check_and_award_achievements(user.id, db)

    completed_lessons = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user.id,
            UserLessonProgress.completed == True,
        )
        .count()
    )

    completed_skills = (
        db.query(UserSkillProgress)
        .filter(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.completed == True,
        )
        .count()
    )

    today_xp = ProgressService.get_today_xp(user.id, db)
    daily_pct = min(100.0, (today_xp / max(1, user.daily_xp_goal)) * 100.0)

    # Fetch all achievements with earned status
    all_achievements = db.query(Achievement).all()
    user_earned_map = {
        ua.achievement_id: ua.earned_at.isoformat()
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    achievement_schemas = []
    for ach in all_achievements:
        is_earned = ach.id in user_earned_map
        achievement_schemas.append(
            AchievementSchema(
                id=ach.id,
                name=ach.name,
                description=ach.description,
                icon=ach.icon,
                requirement_type=ach.requirement_type,
                requirement_value=ach.requirement_value,
                earned=is_earned,
                earned_at=user_earned_map.get(ach.id),
            )
        )

    learner_res = LearnerResponse(
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

    return ProfileResponse(
        learner=learner_res,
        completed_skills=completed_skills,
        completed_lessons=completed_lessons,
        achievements=achievement_schemas,
        today_xp=today_xp,
        daily_goal_percentage=round(daily_pct, 1),
    )
