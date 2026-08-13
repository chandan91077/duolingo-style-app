from typing import List, Optional, Any
from pydantic import BaseModel


class AuthSyncRequest(BaseModel):
    firebase_uid: str
    email: str
    name: str
    avatar: Optional[str] = None


class LearnerResponse(BaseModel):
    id: int
    firebase_uid: Optional[str] = None
    name: str
    email: str
    avatar: Optional[str] = None
    total_xp: int
    streak: int
    hearts: int
    gems: int
    daily_xp_goal: int
    today_xp: int = 0

    class Config:
        from_attributes = True


class ExerciseSchema(BaseModel):
    id: int
    lesson_id: int
    type: str
    prompt: str
    explanation: Optional[str] = None
    options: Optional[Any] = None  # List of strings, word tokens, or pair items
    order_index: int

    class Config:
        from_attributes = True


class LessonSchema(BaseModel):
    id: int
    skill_id: int
    title: str
    order_index: int
    xp_reward: int
    exercises: List[ExerciseSchema] = []
    is_completed: bool = False

    class Config:
        from_attributes = True


class LessonSummarySchema(BaseModel):
    id: int
    skill_id: int
    title: str
    order_index: int
    xp_reward: int
    is_completed: bool = False

    class Config:
        from_attributes = True


class SkillSchema(BaseModel):
    id: int
    unit_id: int
    title: str
    description: Optional[str] = None
    order_index: int
    required_skill_id: Optional[int] = None
    is_locked: bool = True
    is_completed: bool = False
    progress: int = 0
    total_lessons: int = 0
    completed_lessons: int = 0
    lessons: List[LessonSummarySchema] = []

    class Config:
        from_attributes = True


class UnitSchema(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    order_index: int
    skills: List[SkillSchema] = []

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    name: str
    source_language: str
    target_language: str
    description: Optional[str] = None
    units: List[UnitSchema] = []

    class Config:
        from_attributes = True


class AnswerSubmission(BaseModel):
    exercise_id: int
    answer: Any  # String or JSON format depending on exercise type


class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    hearts: int
    xp_earned: int


class LessonCompleteResponse(BaseModel):
    success: bool
    xp_earned: int
    hearts: int
    streak: int
    total_xp: int
    skill_completed: bool
    next_skill_unlocked: bool
    learner: LearnerResponse


class LeaderboardEntry(BaseModel):
    id: int
    name: str
    avatar: Optional[str] = None
    total_xp: int
    streak: int
    rank: int
    is_current_user: bool = False

    class Config:
        from_attributes = True


class AchievementSchema(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    requirement_type: str
    requirement_value: int
    earned: bool = False
    earned_at: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    learner: LearnerResponse
    completed_skills: int
    completed_lessons: int
    achievements: List[AchievementSchema] = []
    today_xp: int
    daily_goal_percentage: float
