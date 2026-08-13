import json
from typing import Any, Dict
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import (
    User,
    Lesson,
    Exercise,
    UserLessonProgress,
    UserSkillProgress,
    Skill,
)
from app.services.streak_service import StreakService
from app.services.progress_service import ProgressService


class LessonService:
    @staticmethod
    def validate_answer(
        user: User, exercise: Exercise, user_answer: Any, db: Session
    ) -> Dict[str, Any]:
        """
        Validates user submitted answer for an exercise.
        Handles multiple_choice, translate, match_pairs, fill_blank, type_answer.
        Reduces hearts if incorrect.
        Returns dict with (correct, correct_answer, explanation, hearts, xp_earned).
        """
        if user.hearts <= 0:
            raise HTTPException(
                status_code=400,
                detail="No hearts remaining. Refill hearts to continue practicing.",
            )

        is_correct = False
        target_answer = exercise.correct_answer.strip()

        if exercise.type in ["multiple_choice", "fill_blank", "type_answer", "translate"]:
            if isinstance(user_answer, str):
                normalized_user = user_answer.strip().lower()
                normalized_target = target_answer.lower()
                # Remove common trailing punctuation like '.', '!', '?' for flexible matching
                normalized_user = normalized_user.rstrip(".!?")
                normalized_target = normalized_target.rstrip(".!?")
                is_correct = normalized_user == normalized_target
        elif exercise.type == "match_pairs":
            # Match pairs can be passed as JSON dict or list of pairs
            try:
                target_pairs = json.loads(target_answer)
                if isinstance(user_answer, dict):
                    is_correct = user_answer == target_pairs
                elif isinstance(user_answer, str):
                    is_correct = user_answer.strip() == target_answer.strip()
            except Exception:
                is_correct = str(user_answer).strip() == target_answer.strip()

        xp_earned = 0
        if is_correct:
            xp_earned = 2
            user.total_xp += xp_earned
        else:
            user.hearts = max(0, user.hearts - 1)

        db.commit()

        return {
            "correct": is_correct,
            "correct_answer": exercise.correct_answer,
            "explanation": exercise.explanation or f"The correct answer is '{exercise.correct_answer}'.",
            "hearts": user.hearts,
            "xp_earned": xp_earned,
        }

    @staticmethod
    def complete_lesson(
        user: User, lesson: Lesson, db: Session
    ) -> Dict[str, Any]:
        """
        Completes a lesson, updates lesson progress, user XP, streak, skill progress, and unlocks next skill if eligible.
        """
        # Record or update lesson progress
        progress = (
            db.query(UserLessonProgress)
            .filter(
                UserLessonProgress.user_id == user.id,
                UserLessonProgress.lesson_id == lesson.id,
            )
            .first()
        )

        first_completion = False
        if not progress:
            progress = UserLessonProgress(
                user_id=user.id,
                lesson_id=lesson.id,
                completed=True,
                best_score=100,
            )
            db.add(progress)
            first_completion = True
        else:
            if not progress.completed:
                first_completion = True
            progress.completed = True

        # Award lesson XP reward
        xp_gained = lesson.xp_reward if first_completion else 5
        user.total_xp += xp_gained

        # Update streak
        updated_streak = StreakService.update_user_streak(user, db)

        # Update current skill progress
        skill = db.query(Skill).filter(Skill.id == lesson.skill_id).first()
        skill_completed = False
        next_skill_unlocked = False

        if skill:
            is_locked, is_completed, progress_pct, total_lessons, completed_lessons = (
                ProgressService.get_skill_status(user.id, skill, db)
            )
            skill_completed = is_completed

            # Check if next skill unlocked
            next_skills = (
                db.query(Skill)
                .filter(Skill.required_skill_id == skill.id)
                .all()
            )
            if skill_completed and next_skills:
                next_skill_unlocked = True

        # Check achievements
        ProgressService.check_and_award_achievements(user.id, db)

        today_xp = ProgressService.get_today_xp(user.id, db)

        db.commit()

        learner_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar": user.avatar,
            "total_xp": user.total_xp,
            "streak": user.streak,
            "hearts": user.hearts,
            "gems": user.gems,
            "daily_xp_goal": user.daily_xp_goal,
            "today_xp": today_xp,
        }

        return {
            "success": True,
            "xp_earned": xp_gained,
            "hearts": user.hearts,
            "streak": updated_streak,
            "total_xp": user.total_xp,
            "skill_completed": skill_completed,
            "next_skill_unlocked": next_skill_unlocked,
            "learner": learner_data,
        }
