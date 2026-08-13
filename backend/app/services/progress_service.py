from datetime import datetime, date
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from app.models import (
    User,
    Skill,
    Lesson,
    UserSkillProgress,
    UserLessonProgress,
    Achievement,
    UserAchievement,
)


class ProgressService:
    @staticmethod
    def get_skill_status(
        user_id: int, skill: Skill, db: Session
    ) -> Tuple[bool, bool, int, int, int]:
        """
        Determines skill unlock status, completion status, progress %, total lessons, and completed lessons count.
        Returns: (is_locked, is_completed, progress_pct, total_lessons, completed_lessons)
        """
        # Check required skill requirement
        is_locked = False
        if skill.required_skill_id:
            req_progress = (
                db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user_id,
                    UserSkillProgress.skill_id == skill.required_skill_id,
                )
                .first()
            )
            if not req_progress or not req_progress.completed:
                is_locked = True

        # Total lessons in skill
        lessons = (
            db.query(Lesson)
            .filter(Lesson.skill_id == skill.id)
            .order_by(Lesson.order_index)
            .all()
        )
        total_lessons = len(lessons)

        if total_lessons == 0:
            return is_locked, False, 0, 0, 0

        # Count completed lessons
        lesson_ids = [l.id for l in lessons]
        completed_lessons = (
            db.query(UserLessonProgress)
            .filter(
                UserLessonProgress.user_id == user_id,
                UserLessonProgress.lesson_id.in_(lesson_ids),
                UserLessonProgress.completed == True,
            )
            .count()
        )

        progress_pct = int((completed_lessons / total_lessons) * 100)
        is_completed = completed_lessons >= total_lessons

        # Sync or create UserSkillProgress record
        skill_progress = (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user_id,
                UserSkillProgress.skill_id == skill.id,
            )
            .first()
        )

        if not skill_progress:
            skill_progress = UserSkillProgress(
                user_id=user_id,
                skill_id=skill.id,
                completed=is_completed,
                progress=progress_pct,
                crowns=1 if is_completed else 0,
            )
            db.add(skill_progress)
        else:
            skill_progress.completed = is_completed
            skill_progress.progress = progress_pct
            if is_completed and skill_progress.crowns == 0:
                skill_progress.crowns = 1

        db.commit()

        return is_locked, is_completed, progress_pct, total_lessons, completed_lessons

    @staticmethod
    def get_today_xp(user_id: int, db: Session) -> int:
        """
        Calculates total XP earned today by summing completed lesson rewards today.
        """
        today_start = datetime.combine(date.today(), datetime.min.time())
        completed_today = (
            db.query(UserLessonProgress)
            .join(Lesson, UserLessonProgress.lesson_id == Lesson.id)
            .filter(
                UserLessonProgress.user_id == user_id,
                UserLessonProgress.completed == True,
                UserLessonProgress.completed_at >= today_start,
            )
            .all()
        )

        total = sum(item.lesson.xp_reward for item in completed_today if item.lesson)
        return total

    @staticmethod
    def check_and_award_achievements(user_id: int, db: Session) -> List[Achievement]:
        """
        Evaluates system achievements and unlocks any newly achieved ones for user.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []

        # Gather user metrics
        completed_lessons_count = (
            db.query(UserLessonProgress)
            .filter(
                UserLessonProgress.user_id == user_id,
                UserLessonProgress.completed == True,
            )
            .count()
        )
        completed_skills_count = (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user_id,
                UserSkillProgress.completed == True,
            )
            .count()
        )

        earned_ids = [
            ua.achievement_id
            for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
        ]

        unearned_achievements = (
            db.query(Achievement)
            .filter(~Achievement.id.in_(earned_ids) if earned_ids else True)
            .all()
        )

        newly_earned = []
        for ach in unearned_achievements:
            qualifies = False
            if ach.requirement_type == "xp" and user.total_xp >= ach.requirement_value:
                qualifies = True
            elif ach.requirement_type == "streak" and user.streak >= ach.requirement_value:
                qualifies = True
            elif (
                ach.requirement_type == "lessons_completed"
                and completed_lessons_count >= ach.requirement_value
            ):
                qualifies = True
            elif (
                ach.requirement_type == "skills_completed"
                and completed_skills_count >= ach.requirement_value
            ):
                qualifies = True

            if qualifies:
                user_ach = UserAchievement(
                    user_id=user_id,
                    achievement_id=ach.id,
                    earned_at=datetime.utcnow(),
                )
                db.add(user_ach)
                newly_earned.append(ach)

        if newly_earned:
            db.commit()

        return newly_earned
