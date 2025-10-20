/*
  # Financial Literacy App Database Schema

  ## Overview
  Creates the complete database structure for a Duolingo-style financial literacy learning platform
  with personalized learning plans, quizzes, and progress tracking.

  ## New Tables
  
  ### 1. `users`
  User profiles with financial context for personalized learning
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `income_range` (text) - Low, Medium, High, or specific range
  - `financial_goals` (text) - User's stated financial objectives
  - `learning_plan` (jsonb) - LLM-generated personalized curriculum
  - `current_level` (integer) - User's progress level
  - `points` (integer) - Gamification score
  - `streak_days` (integer) - Consecutive days of learning
  - `last_active` (timestamptz) - Last activity timestamp
  - `simple_mode` (boolean) - Accessibility setting
  - `created_at` (timestamptz) - Account creation time

  ### 2. `lessons`
  Financial literacy lesson content
  - `id` (uuid, primary key)
  - `title` (text) - Lesson name
  - `description` (text) - Lesson overview
  - `content` (text) - Full lesson text
  - `difficulty_level` (integer) - 1-10 difficulty rating
  - `category` (text) - Budgeting, Investing, Saving, etc.
  - `order_index` (integer) - Sequence in curriculum
  - `estimated_minutes` (integer) - Time to complete
  - `created_at` (timestamptz)

  ### 3. `user_lesson_progress`
  Tracks user completion and performance
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `lesson_id` (uuid, foreign key) - References lessons
  - `completed` (boolean) - Completion status
  - `score` (integer) - Quiz score percentage
  - `attempts` (integer) - Number of attempts
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. `quiz_questions`
  Quiz questions for lessons
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, foreign key) - References lessons
  - `question_text` (text) - The question
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (text) - The correct option
  - `explanation` (text) - Why it's correct
  - `difficulty` (integer) - Question difficulty 1-10
  - `created_at` (timestamptz)

  ### 5. `user_quiz_attempts`
  Records of quiz attempts
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `lesson_id` (uuid, foreign key) - References lessons
  - `question_id` (uuid, foreign key) - References quiz_questions
  - `user_answer` (text) - User's selected answer
  - `correct` (boolean) - Whether answer was correct
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access and modify their own data
  - Lessons and quiz questions are readable by all authenticated users
  - Admin policies can be added later for content management
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  income_range text DEFAULT 'not_specified',
  financial_goals text DEFAULT '',
  learning_plan jsonb DEFAULT '[]'::jsonb,
  current_level integer DEFAULT 1,
  points integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  simple_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  content text NOT NULL,
  difficulty_level integer DEFAULT 1,
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  estimated_minutes integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- User lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  attempts integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text DEFAULT '',
  difficulty integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- User quiz attempts table
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_answer text NOT NULL,
  correct boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON lessons(difficulty_level);
