import json
from datetime import datetime, date
from app.database import engine, Base, SessionLocal
from app.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserSkillProgress,
    UserLessonProgress,
    Achievement,
    UserAchievement,
)


def seed_database():
    print("Resetting database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Users...")
        # Main learner (User ID = 1)
        today_str = date.today().isoformat()
        alex = User(
            id=1,
            name="Alex",
            email="alex@example.com",
            avatar="🚀",
            total_xp=120,
            streak=4,
            hearts=5,
            gems=120,
            daily_xp_goal=50,
            last_activity_date=today_str,
        )

        # Leaderboard competing users
        priya = User(
            id=2,
            name="Priya",
            email="priya@example.com",
            avatar="⭐",
            total_xp=720,
            streak=12,
            hearts=5,
            gems=350,
            daily_xp_goal=50,
        )
        chandan = User(
            id=3,
            name="Chandan",
            email="chandan@example.com",
            avatar="🦁",
            total_xp=540,
            streak=8,
            hearts=4,
            gems=280,
            daily_xp_goal=50,
        )
        rahul = User(
            id=4,
            name="Rahul",
            email="rahul@example.com",
            avatar="🎨",
            total_xp=430,
            streak=5,
            hearts=5,
            gems=200,
            daily_xp_goal=50,
        )
        sofia = User(
            id=5,
            name="Sofia",
            email="sofia@example.com",
            avatar="🌸",
            total_xp=310,
            streak=3,
            hearts=5,
            gems=150,
            daily_xp_goal=50,
        )

        db.add_all([alex, priya, chandan, rahul, sofia])
        db.commit()

        print("Seeding Achievements...")
        ach_first_lesson = Achievement(
            id=1,
            name="First Step",
            description="Complete your first lesson",
            icon="zap",
            requirement_type="lessons_completed",
            requirement_value=1,
        )
        ach_streak_7 = Achievement(
            id=2,
            name="Wildfire",
            description="Reach a 7-day learning streak",
            icon="flame",
            requirement_type="streak",
            requirement_value=7,
        )
        ach_xp_100 = Achievement(
            id=3,
            name="XP Master",
            description="Earn 100 XP total",
            icon="star",
            requirement_type="xp",
            requirement_value=100,
        )
        ach_skill_complete = Achievement(
            id=4,
            name="Scholar",
            description="Complete your first full skill",
            icon="award",
            requirement_type="skills_completed",
            requirement_value=1,
        )

        db.add_all([ach_first_lesson, ach_streak_7, ach_xp_100, ach_skill_complete])
        db.commit()

        print("Seeding Course: Hindi for Beginners...")
        course = Course(
            id=1,
            name="Hindi for Beginners",
            source_language="English",
            target_language="Hindi",
            description="Master fundamental Hindi vocabulary, conversational phrases, greetings, and daily expressions.",
        )
        db.add(course)
        db.commit()

        # --- Unit 1: Basics (बुनियादी शब्द) ---
        unit1 = Unit(
            id=1,
            course_id=course.id,
            title="Unit 1: Basics",
            description="Learn essential Hindi greetings, courtesy, and core vocabulary",
            order_index=1,
        )
        db.add(unit1)
        db.commit()

        # Skill 1: Greetings (Unlocked initially)
        skill1 = Skill(
            id=1,
            unit_id=unit1.id,
            title="Greetings",
            description="Namaste, polite hellos, and saying goodbye",
            order_index=1,
            required_skill_id=None,
        )
        # Skill 2: Basic Words (Locked until Skill 1 completed)
        skill2 = Skill(
            id=2,
            unit_id=unit1.id,
            title="Basic Words",
            description="Essential yes/no, please, and everyday words",
            order_index=2,
            required_skill_id=1,
        )
        # Skill 3: Introductions (Locked until Skill 2 completed)
        skill3 = Skill(
            id=3,
            unit_id=unit1.id,
            title="Introductions",
            description="Introduce yourself and ask 'How are you?'",
            order_index=3,
            required_skill_id=2,
        )
        db.add_all([skill1, skill2, skill3])
        db.commit()

        # --- Unit 2: Food & Drinks ---
        unit2 = Unit(
            id=2,
            course_id=course.id,
            title="Unit 2: Food and Drinks",
            description="Learn names for tea, water, food, and dining out in Hindi",
            order_index=2,
        )
        db.add(unit2)
        db.commit()

        skill4 = Skill(
            id=4,
            unit_id=unit2.id,
            title="Food",
            description="Common dishes, roti, and meals",
            order_index=1,
            required_skill_id=3,
        )
        skill5 = Skill(
            id=5,
            unit_id=unit2.id,
            title="Drinks",
            description="Chai, paani, and beverages",
            order_index=2,
            required_skill_id=4,
        )
        skill6 = Skill(
            id=6,
            unit_id=unit2.id,
            title="Ordering Food",
            description="Dhaba and restaurant expressions",
            order_index=3,
            required_skill_id=5,
        )
        db.add_all([skill4, skill5, skill6])
        db.commit()

        # --- Unit 3: Everyday Conversations ---
        unit3 = Unit(
            id=3,
            course_id=course.id,
            title="Unit 3: Everyday Conversations",
            description="Talk about family members, daily routine, and casual chat",
            order_index=3,
        )
        db.add(unit3)
        db.commit()

        skill7 = Skill(
            id=7,
            unit_id=unit3.id,
            title="Daily Life",
            description="Routines, work, and hobbies",
            order_index=1,
            required_skill_id=6,
        )
        skill8 = Skill(
            id=8,
            unit_id=unit3.id,
            title="Family",
            description="Parivaar, Mata, Pita, and siblings",
            order_index=2,
            required_skill_id=7,
        )
        skill9 = Skill(
            id=9,
            unit_id=unit3.id,
            title="Simple Conversations",
            description="Small talk and expressing feelings",
            order_index=3,
            required_skill_id=8,
        )
        db.add_all([skill7, skill8, skill9])
        db.commit()

        print("Seeding Hindi Lessons & Exercises...")

        # --- Lessons for Skill 1 (Greetings) ---
        lesson1 = Lesson(
            id=1,
            skill_id=skill1.id,
            title="Essential Greetings",
            order_index=1,
            xp_reward=15,
        )
        lesson2 = Lesson(
            id=2,
            skill_id=skill1.id,
            title="Saying Goodbye & Politeness",
            order_index=2,
            xp_reward=15,
        )
        db.add_all([lesson1, lesson2])
        db.commit()

        # Exercises for Lesson 1 (Essential Greetings)
        ex1_1 = Exercise(
            id=1,
            lesson_id=lesson1.id,
            type="multiple_choice",
            prompt='What does "Namaste" mean?',
            correct_answer="Hello",
            explanation='"Namaste" is the traditional and respectful Hindi greeting for "Hello".',
            options=json.dumps(["Hello", "Goodbye", "Thank you", "Please"]),
            order_index=1,
        )
        ex1_2 = Exercise(
            id=2,
            lesson_id=lesson1.id,
            type="translate",
            prompt='Translate "Thank you"',
            correct_answer="Dhanyavaad",
            explanation='"Dhanyavaad" is Hindi for "Thank you".',
            options=json.dumps(["Dhanyavaad", "Namaste", "Aap", "Haan", "Shukriya", "Nahin"]),
            order_index=2,
        )
        ex1_3 = Exercise(
            id=3,
            lesson_id=lesson1.id,
            type="fill_blank",
            prompt="Aap ___ kaise hain?",
            correct_answer="sab",
            explanation='"Aap sab kaise hain?" translates to "How are you all?".',
            options=json.dumps(["sab", "nahin", "kya", "haan"]),
            order_index=3,
        )
        ex1_4 = Exercise(
            id=4,
            lesson_id=lesson1.id,
            type="match_pairs",
            prompt="Match the Hindi words with their English translations",
            correct_answer=json.dumps({
                "Hello": "Namaste",
                "Thank you": "Dhanyavaad",
                "Goodbye": "Alvida",
                "Please": "Kripya"
            }),
            explanation="Excellent job matching all Hindi greetings!",
            options=json.dumps({
                "Hello": "Namaste",
                "Thank you": "Dhanyavaad",
                "Goodbye": "Alvida",
                "Please": "Kripya"
            }),
            order_index=4,
        )
        ex1_5 = Exercise(
            id=5,
            lesson_id=lesson1.id,
            type="type_answer",
            prompt='Translate "Hello"',
            correct_answer="Namaste",
            explanation='"Namaste" is the standard Hindi greeting.',
            options=None,
            order_index=5,
        )
        ex1_6 = Exercise(
            id=6,
            lesson_id=lesson1.id,
            type="translate",
            prompt='Translate "See you again"',
            correct_answer="Phir milege",
            explanation='"Phir milege" translates directly to "See you again".',
            options=json.dumps(["Phir", "milege", "Namaste", "Dhanyavaad", "Haan"]),
            order_index=6,
        )
        db.add_all([ex1_1, ex1_2, ex1_3, ex1_4, ex1_5, ex1_6])
        db.commit()

        # Exercises for Lesson 2 (Saying Goodbye & Politeness)
        ex2_1 = Exercise(
            id=7,
            lesson_id=lesson2.id,
            type="multiple_choice",
            prompt='What does "Alvida" mean?',
            correct_answer="Goodbye",
            explanation='"Alvida" means "Goodbye" in Hindi.',
            options=json.dumps(["Hello", "Goodbye", "Thank you", "Sorry"]),
            order_index=1,
        )
        ex2_2 = Exercise(
            id=8,
            lesson_id=lesson2.id,
            type="translate",
            prompt='Translate "Excuse me / Sorry"',
            correct_answer="Kshama karein",
            explanation='"Kshama karein" translates to "Excuse me" or "Forgive me".',
            options=json.dumps(["Kshama", "karein", "Namaste", "Dhanyavaad", "Haan"]),
            order_index=2,
        )
        ex2_3 = Exercise(
            id=9,
            lesson_id=lesson2.id,
            type="type_answer",
            prompt='Translate "Yes"',
            correct_answer="Haan",
            explanation='"Haan" means "Yes" in Hindi.',
            options=None,
            order_index=3,
        )
        db.add_all([ex2_1, ex2_2, ex2_3])
        db.commit()

        # --- Exercises for Skill 2 (Basic Words) ---
        lesson3 = Lesson(
            id=3,
            skill_id=skill2.id,
            title="Common Expressions",
            order_index=1,
            xp_reward=15,
        )
        db.add(lesson3)
        db.commit()

        ex3_1 = Exercise(
            id=10,
            lesson_id=lesson3.id,
            type="multiple_choice",
            prompt='What does "Nahin" mean?',
            correct_answer="No",
            explanation='"Nahin" means "No" in Hindi.',
            options=json.dumps(["Yes", "No", "Maybe", "Thanks"]),
            order_index=1,
        )
        ex3_2 = Exercise(
            id=11,
            lesson_id=lesson3.id,
            type="fill_blank",
            prompt="Main ___ hoon.",
            correct_answer="thik",
            explanation='"Main thik hoon" means "I am fine".',
            options=json.dumps(["thik", "nahin", "kya", "kaun"]),
            order_index=2,
        )
        db.add_all([ex3_1, ex3_2])
        db.commit()

        # Seed Remaining Lessons for Skills 3..9 so every skill has functional lessons
        skills_to_seed = [skill3, skill4, skill5, skill6, skill7, skill8, skill9]
        lesson_id_counter = 4
        exercise_id_counter = 12

        for s in skills_to_seed:
            l = Lesson(
                id=lesson_id_counter,
                skill_id=s.id,
                title=f"{s.title} Practice",
                order_index=1,
                xp_reward=15,
            )
            db.add(l)
            db.commit()

            e1 = Exercise(
                id=exercise_id_counter,
                lesson_id=l.id,
                type="multiple_choice",
                prompt=f"Practice exercise for {s.title}",
                correct_answer="Sahi Jawab",
                explanation=f"Explanation for {s.title} concept.",
                options=json.dumps(["Sahi Jawab", "Option B", "Option C", "Option D"]),
                order_index=1,
            )
            exercise_id_counter += 1

            e2 = Exercise(
                id=exercise_id_counter,
                lesson_id=l.id,
                type="type_answer",
                prompt=f'Translate the key word for {s.title}',
                correct_answer="Namaste",
                explanation="Great job completing the exercise!",
                options=None,
                order_index=2,
            )
            exercise_id_counter += 1

            db.add_all([e1, e2])
            db.commit()
            lesson_id_counter += 1

        print("Database successfully seeded with realistic Hindi learning data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
