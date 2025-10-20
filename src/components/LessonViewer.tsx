import { useState, useEffect } from 'react';
import { Volume2, VolumeX, CheckCircle, ChevronRight } from 'lucide-react';

type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimatedMinutes: number;
  content?: string;
};

type LessonViewerProps = {
  lesson: Lesson;
  onComplete: () => void;
  onStartQuiz: () => void;
};

export function LessonViewer({ lesson, onComplete, onStartQuiz }: LessonViewerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = lesson.content || getLessonContent(lesson);
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getLessonContent = (lesson: Lesson): string => {
    const contentMap: Record<string, string> = {
      '1': `Understanding your income is the first step to financial success. Your income is more than just a paycheck - it's your financial foundation. Let's explore how to maximize and manage it effectively.

First, identify all your income sources. This includes your primary job, side hustles, investments, and any passive income streams. Many people overlook smaller income sources, but they can add up significantly over time.

Next, understand the difference between gross and net income. Gross income is what you earn before taxes and deductions, while net income is what actually hits your bank account. Always budget based on your net income to avoid overspending.

Consider ways to increase your income. This could mean asking for a raise, developing new skills, starting a side business, or investing in income-generating assets. Even a small increase in income can make a big difference over time when managed properly.

Finally, protect your income with proper insurance and an emergency fund. Your ability to earn is your most valuable asset, so safeguarding it should be a top priority.`,

      '2': `An emergency fund is your financial safety net. Life is unpredictable, and having money set aside for unexpected expenses can prevent you from going into debt when emergencies arise.

How much should you save? Financial experts typically recommend 3-6 months of living expenses. If you have a less stable income or dependents, aim for 6-9 months. Start with a goal of $1,000, then build from there.

Where should you keep it? Your emergency fund should be easily accessible but separate from your regular checking account. A high-yield savings account is ideal - it earns interest while remaining liquid.

How to build it? Start small. Even saving $25-50 per paycheck adds up. Automate your savings so the money transfers before you can spend it. Consider directing windfalls like tax refunds or bonuses straight to your emergency fund.

When to use it? True emergencies only - medical expenses, job loss, urgent home or car repairs. Not for vacations, new gadgets, or planned expenses. If you do use it, make replenishing it your top priority.`,

      '3': `Budgeting is the cornerstone of financial success. The 50/30/20 rule is a simple, effective framework: allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.

Needs include essentials like housing, utilities, groceries, transportation, insurance, and minimum debt payments. If your needs exceed 50%, look for ways to reduce costs - perhaps a roommate, more affordable housing, or public transportation.

Wants are non-essentials that make life enjoyable - dining out, entertainment, hobbies, subscriptions. This is where you have the most flexibility to cut back if needed. The key is being honest about what's truly a want versus a need.

The 20% for savings and debt repayment is crucial for your financial future. This includes emergency fund contributions, retirement savings, extra debt payments, and other financial goals. If you can save more than 20%, even better.

Track your spending for at least a month to see where your money actually goes. Many people are surprised to discover how much they spend on small, frequent purchases. Use apps, spreadsheets, or even pen and paper - whatever works for you.`,

      '4': `Your credit score is a three-digit number that can save or cost you thousands of dollars. It affects your ability to get loans, rent apartments, and sometimes even land jobs. Understanding and improving it is essential.

Credit scores typically range from 300 to 850. Excellent is 750+, good is 700-749, fair is 650-699, and poor is below 650. The difference between good and excellent credit can mean significantly lower interest rates on mortgages and loans.

What affects your score? Payment history is most important (35%), followed by amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%). Pay all bills on time, keep credit card balances low, and avoid opening too many new accounts at once.

How to improve your score? First, always pay at least the minimum payment on time - set up automatic payments if needed. Second, keep credit utilization below 30% of your available credit, ideally below 10%. Third, don't close old credit cards, as they help your average account age.

Check your credit report annually for free at AnnualCreditReport.com. Look for errors and dispute any inaccuracies. Building good credit takes time, but the long-term benefits are worth the effort.`,

      '5': `Debt can feel overwhelming, but with the right strategy, you can become debt-free. The key is having a clear plan and staying committed to it.

First, list all your debts with their balances, interest rates, and minimum payments. Seeing everything in one place helps you understand the full picture and create an effective strategy.

Two popular methods are the debt snowball and debt avalanche. The snowball method pays off smallest debts first for psychological wins, while the avalanche method targets highest interest rates first to save money. Choose the one that motivates you most.

Make minimum payments on all debts, then put any extra money toward your target debt. Once that's paid off, roll that payment into the next debt. This creates momentum as you eliminate each balance.

Consider ways to reduce interest rates. This might mean balance transfers to 0% APR cards, refinancing high-interest loans, or negotiating with creditors. Even a small reduction in interest can save hundreds or thousands of dollars.

Avoid taking on new debt while paying off existing debt. Cut up credit cards if needed, or freeze them in ice. Focus on the goal of financial freedom. Remember, every payment brings you closer to being debt-free.`,

      '6': `Investing can seem intimidating, but it's essential for building long-term wealth. The stock market has historically returned about 10% annually, far exceeding savings account rates.

Start with understanding basic investment types. Stocks represent ownership in companies and offer high growth potential with higher risk. Bonds are loans to companies or governments, offering steady income with lower risk. Index funds hold many stocks or bonds, providing instant diversification.

Index funds are ideal for most investors. They're low-cost, diversified, and don't require picking individual stocks. A total market index fund gives you exposure to the entire stock market in a single investment.

The power of compound interest is remarkable. $500 monthly invested at 8% annual returns grows to over $700,000 in 30 years. Time in the market beats timing the market - start investing as early as possible, even with small amounts.

Diversification reduces risk. Don't put all your money in one stock or sector. Spread investments across different asset classes, industries, and geographies. This protects you if one area underperforms.

Keep emotions in check. Markets fluctuate - that's normal. Avoid panic selling during downturns. Historically, markets always recover and reach new highs. Stay focused on long-term goals, not short-term volatility.`,

      '7': `Retirement planning isn't just for older people - it's for anyone who wants to stop working someday. Starting early gives your money more time to grow through compound interest.

How much do you need? A common rule is to save enough to replace 70-80% of your pre-retirement income. If you spend $50,000 annually now, aim for $35,000-40,000 in retirement. The earlier you start, the less you need to save each year.

Take advantage of employer retirement plans. If your company offers a 401(k) match, contribute at least enough to get the full match - it's free money. These plans also offer tax advantages that help your savings grow faster.

Individual Retirement Accounts (IRAs) are another great option. Traditional IRAs offer tax deductions now, while Roth IRAs provide tax-free withdrawals in retirement. Choose based on your current tax bracket and expected future income.

Aim to save 15% of your income for retirement. This includes employer contributions. If that seems impossible now, start with what you can - even 5% - and increase it by 1% annually. You'll barely notice the difference in take-home pay.

Review your retirement plan annually. As you age, gradually shift from higher-risk stocks to more stable bonds. At 30, you might be 90% stocks. By 60, perhaps 60% stocks and 40% bonds. This protects your savings as you near retirement.`,

      '8': `Understanding taxes helps you keep more of your income. While taxes are necessary, there are many legal ways to reduce your tax burden and maximize your wealth.

Know your tax bracket. The US has a progressive tax system - you pay different rates on different portions of your income. Understanding this helps you make informed financial decisions and take advantage of deductions and credits.

Maximize retirement contributions. Money contributed to traditional 401(k)s and IRAs reduces your taxable income now. For 2024, you can contribute up to $23,000 to a 401(k) and $7,000 to an IRA. That's potentially $30,000 less in taxable income.

Don't overlook tax deductions and credits. Deductions reduce taxable income, while credits directly reduce taxes owed. Common deductions include mortgage interest, student loan interest, and charitable donations. Credits include the Earned Income Tax Credit and Child Tax Credit.

Health Savings Accounts (HSAs) offer triple tax benefits - contributions are tax-deductible, growth is tax-free, and withdrawals for medical expenses are tax-free. If eligible, max out your HSA before other savings.

Consider tax-loss harvesting in investment accounts. Selling investments at a loss can offset capital gains, reducing your tax bill. Just be careful of the wash-sale rule, which prevents repurchasing the same security within 30 days.

Work with a tax professional if your situation is complex. The cost of good tax advice often pays for itself through legitimate tax savings.`,

      '9': `Real estate can be a powerful wealth-building tool, offering both appreciation and rental income. However, it requires significant capital, knowledge, and ongoing management.

Start by understanding different real estate investments. Primary residence builds equity while you live there. Rental properties generate monthly income. Real Estate Investment Trusts (REITs) let you invest in real estate without buying property. House hacking means renting out part of your home.

Location is crucial. Research areas with strong job growth, good schools, and low crime. Properties in desirable locations appreciate more and attract better tenants. Visit neighborhoods at different times before investing.

Calculate all costs accurately. Beyond the purchase price, factor in closing costs, property taxes, insurance, maintenance, repairs, and potential vacancies. A common rule: rental income should be at least 1% of the property's value monthly.

Financing matters. A larger down payment means lower monthly payments and better loan terms. Understand different mortgage types and their implications. Consider interest rates' impact on your long-term costs.

Property management takes time and skill. You'll handle tenant screening, maintenance, repairs, and collections. If you hire a property manager, factor that cost (typically 8-12% of rent) into your calculations.

Real estate isn't passive income initially. It requires active work to find, purchase, and maintain properties. However, with time and multiple properties, it can generate substantial wealth and eventually passive income.`,

      '10': `Passive income is money earned with minimal ongoing effort. While building passive income streams requires upfront work, they can eventually provide financial freedom and security.

Dividend-paying stocks and funds regularly distribute company profits to shareholders. By reinvesting dividends, you accelerate wealth building through compound returns. Quality dividend stocks from established companies offer both income and growth potential.

Rental properties, once established, can provide steady monthly income. While not entirely passive due to management needs, they become more passive over time, especially with property managers. Multiple properties can generate substantial monthly cash flow.

Create digital products like courses, ebooks, or software. You create once and sell repeatedly. This requires upfront effort but can generate income for years. Platforms like Udemy, Amazon, or your own website make distribution easy.

Peer-to-peer lending lets you earn interest by lending money to borrowers through platforms like LendingClub. Returns can exceed traditional savings accounts, though with more risk. Diversify across many loans to minimize default risk.

Start a blog or YouTube channel. Once established with good content and audience, advertising, sponsorships, and affiliate marketing can generate income. This takes time to build but can become quite passive eventually.

Index fund investing is perhaps the most passive approach. Regular contributions to diversified index funds require minimal time or expertise but historically generate strong returns. Set up automatic investments and let compound interest work for you.

Remember, truly passive income takes time to build. Be patient, start with one income stream, master it, then add others. Diversifying your income sources provides financial security and independence.`,
    };

    return contentMap[lesson.id] || lesson.description;
  };

  const content = lesson.content || getLessonContent(lesson);

  return (
    <div className="bg-[#132a4a] rounded-xl shadow-xl p-6 md:p-8 border border-blue-800/30">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
              {lesson.category}
            </span>
            <span className="text-xs text-blue-300">
              {lesson.estimatedMinutes} min
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {lesson.title}
          </h2>
          <p className="text-blue-200">{lesson.description}</p>
        </div>

        {speechSupported && (
          <button
            onClick={toggleSpeech}
            className={`ml-4 p-3 rounded-lg transition-all duration-200 ${
              isSpeaking
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="prose prose-invert max-w-none mb-8">
        <div className="text-blue-50 leading-relaxed space-y-4 text-base md:text-lg">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onComplete}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 py-3 px-6 rounded-lg font-semibold hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-500/50"
        >
          <CheckCircle className="w-5 h-5" />
          Mark as Complete
        </button>
        <button
          onClick={onStartQuiz}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/30"
        >
          Take Quiz
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
