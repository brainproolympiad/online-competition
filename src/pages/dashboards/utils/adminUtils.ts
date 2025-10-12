// src/pages/dashboards/utils/adminUtils.ts

export const LOCAL_STORAGE_KEYS = {
  ADMIN_SETTINGS: "admin_dashboard_settings",
  PARTICIPANTS_CACHE: "participants_cache",
  LAST_FETCH_TIME: "last_fetch_time",
};

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// In your adminTypes.ts
export interface QuizAttempt {
  id: string;
  participant_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: 'in_progress' | 'submitted' | 'abandoned';
  cheat_attempts: number;
  time_spent: number;
  submitted_at: string | null;
  created_at: string;
  quizzes?: {
    title: string;
    description: string;
    subject: string;
  };
  registrations?: {
    fullName: string;
    email: string;
    classLevel: string;
    phone: string;
  };
  photo_data?: string[]; // Array of image URLs
}

export const normalizeCourses = (courses: any): string[] => {
  if (!courses) return [];
  if (Array.isArray(courses)) return courses.map(String);
  if (typeof courses === "string") {
    try {
      const parsed = JSON.parse(courses);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return courses.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [String(courses)];
};

export type ScoresMap = { [key: string]: number };

export const normalizeScores = (scores: any): ScoresMap | null => {
  if (!scores) return null;
  if (typeof scores === "object" && !Array.isArray(scores)) {
    const map: ScoresMap = {};
    Object.keys(scores).forEach((k) => {
      const v = parseInt(scores[k], 10);
      map[k] = isNaN(v) ? 0 : v;
    });
    return map;
  }
  if (typeof scores === "string") {
    try {
      const parsed = JSON.parse(scores);
      if (typeof parsed === "object" && !Array.isArray(parsed)) return normalizeScores(parsed);
    } catch {}
    const map: ScoresMap = {};
    scores.split(",").forEach((part: string) => {
      const [k, v] = part.split(":").map((s) => s?.trim());
      if (k) map[k] = v ? parseInt(v, 10) || 0 : 0;
    });
    return Object.keys(map).length ? map : null;
  }
  return null;
};

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
