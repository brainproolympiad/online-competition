// // src/types/adminTypes.ts
// export interface QuizInfo {
//   id: string;
//   title: string;
//   subject: string;
//   instructions: string;
//   link: string;
//   duration: number;
//   total_questions: number;
//   start_time: string;
//   end_time: string;
//   status: 'upcoming' | 'active' | 'completed';
//   target_classes?: string[];
//   class_level?: string;
//   created_at?: string;
// }

// export interface QuizAttempt {
//   id: string;
//   quiz_id: string;
//   participant_id: string;
//   score: number;
//   total_questions: number;
//   correct_answers: number;
//   status: string;
//   cheat_attempts: number;
//   time_spent: number;
//   submitted_at: string;
//   created_at: string;
//   quizzes?: {
//     title: string;
//     description: string;
//   };
//   registrations?: {
//     fullName: string;
//     email: string;
//     classLevel: string;
//     phone?: string;
//   };
// }

// export interface Participant {
//   id: string;
//   fullName: string;
//   email: string;
//   classLevel: string;
//   courses: string[];
//   quizLink: string | null;
//   scores: Record<string, any>;
//   paid: boolean;
//   amountPaid: number;
//   createdAt: string;
//   avatarUrl?: string;
//   totalScore: number;
//   averageScore: number;
  
//   // Quiz attempts data
//   quizAttempts?: QuizAttempt[];
  
//   // Individual subject scores for table
//   subject1Score: number;
//   subject2Score: number;
//   subject3Score: number;
//   subject4Score: number;
  
//   // Additional fields from registrations table
//   phone?: string;
//   gender?: string;
//   state?: string;
//   lga?: string;
//   address?: string;
//   schoolName?: string;
//   schoolType?: string;
//   term?: string;
//   username?: string;
//   dob?: string;
//   favoriteSubject?: string;
  
//   // Optional subject names
//   subject1?: string;
//   subject2?: string;
//   subject3?: string;
//   subject4?: string;
// }

// export interface ParticipantRaw {
//   id: string;
//   fullName: string;
//   email: string;
//   classLevel?: string;
//   class_level?: string;
//   category?: string;
//   courses: string[] | any;
//   quiz_link?: string;
//   quizLink?: string;
//   scores: any;
//   paid: boolean;
//   amount_paid?: number;
//   amountPaid?: number;
//   created_at: string;
//   avatar_url?: string;
  
//   // Additional registration fields
//   phone?: string;
//   gender?: string;
//   state?: string;
//   lga?: string;
//   address?: string;
//   schoolName?: string;
//   schoolType?: string;
//   term?: string;
//   username?: string;
//   dob?: string;
//   favoriteSubject?: string;
//   email_address?: string;
// }

// export interface Filters {
//   search: string;
//   classLevel: string;
//   course: string;
//   paymentStatus: string;
//   hasQuizLink: string;
// }

// export interface DebugInfo {
//   action: string;
//   timestamp: string;
//   participantId?: string;
//   data?: any;
//   error?: string;
// }

// export interface Resource {
//   id: string;
//   title: string;
//   description: string;
//   link: string;
//   type: 'document' | 'video' | 'quiz' | 'assignment';
//   created_at: string;
// }

// export interface Announcement {
//   id: string;
//   title: string;
//   message: string;
//   priority: 'low' | 'medium' | 'high';
//   created_at: string;
// }

// export interface Statistics {
//   total: number;
//   paid: number;
//   withQuizLinks: number;
//   withScores: number;
//   averageTotalScore: number;
//   paymentRate: number;
//   totalQuizzes: number;
//   totalResources: number;
//   totalAnnouncements: number;
//   submittedQuizzes: number;
//   averageQuizScore: number;
// }

// // Export all types for use in other files
// export type {
//   Participant,
//   ParticipantRaw,
//   QuizInfo,
//   QuizAttempt,
//   Filters,
//   DebugInfo,
//   Resource,
//   Announcement,
//   Statistics
// };


// src/types/adminTypes.ts
export interface QuizAttempt {
  id: string;
  quiz_id: string;
  participant_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: string;
  cheat_attempts: number;
  time_spent: number;
  submitted_at: string;
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
    phone?: string;
  };
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  classLevel: string;
  courses: string[];
  quizLink: string | null;
  scores: Record<string, any>;
  paid: boolean;
  amountPaid: number;
  createdAt: string;
  avatarUrl?: string;
  totalScore: number;
  averageScore: number;
  // Individual subject scores calculated from quiz attempts
  // Quiz attempts data
  quizAttempts?: QuizAttempt[];
  
  // Individual subject scores calculated from quiz attempts
  subjectScores: {
    [subject: string]: {
      score: number;
      totalQuestions: number;
      percentage: number;
      attempts: number;
    }
  };
  
  // Additional fields from registrations table
  phone?: string;
  gender?: string;
  state?: string;
  lga?: string;
  address?: string;
  schoolName?: string;
  schoolType?: string;
  term?: string;
  username?: string;
  dob?: string;
  favoriteSubject?: string;
}