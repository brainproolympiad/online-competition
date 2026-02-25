// src/types/cbtTypes.ts
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// In the interfaces section, update QuizInfo:
interface QuizInfo {
  id: string;
  title: string;
  subject: string;
  instructions: string;
  link: string;
  duration: number;
  total_questions: number;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'completed';
  target_classes?: string[];
  class_level?: string; // Add this for exams table compatibility
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options: Record<string, string>;
  correct_answer: string;
  marks: number;
  question_order: number;
  created_at: string;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  participant_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: 'in_progress' | 'submitted' | 'timed_out';
  time_spent: number;
  cheat_attempts: number;
  created_at: string;
}

export interface ExamResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  marks_obtained: number;
  answered_at: string;
}

export interface ProctoringEvent {
  event_type: 'face_not_detected' | 'multiple_faces' | 'looking_away' | 'audio_detected';
  screenshot_data?: string;
  audio_level?: number;
  timestamp: string;
}