from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Course, Unit, Skill, Lesson, UserLessonProgress
from app.schemas import CourseResponse, UnitSchema, SkillSchema, LessonSummarySchema
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/api/course", tags=["Course"])


@router.get("", response_model=CourseResponse)
def get_course(user_id: int = 1, db: Session = Depends(get_db)):
    """
    Returns the complete course learning path with units, skills, lessons, and progress/lock statuses.
    """
    course = db.query(Course).first()
    if not course:
        raise HTTPException(status_code=404, detail="No course found. Please seed the database.")

    unit_schemas = []
    for unit in course.units:
        skill_schemas = []
        for skill in unit.skills:
            # Determine skill lock status and lesson completion
            is_locked, is_completed, progress_pct, total_lessons, completed_lessons = (
                ProgressService.get_skill_status(user_id, skill, db)
            )

            # Build lesson summary models
            lesson_summaries = []
            for lesson in skill.lessons:
                is_lesson_completed = (
                    db.query(UserLessonProgress)
                    .filter(
                        UserLessonProgress.user_id == user_id,
                        UserLessonProgress.lesson_id == lesson.id,
                        UserLessonProgress.completed == True,
                    )
                    .first()
                    is not None
                )
                lesson_summaries.append(
                    LessonSummarySchema(
                        id=lesson.id,
                        skill_id=lesson.skill_id,
                        title=lesson.title,
                        order_index=lesson.order_index,
                        xp_reward=lesson.xp_reward,
                        is_completed=is_lesson_completed,
                    )
                )

            skill_schemas.append(
                SkillSchema(
                    id=skill.id,
                    unit_id=skill.unit_id,
                    title=skill.title,
                    description=skill.description,
                    order_index=skill.order_index,
                    required_skill_id=skill.required_skill_id,
                    is_locked=is_locked,
                    is_completed=is_completed,
                    progress=progress_pct,
                    total_lessons=total_lessons,
                    completed_lessons=completed_lessons,
                    lessons=lesson_summaries,
                )
            )

        unit_schemas.append(
            UnitSchema(
                id=unit.id,
                course_id=unit.course_id,
                title=unit.title,
                description=unit.description,
                order_index=unit.order_index,
                skills=skill_schemas,
            )
        )

    return CourseResponse(
        id=course.id,
        name=course.name,
        source_language=course.source_language,
        target_language=course.target_language,
        description=course.description,
        units=unit_schemas,
    )
