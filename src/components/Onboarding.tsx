import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generatePersonalizedLessons } from '../lib/openai';
import { Target, TrendingUp, Globe, Users, Calendar } from 'lucide-react';

export function Onboarding() {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // User profile data
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('English');
  const [ageGroup, setAgeGroup] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [culturalValue, setCulturalValue] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Generate personalized lessons using OpenAI
      const learningPlan = await generatePersonalizedLessons(
        country,
        language,
        ageGroup,
        incomeRange,
        culturalValue,
        financialGoals
      );

      // Save to user profile
      await updateProfile({
        income_range: incomeRange,
        financial_goals: financialGoals,
        learning_plan: [learningPlan],
      });
    } catch (err: any) {
      console.error('Error creating learning plan:', err);
      setError('Failed to create your personalized plan. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] flex items-center justify-center p-4">
      <div className="bg-[#132a4a] rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-800/30">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src="/BarkoLogo.png" alt="Barko Logo" className="w-full h-full object-cover scale-150" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full mx-1 transition-all duration-300 ${
                  i <= step ? 'bg-emerald-500' : 'bg-blue-900/50'
                }`}
              />
            ))}
          </div>
          <p className="text-blue-200 text-center text-sm">Step {step} of 3</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Location & Demographics */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Globe className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
              <p className="text-blue-300">We'll customize your learning experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States, Kenya, India"
                className="w-full px-4 py-3 bg-[#0a1f3d] border border-blue-700/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Preferred Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., English, Spanish, Swahili"
                className="w-full px-4 py-3 bg-[#0a1f3d] border border-blue-700/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Age Group
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['18-25', '26-40', '41-60', '60+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(age)}
                    className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                      ageGroup === age
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-[#0a1f3d] border-blue-700/50 text-blue-100 hover:border-emerald-500/50'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!country || !language || !ageGroup}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30 mt-6"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Financial Context */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">Financial Context</h2>
              <p className="text-blue-300">Help us understand your situation</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Income Range
              </label>
              <div className="space-y-2">
                {[
                  { value: 'low', label: 'Low income' },
                  { value: 'low_middle', label: 'Low-Middle income' },
                  { value: 'middle', label: 'Middle income' },
                  { value: 'high', label: 'High income' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setIncomeRange(option.value)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                      incomeRange === option.value
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-[#0a1f3d] border-blue-700/50 text-blue-100 hover:border-emerald-500/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Cultural Value Priority
              </label>
              <div className="space-y-2">
                {[
                  { value: 'family_first', label: 'Family-first', icon: Users },
                  { value: 'individualist', label: 'Individualist', icon: TrendingUp },
                  { value: 'community', label: 'Community-oriented', icon: Globe },
                  { value: 'risk_averse', label: 'Risk-averse', icon: Calendar },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setCulturalValue(option.value)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 border-2 flex items-center gap-3 ${
                        culturalValue === option.value
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-[#0a1f3d] border-blue-700/50 text-blue-100 hover:border-emerald-500/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-[#0a1f3d] text-blue-100 py-3 rounded-lg font-semibold hover:bg-[#0d2440] transition-all duration-200 border border-blue-700/50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!incomeRange || !culturalValue}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Financial Goals</h2>
              <p className="text-blue-300">What do you want to achieve?</p>
            </div>

            <div>
              <textarea
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                placeholder="E.g., Save for a house down payment, build emergency fund, invest for retirement, pay off student loans, start a business, support family..."
                className="w-full px-4 py-3 bg-[#0a1f3d] border border-blue-700/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-40 resize-none"
              />
            </div>

            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-100 mb-2">Your Profile Summary:</h3>
              <div className="text-xs text-blue-300 space-y-1">
                <p>📍 {country} • {language}</p>
                <p>👤 Age: {ageGroup}</p>
                <p>💰 Income: {incomeRange}</p>
                <p>🌟 Values: {culturalValue}</p>
              </div>
            </div>

            {loading && (
              <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400 mb-2"></div>
                <p className="text-emerald-300 text-sm">Creating your personalized learning plan...</p>
                <p className="text-blue-300 text-xs mt-1">This may take 15-30 seconds</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 bg-[#0a1f3d] text-blue-100 py-3 rounded-lg font-semibold hover:bg-[#0d2440] transition-all duration-200 border border-blue-700/50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!financialGoals || loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30"
              >
                {loading ? 'Generating...' : 'Create My Plan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}