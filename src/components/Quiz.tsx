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
  onComplete: (score: number) => void;
  onBack: () => void;
};

export function Quiz({ lessonId, onComplete, onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = getQuizQuestions(lessonId);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-[#132a4a] rounded-xl shadow-xl p-6 md:p-8 border border-blue-800/30">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-emerald-400">
            Question {currentQuestion + 1} of {questions.length}
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
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
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
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function getQuizQuestions(lessonId: string): QuizQuestion[] {
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
    '2': [
      {
        id: '2-1',
        question: 'How much should a typical emergency fund cover?',
        options: [
          '1-2 months of expenses',
          '3-6 months of expenses',
          '12-18 months of expenses',
          '2-3 years of expenses'
        ],
        correctAnswer: '3-6 months of expenses',
        explanation: 'Financial experts recommend 3-6 months of living expenses for most people, though those with less stable income may want 6-9 months.'
      },
      {
        id: '2-2',
        question: 'Where is the best place to keep an emergency fund?',
        options: [
          'In stocks for higher returns',
          'In your checking account with your daily spending money',
          'In a high-yield savings account',
          'In a retirement account'
        ],
        correctAnswer: 'In a high-yield savings account',
        explanation: 'A high-yield savings account provides easy access to your money while earning interest, without the risks or penalties of other options.'
      },
      {
        id: '2-3',
        question: 'Which of these is a TRUE emergency that warrants using your emergency fund?',
        options: [
          'A great sale on a new TV',
          'A vacation opportunity',
          'Unexpected medical expenses',
          'Holiday gift shopping'
        ],
        correctAnswer: 'Unexpected medical expenses',
        explanation: 'Emergency funds are for true emergencies like medical expenses, job loss, or urgent repairs - not planned expenses or wants.'
      }
    ],
    '3': [
      {
        id: '3-1',
        question: 'In the 50/30/20 budget rule, what does the 50% represent?',
        options: [
          'Savings and investments',
          'Wants and entertainment',
          'Needs and essential expenses',
          'Debt repayment'
        ],
        correctAnswer: 'Needs and essential expenses',
        explanation: 'The 50% is allocated to needs - essential expenses like housing, utilities, groceries, and transportation.'
      },
      {
        id: '3-2',
        question: 'Which of the following is considered a "want" rather than a "need"?',
        options: [
          'Rent or mortgage payment',
          'Grocery shopping',
          'Streaming service subscriptions',
          'Car insurance'
        ],
        correctAnswer: 'Streaming service subscriptions',
        explanation: 'Streaming services are entertainment and therefore wants. The other options are essential needs for daily living and legal requirements.'
      },
      {
        id: '3-3',
        question: 'According to the 50/30/20 rule, how much should go toward savings and debt repayment?',
        options: [
          '10%',
          '20%',
          '30%',
          '50%'
        ],
        correctAnswer: '20%',
        explanation: 'The 20% portion is dedicated to savings, investments, and paying down debt beyond minimum payments.'
      }
    ],
    '4': [
      {
        id: '4-1',
        question: 'What is considered an excellent credit score?',
        options: [
          '600-649',
          '650-699',
          '700-749',
          '750+'
        ],
        correctAnswer: '750+',
        explanation: 'A score of 750 or higher is considered excellent and will qualify you for the best interest rates and loan terms.'
      },
      {
        id: '4-2',
        question: 'What factor has the biggest impact on your credit score?',
        options: [
          'Types of credit used',
          'Length of credit history',
          'Payment history',
          'New credit inquiries'
        ],
        correctAnswer: 'Payment history',
        explanation: 'Payment history accounts for 35% of your credit score, making it the most important factor. Always pay bills on time.'
      },
      {
        id: '4-3',
        question: 'What should you keep your credit utilization below for optimal credit health?',
        options: [
          '10%',
          '30%',
          '50%',
          '75%'
        ],
        correctAnswer: '30%',
        explanation: 'Keeping credit utilization below 30% is recommended, though below 10% is even better for your credit score.'
      }
    ],
    '5': [
      {
        id: '5-1',
        question: 'What is the debt snowball method?',
        options: [
          'Paying off highest interest debt first',
          'Paying off smallest debt first',
          'Making minimum payments on all debts equally',
          'Consolidating all debts into one loan'
        ],
        correctAnswer: 'Paying off smallest debt first',
        explanation: 'The debt snowball method focuses on paying off the smallest debts first to gain psychological momentum and motivation.'
      },
      {
        id: '5-2',
        question: 'What is the main advantage of the debt avalanche method?',
        options: [
          'It is easier to understand',
          'It provides quick psychological wins',
          'It saves the most money in interest',
          'It requires the smallest monthly payment'
        ],
        correctAnswer: 'It saves the most money in interest',
        explanation: 'The debt avalanche method targets high-interest debt first, which saves you the most money in interest charges over time.'
      },
      {
        id: '5-3',
        question: 'While paying off debt, what should you do about taking on new debt?',
        options: [
          'Only take on new debt if the interest rate is low',
          'Avoid taking on new debt',
          'Only use credit cards for emergencies',
          'It is okay to take on new debt for investments'
        ],
        correctAnswer: 'Avoid taking on new debt',
        explanation: 'While paying off existing debt, it is best to avoid taking on any new debt to make faster progress toward becoming debt-free.'
      }
    ],
    '6': [
      {
        id: '6-1',
        question: 'What is the historical average annual return of the stock market?',
        options: [
          '5%',
          '10%',
          '15%',
          '20%'
        ],
        correctAnswer: '10%',
        explanation: 'The stock market has historically returned about 10% annually over the long term, though returns vary year to year.'
      },
      {
        id: '6-2',
        question: 'What is the main advantage of index funds?',
        options: [
          'They guarantee positive returns',
          'They provide instant diversification at low cost',
          'They never lose value',
          'They require no long-term commitment'
        ],
        correctAnswer: 'They provide instant diversification at low cost',
        explanation: 'Index funds offer broad diversification across many stocks or bonds in a single investment, with low fees compared to actively managed funds.'
      },
      {
        id: '6-3',
        question: 'What investing principle is more important: timing the market or time in the market?',
        options: [
          'Timing the market - buying at the perfect time',
          'Time in the market - staying invested for the long term',
          'Both are equally important',
          'Neither matters for investment success'
        ],
        correctAnswer: 'Time in the market - staying invested for the long term',
        explanation: 'Time in the market is more important than timing the market. Staying invested long-term allows compound growth to work in your favor.'
      }
    ],
    '7': [
      {
        id: '7-1',
        question: 'What percentage of pre-retirement income should you aim to replace in retirement?',
        options: [
          '40-50%',
          '70-80%',
          '100%',
          '120%'
        ],
        correctAnswer: '70-80%',
        explanation: 'Most people need to replace 70-80% of their pre-retirement income to maintain their lifestyle, as some expenses decrease in retirement.'
      },
      {
        id: '7-2',
        question: 'What is the main advantage of getting an employer 401(k) match?',
        options: [
          'Lower taxes immediately',
          'Free money that boosts your retirement savings',
          'No investment risk',
          'Higher social security benefits'
        ],
        correctAnswer: 'Free money that boosts your retirement savings',
        explanation: 'An employer match is essentially free money - if you contribute enough to get the full match, you are instantly getting a 100% return on that portion.'
      },
      {
        id: '7-3',
        question: 'How much of your income should you aim to save for retirement?',
        options: [
          '5%',
          '10%',
          '15%',
          '25%'
        ],
        correctAnswer: '15%',
        explanation: 'Experts recommend saving 15% of your income for retirement, including employer contributions, to ensure a comfortable retirement.'
      }
    ],
    '8': [
      {
        id: '8-1',
        question: 'What is the benefit of contributing to a traditional 401(k)?',
        options: [
          'Withdrawals are tax-free in retirement',
          'Contributions reduce your taxable income now',
          'No contribution limits',
          'Guaranteed investment returns'
        ],
        correctAnswer: 'Contributions reduce your taxable income now',
        explanation: 'Traditional 401(k) contributions are made with pre-tax dollars, reducing your taxable income in the year you contribute.'
      },
      {
        id: '8-2',
        question: 'What is a Health Savings Account (HSA) triple tax benefit?',
        options: [
          'Tax-deductible contributions, tax-free growth, tax-free qualified withdrawals',
          'Three times the normal contribution limit',
          'Tax benefits for three years',
          'Reduces taxes by three percentage points'
        ],
        correctAnswer: 'Tax-deductible contributions, tax-free growth, tax-free qualified withdrawals',
        explanation: 'HSAs offer three tax benefits: contributions reduce taxable income, growth is tax-free, and withdrawals for medical expenses are tax-free.'
      },
      {
        id: '8-3',
        question: 'What is tax-loss harvesting?',
        options: [
          'Avoiding paying taxes on investments',
          'Selling losing investments to offset capital gains',
          'Claiming fake losses on your tax return',
          'Investing only in tax-free bonds'
        ],
        correctAnswer: 'Selling losing investments to offset capital gains',
        explanation: 'Tax-loss harvesting involves selling investments at a loss to offset capital gains, reducing your overall tax bill.'
      }
    ],
    '9': [
      {
        id: '9-1',
        question: 'What is a common rule for rental property income?',
        options: [
          'Monthly rent should equal property value',
          'Monthly rent should be at least 1% of property value',
          'Monthly rent should be 10% of property value',
          'Rent amount does not matter'
        ],
        correctAnswer: 'Monthly rent should be at least 1% of property value',
        explanation: 'The 1% rule suggests monthly rent should be at least 1% of the property value to ensure positive cash flow after expenses.'
      },
      {
        id: '9-2',
        question: 'What is the most important factor when choosing a real estate investment?',
        options: [
          'The age of the property',
          'Location',
          'The color of the house',
          'Number of bedrooms'
        ],
        correctAnswer: 'Location',
        explanation: 'Location is crucial in real estate - properties in desirable areas with good schools, jobs, and low crime appreciate more and attract better tenants.'
      },
      {
        id: '9-3',
        question: 'What costs should be included when calculating real estate investment returns?',
        options: [
          'Only the mortgage payment',
          'Only property taxes',
          'Purchase price, taxes, insurance, maintenance, repairs, and vacancies',
          'Only the down payment'
        ],
        correctAnswer: 'Purchase price, taxes, insurance, maintenance, repairs, and vacancies',
        explanation: 'All costs must be considered including purchase price, closing costs, property taxes, insurance, maintenance, repairs, and potential vacancy periods.'
      }
    ],
    '10': [
      {
        id: '10-1',
        question: 'What makes income truly "passive"?',
        options: [
          'It requires no initial effort',
          'It generates money with minimal ongoing effort',
          'It comes from a traditional job',
          'It is completely risk-free'
        ],
        correctAnswer: 'It generates money with minimal ongoing effort',
        explanation: 'Passive income requires upfront work to establish but generates money with minimal ongoing effort once set up.'
      },
      {
        id: '10-2',
        question: 'What is a dividend?',
        options: [
          'A company bonus for employees',
          'A type of savings account',
          'Regular payment of company profits to shareholders',
          'A government tax refund'
        ],
        correctAnswer: 'Regular payment of company profits to shareholders',
        explanation: 'Dividends are portions of company profits distributed regularly to shareholders as a return on their investment.'
      },
      {
        id: '10-3',
        question: 'What is the most passive form of income mentioned?',
        options: [
          'Rental properties',
          'Starting a business',
          'Index fund investing with automatic contributions',
          'Creating digital products'
        ],
        correctAnswer: 'Index fund investing with automatic contributions',
        explanation: 'Index fund investing with automatic contributions is the most passive option - requiring minimal time or expertise while providing historical returns.'
      }
    ],
  };

  return quizData[lessonId] || [];
}
