export interface Student {
  id: number;
  name: string;
  username: string;
  avg_band: number;
  streak_days: number;
  submissions_count: number;
  last_active: string;
}

export interface StudentHistoryPoint {
  date: string;
  task_type: 'task1' | 'task2';
  band: number;
}

export interface CriteriaScores {
  tr_ta: number; // Task Response (Task 2) / Task Achievement (Task 1)
  cc: number;    // Coherence & Cohesion
  lr: number;    // Lexical Resource
  gra: number;   // Grammatical Range & Accuracy
}

export interface SubmissionDetail {
  id: number;
  student_id: number;
  task_type: 'task1' | 'task2';
  topic: string;
  essay: string;
  band_score: number;
  criteria_scores: CriteriaScores;
  recommendations: string[];
  feedback: string;
  created_at: string;
}
