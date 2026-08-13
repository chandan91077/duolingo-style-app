export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface Learner {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  totalXp: number;
  streak: number;
  hearts: number;
  gems: number;
  dailyXpGoal: number;
  todayXp: number;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  type: ExerciseType;
  prompt: string;
  explanation?: string;
  options?: any;
  order_index: number;
}

export interface LessonSummary {
  id: number;
  skill_id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  is_completed: boolean;
}

export interface Lesson {
  id: number;
  skill_id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  exercises: Exercise[];
  is_completed: boolean;
}

export interface Skill {
  id: number;
  unit_id: number;
  title: string;
  description?: string;
  order_index: number;
  required_skill_id?: number;
  is_locked: boolean;
  is_completed: boolean;
  progress: number;
  total_lessons: number;
  completed_lessons: number;
  lessons: LessonSummary[];
}

export interface Unit {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order_index: number;
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  source_language: string;
  target_language: string;
  description?: string;
  units: Unit[];
}

export interface AnswerResponse {
  correct: boolean;
  correct_answer: string;
  explanation?: string;
  hearts: number;
  xp_earned: number;
}

export interface RawLearnerResponse {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  total_xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_xp_goal: number;
  today_xp: number;
}

export interface LessonCompleteResponse {
  success: boolean;
  xp_earned: number;
  hearts: number;
  streak: number;
  total_xp: number;
  skill_completed: boolean;
  next_skill_unlocked: boolean;
  learner: RawLearnerResponse;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  avatar?: string;
  total_xp: number;
  streak: number;
  rank: number;
  is_current_user: boolean;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  earned: boolean;
  earned_at?: string;
}

export interface ProfileData {
  learner: RawLearnerResponse;
  completed_skills: number;
  completed_lessons: number;
  achievements: Achievement[];
  today_xp: number;
  daily_goal_percentage: number;
}
