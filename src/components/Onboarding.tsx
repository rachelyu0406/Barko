import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

export function Onboarding() {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [incomeRange, setIncomeRange] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        income_range: incomeRange,
        financial_goals: financialGoals,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2847] to-[#1a3a5c] flex items-center justify-center p-4">
      <div className="bg-[#132a4a] rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-800/30">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-full">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full mx-1 transition-all duration-300 ${
                  i <= step ? 'bg-emerald-500' : 'bg-blue-900/50'
                }`}
              />
            ))}
          </div>
          <p className="text-blue-200 text-center text-sm">
            Step {step} of 2
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">
                What's your income range?
              </h2>
              <p className="text-blue-300">
                This helps us personalize your learning experience
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'under_30k', label: 'Under $30,000/year' },
                { value: '30k_60k', label: '$30,000 - $60,000/year' },
                { value: '60k_100k', label: '$60,000 - $100,000/year' },
                { value: '100k_150k', label: '$100,000 - $150,000/year' },
                { value: 'over_150k', label: 'Over $150,000/year' },
                { value: 'prefer_not_say', label: 'Prefer not to say' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setIncomeRange(option.value)}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                    incomeRange === option.value
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-[#0a1f3d] border-blue-700/50 text-blue-100 hover:border-emerald-500/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!incomeRange}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30 mt-6"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">
                What are your financial goals?
              </h2>
              <p className="text-blue-300">
                Tell us what you want to achieve financially
              </p>
            </div>

            <div>
              <textarea
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                placeholder="E.g., Save for a house, build an emergency fund, invest for retirement, pay off debt, start a business..."
                className="w-full px-4 py-3 bg-[#0a1f3d] border border-blue-700/50 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-32 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-[#0a1f3d] text-blue-100 py-3 rounded-lg font-semibold hover:bg-[#0d2440] transition-all duration-200 border border-blue-700/50"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!financialGoals || loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30"
              >
                {loading ? 'Creating your plan...' : 'Start Learning'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
