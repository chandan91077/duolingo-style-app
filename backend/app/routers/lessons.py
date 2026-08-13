import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Lesson, Exercise, UserLessonProgress
from app.schemas import (
    LessonSchema,
    ExerciseSchema,
    AnswerSubmission,
    AnswerResponse,
    LessonCompleteResponse,
)
from app.services.lesson_service import LessonService

from app.deps import get_current_user_id

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])


@router.get("/{lesson_id}", response_model=LessonSchema)
def get_lesson(lesson_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Returns lesson details along with parsed exercises.
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Parse options JSON for each exercise
    parsed_exercises = []
    for ex in lesson.exercises:
        parsed_options = None
        if ex.options:
            try:
                parsed_options = json.loads(ex.options)
            except Exception:
                parsed_options = ex.options

        parsed_exercises.append(
            ExerciseSchema(
                id=ex.id,
                lesson_id=ex.lesson_id,
                type=ex.type,
                prompt=ex.prompt,
                explanation=ex.explanation,
                options=parsed_options,
                order_index=ex.order_index,
            )
        )

    is_completed = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user_id,
            UserLessonProgress.lesson_id == lesson_id,
            UserLessonProgress.completed == True,
        )
        .first()
        is not None
    )

    return LessonSchema(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        order_index=lesson.order_index,
        xp_reward=lesson.xp_reward,
        exercises=parsed_exercises,
        is_completed=is_completed,
    )


@router.post("/{lesson_id}/answer", response_model=AnswerResponse)
def submit_answer(
    lesson_id: int,
    submission: AnswerSubmission,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Validates user answer for an exercise in a lesson.
    Reduces hearts if incorrect, adds XP if correct.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    exercise = (
        db.query(Exercise)
        .filter(Exercise.id == submission.exercise_id, Exercise.lesson_id == lesson_id)
        .first()
    )
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found in this lesson")

    result = LessonService.validate_answer(user, exercise, submission.answer, db)
    return AnswerResponse(**result)


@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(lesson_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """
    Completes lesson, awards XP, updates streak, unlocks skills.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    result = LessonService.complete_lesson(user, lesson, db)
    return LessonCompleteResponse(**result)
