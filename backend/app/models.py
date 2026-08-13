from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar = Column(String, nullable=True)
    total_xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=120)
    daily_xp_goal = Column(Integer, default=50)
    last_activity_date = Column(String, nullable=True)  # YYYY-MM-DD format
    created_at = Column(DateTime, default=datetime.utcnow)

    skill_progresses = relationship("UserSkillProgress", back_populates="user")
    lesson_progresses = relationship("UserLessonProgress", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    units = relationship(
        "Unit", back_populates="course", order_by="Unit.order_index"
    )


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    course = relationship("Course", back_populates="units")
    skills = relationship(
        "Skill", back_populates="unit", order_by="Skill.order_index"
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    required_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)

    unit = relationship("Unit", back_populates="skills")
    required_skill = relationship("Skill", remote_side=[id])
    lessons = relationship(
        "Lesson", back_populates="skill", order_by="Lesson.order_index"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    xp_reward = Column(Integer, default=10)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship(
        "Exercise", back_populates="lesson", order_by="Exercise.order_index"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False)  # multiple_choice, translate, match_pairs, fill_blank, type_answer
    prompt = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    options = Column(Text, nullable=True)  # Stored as JSON string
    order_index = Column(Integer, default=0)

    lesson = relationship("Lesson", back_populates="exercises")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    completed = Column(Boolean, default=False)
    progress = Column(Integer, default=0)  # 0 to 100 percentage
    crowns = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="skill_progresses")
    skill = relationship("Skill")


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    best_score = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lesson_progresses")
    lesson = relationship("Lesson")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    requirement_type = Column(String, nullable=False)  # xp, streak, lessons_completed, skills_completed
    requirement_value = Column(Integer, nullable=False)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")
