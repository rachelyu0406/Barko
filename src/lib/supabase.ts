import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  income_range: string;
  financial_goals: string;
  learning_plan: any[];
  current_level: number;
  points: number;
  streak_days: number;
  last_active: string;
  simple_mode: boolean;
  created_at: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty_level: number;
  category: string;
  order_index: number;
  estimated_minutes: number;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: number;
  created_at: string;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  attempts: number;
  completed_at?: string;
  created_at: string;
};
