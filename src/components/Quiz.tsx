import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuizProps = {
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onBack: () => void;
};

export function Quiz({ lessonId, lessonTitle, questions, onComplete, onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Fallback to default questions if none provided
  const quizQuestions = questions.length > 0 ? questions : getDefaultQuizQuestions(lessonId);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  const handleFinish = () => {
    const score = Math.round((answers.filter(a => a).length / answers.length) * 100);
    onComplete(score);
  };

  if (quizComplete) {
    const score = Math.round((answers.filter(a => a).length / answers.length) * 100);
    const passed = score >= 70;

    return (
      <div className="bg-[#132a4a] rounded-xl shadow-xl p-6 md:p-8 border border-blue-800/30">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
          }`}>
            {passed ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <RotateCcw className="w-12 h-12 text-yellow-400" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-blue-200 mb-6">
            You scored {score}% on this quiz
          </p>

          <div className="bg-[#0a1f3d] rounded-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {answers.filter(a => a).length}
                </div>
                <div className="text-sm text-blue-300">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {answers.filter(a => !a).length}
                </div>
                <div className="text-sm text-blue-300">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {score}%
                </div>
                <div className="text-sm text-blue-300">Score</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0a1f3d] text-blue-100 py-3 px-6 rounded-lg font-semibold hover:bg-[#0d2440] transition-all duration-200 border border-blue-700/50"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/30"
            >
              Continue Learning
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-[#132a4a] rounded-xl shadow-xl p-6 md:p-8 border border-blue-800/30">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-emerald-400">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <button
            onClick={onBack}
            className="text-sm text-blue-300 hover:text-emerald-400 transition-colors"
          >
            Back to Lesson
          </button>
        </div>

        <div className="w-full bg-[#0a1f3d] rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.correctAnswer;

          let buttonClass = 'w-full p-4 rounded-lg text-left transition-all duration-200 border-2 ';

          if (showExplanation) {
            if (isCorrectAnswer) {
              buttonClass += 'bg-emerald-500/20 border-emerald-500 text-white';
            } else if (isSelected && !isCorrect) {
              buttonClass += 'bg-red-500/20 border-red-500 text-white';
            } else {
              buttonClass += 'bg-[#0a1f3d] border-blue-700/30 text-blue-200 opacity-60';
            }
          } else {
            if (isSelected) {
              buttonClass += 'bg-emerald-500/20 border-emerald-500 text-white';
            } else {
              buttonClass += 'bg-[#0a1f3d] border-blue-700/50 text-blue-100 hover:border-emerald-500/50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showExplanation}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showExplanation && isCorrectAnswer && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                {showExplanation && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`p-4 rounded-lg mb-6 border-2 ${
          isCorrect
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100'
            : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-100'
        }`}>
          <p className="font-semibold mb-2">
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </p>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}

      {!showExplanation ? (
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNextQuestion}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/30"
        >
          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Fallback default questions (keep your existing function)
function getDefaultQuizQuestions(lessonId: string): QuizQuestion[] {
  const quizData: Record<string, QuizQuestion[]> = {
    '1': [
      {
        id: '1-1',
        question: 'What is the difference between gross and net income?',
        options: [
          'Gross is after taxes, net is before taxes',
          'Gross is before taxes and deductions, net is what you actually receive',
          'They are the same thing',
          'Gross includes investments, net does not'
        ],
        correctAnswer: 'Gross is before taxes and deductions, net is what you actually receive',
        explanation: 'Gross income is your total earnings before any taxes or deductions, while net income is what actually hits your bank account after all deductions.'
      },
      {
        id: '1-2',
        question: 'Which of the following is NOT typically considered a source of income?',
        options: [
          'Side hustle earnings',
          'Investment dividends',
          'Credit card rewards',
          'Passive rental income'
        ],
        correctAnswer: 'Credit card rewards',
        explanation: 'While credit card rewards provide value, they are not considered income. Income comes from work, investments, or business activities.'
      },
      {
        id: '1-3',
        question: 'Why should you budget based on net income instead of gross income?',
        options: [
          'Net income is easier to calculate',
          'Gross income changes too frequently',
          'Net income represents what you actually have available to spend',
          'Employers prefer you to use net income'
        ],
        correctAnswer: 'Net income represents what you actually have available to spend',
        explanation: 'Budgeting based on net income ensures you are only planning to spend money you actually receive after taxes and deductions.'
      }
    ],
    // Add more default questions for other lessons...
  };

  return quizData[lessonId] || [];
}