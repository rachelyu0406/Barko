import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LessonViewer } from './LessonViewer';
import { Quiz } from './Quiz';
import { News } from './News';
import {
  Award,
  Flame,
  BookOpen,
  Settings,
  LogOut,
  Lock,
  CheckCircle,
  ChevronRight,
  Loader,
  Moon,
  Newspaper,
  GraduationCap,
} from 'lucide-react';

type LearningPlan = {
  lessons: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: number;
    estimatedMinutes: number;
    why: string;
    quiz?: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }>;
  personalizedMessage: string;
  estimatedCompletionWeeks: number;
};

export function Dashboard() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'lessons' | 'news'>('lessons');

  useEffect(() => {
    if (profile?.learning_plan && Array.isArray(profile.learning_plan) && profile.learning_plan.length > 0) {
      setLearningPlan(profile.learning_plan[0]);
    }
  }, [profile]);

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (data) {
      setCompletedLessons(new Set(data.map(p => p.lesson_id)));
    }
  };

  const handleLessonComplete = async () => {
    if (!selectedLesson || !user) return;

    try {
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', selectedLesson.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_lesson_progress')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: selectedLesson.id,
            completed: true,
            completed_at: new Date().toISOString(),
          });
      }

      setCompletedLessons(new Set([...completedLessons, selectedLesson.id]));

      const newPoints = (profile?.points || 0) + 10;
      await updateProfile({ points: newPoints });

      setSelectedLesson(null);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const handleQuizComplete = async (score: number) => {
    if (!selectedLesson || !user) return;

    try {
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id, attempts')
        .eq('user_id', user.id)
        .eq('lesson_id', selectedLesson.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_lesson_progress')
          .update({
            score,
            attempts: (existing.attempts || 0) + 1,
            completed: score >= 70,
            completed_at: score >= 70 ? new Date().toISOString() : null,
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: selectedLesson.id,
            score,
            attempts: 1,
            completed: score >= 70,
            completed_at: score >= 70 ? new Date().toISOString() : null,
          });
      }

      if (score >= 70) {
        setCompletedLessons(new Set([...completedLessons, selectedLesson.id]));
        const newPoints = (profile?.points || 0) + 20;
        await updateProfile({ points: newPoints });
      }

      setShowQuiz(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const toggleSimpleMode = async () => {
    if (!profile) return;
    await updateProfile({ simple_mode: !profile.simple_mode });
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#132a4a] rounded-xl shadow-xl p-6 md:p-8 border border-blue-800/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-blue-300 hover:text-emerald-400 transition-colors"
              >
                Back
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#0a1f3d] rounded-lg border border-blue-700/50">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-blue-300" />
                  <div>
                    <div className="text-white font-medium">Simple Mode</div>
                    <div className="text-sm text-blue-300">Simplified interface for easier navigation</div>
                  </div>
                </div>
                <button
                  onClick={toggleSimpleMode}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    profile?.simple_mode ? 'bg-emerald-500' : 'bg-blue-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      profile?.simple_mode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-[#0a1f3d] rounded-lg border border-blue-700/50">
                <div className="text-white font-medium mb-2">Account Information</div>
                <div className="text-sm text-blue-300 space-y-1">
                  <div>Email: {profile?.email}</div>
                  <div>Member since: {new Date(profile?.created_at || '').toLocaleDateString()}</div>
                </div>
              </div>

              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-400 py-3 px-6 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200 border border-red-500/50"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Quiz
            lessonId={selectedLesson.id}
            lessonTitle={selectedLesson.title}
            questions={selectedLesson.quiz || []}
            onComplete={handleQuizComplete}
            onBack={() => setShowQuiz(false)}
          />
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-4 text-blue-300 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          <LessonViewer
            lesson={selectedLesson}
            onComplete={handleLessonComplete}
            onStartQuiz={() => setShowQuiz(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img src="/BarkoLogo.png" alt="Barko Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <h1 className="text-3xl font-bold text-white">Barko</h1>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg bg-[#132a4a] text-blue-300 hover:text-emerald-400 transition-colors border border-blue-800/30"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#132a4a] rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-blue-200 text-sm font-medium">Points</span>
            </div>
            <div className="text-3xl font-bold text-white">{profile?.points || 0}</div>
          </div>

          <div className="bg-[#132a4a] rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-blue-200 text-sm font-medium">Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">{profile?.streak_days || 0} days</div>
          </div>

          <div className="bg-[#132a4a] rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span className="text-blue-200 text-sm font-medium">Completed</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {completedLessons.size}/{learningPlan?.lessons.length || 0}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'lessons'
                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500'
                : 'bg-[#132a4a] text-blue-300 border-2 border-blue-800/30 hover:border-emerald-500/50'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            My Lessons
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'news'
                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500'
                : 'bg-[#132a4a] text-blue-300 border-2 border-blue-800/30 hover:border-emerald-500/50'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            Financial News
          </button>
        </div>

        {activeTab === 'news' ? (
          <News country={(profile as any)?.country || 'United States'} />
        ) : (
          <>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
            )}

            {learningPlan && (
              <>
                <div className="bg-[#132a4a] rounded-xl p-6 mb-8 border border-blue-800/30">
                  <h2 className="text-xl font-bold text-white mb-2">Your Personalized Learning Path</h2>
                  <p className="text-blue-200 mb-4">{learningPlan.personalizedMessage}</p>
                  <div className="flex items-center gap-4 text-sm text-blue-300">
                    <span>Estimated completion: {learningPlan.estimatedCompletionWeeks} weeks</span>
                    <span>•</span>
                    <span>{learningPlan.lessons.length} lessons</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {learningPlan.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isLocked = index > 0 && !completedLessons.has(learningPlan.lessons[index - 1].id);

                    return (
                      <div
                        key={lesson.id}
                        className={`bg-[#132a4a] rounded-xl p-6 border border-blue-800/30 transition-all duration-200 ${
                          isLocked ? 'opacity-60' : 'hover:border-emerald-500/50 cursor-pointer'
                        }`}
                        onClick={() => !isLocked && setSelectedLesson(lesson)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-emerald-500/20' : isLocked ? 'bg-blue-900/50' : 'bg-blue-700/50'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-emerald-400" />
                            ) : isLocked ? (
                              <Lock className="w-6 h-6 text-blue-400" />
                            ) : (
                              <span className="text-white font-bold">{index + 1}</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white mb-1">{lesson.title}</h3>
                                <p className="text-blue-200 text-sm mb-2">{lesson.description}</p>
                              </div>
                              {!isLocked && !isCompleted && (
                                <ChevronRight className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-4" />
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-blue-300 bg-blue-900/50 px-2 py-1 rounded">
                                {lesson.category}
                              </span>
                              <span className="text-xs text-blue-400">
                                {lesson.estimatedMinutes} min
                              </span>
                              <span className="text-xs text-blue-400">
                                Level {lesson.difficulty}
                              </span>
                            </div>

                            {!profile?.simple_mode && (
                              <p className="text-sm text-blue-300 italic">{lesson.why}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}