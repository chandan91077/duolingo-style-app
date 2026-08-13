import {
  Learner,
  Course,
  Lesson,
  AnswerResponse,
  LessonCompleteResponse,
  LeaderboardEntry,
  ProfileData,
  RawLearnerResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getActiveUserId(): number | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("duo-user-id");
  return stored ? parseInt(stored, 10) : null;
}

function getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...customHeaders };
  const userId = getActiveUserId();
  if (userId) {
    headers["X-User-Id"] = userId.toString();
  }
  return headers;
}

function transformLearner(raw: RawLearnerResponse): Learner {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
    totalXp: raw.total_xp,
    streak: raw.streak,
    hearts: raw.hearts,
    gems: raw.gems,
    dailyXpGoal: raw.daily_xp_goal,
    todayXp: raw.today_xp,
  };
}

export async function syncUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<Learner> {
  const res = await fetch(`${API_BASE_URL}/api/auth/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email || `${firebaseUser.uid}@guest.duolingo.app`,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Learner",
      avatar: firebaseUser.photoURL || "🚀",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to sync user with backend");
  }

  const raw: RawLearnerResponse = await res.json();
  const learner = transformLearner(raw);
  if (typeof window !== "undefined") {
    localStorage.setItem("duo-user-id", learner.id.toString());
  }
  return learner;
}

export async function getLearner(): Promise<Learner> {
  const res = await fetch(`${API_BASE_URL}/api/learner`, {
    cache: "no-store",
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch learner details");
  }
  const raw: RawLearnerResponse = await res.json();
  return transformLearner(raw);
}

export async function refillHearts(): Promise<Learner> {
  const res = await fetch(`${API_BASE_URL}/api/learner/refill-hearts`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    throw new Error("Failed to refill hearts");
  }
  const raw: RawLearnerResponse = await res.json();
  return transformLearner(raw);
}

export async function getCourse(): Promise<Course> {
  const res = await fetch(`${API_BASE_URL}/api/course`, {
    cache: "no-store",
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch course path");
  }
  return res.json();
}

export async function getLesson(lessonId: number): Promise<Lesson> {
  const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}`, {
    cache: "no-store",
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch lesson #${lessonId}`);
  }
  return res.json();
}

export async function submitAnswer(
  lessonId: number,
  exerciseId: number,
  answer: any
): Promise<AnswerResponse> {
  const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/answer`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ exercise_id: exerciseId, answer }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to submit exercise answer");
  }

  return res.json();
}

export async function completeLesson(
  lessonId: number
): Promise<LessonCompleteResponse> {
  const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/complete`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
  });

  if (!res.ok) {
    throw new Error("Failed to complete lesson");
  }

  return res.json();
}

export async function getLeaderboard(userId?: number): Promise<LeaderboardEntry[]> {
  const customHeaders: Record<string, string> = {};
  if (userId) {
    customHeaders["X-User-Id"] = userId.toString();
  }
  const res = await fetch(`${API_BASE_URL}/api/leaderboard`, {
    cache: "no-store",
    headers: getHeaders(customHeaders),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return res.json();
}

export async function getProfile(): Promise<ProfileData> {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    cache: "no-store",
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch learner profile");
  }
  return res.json();
}
