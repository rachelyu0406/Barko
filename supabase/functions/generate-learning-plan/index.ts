import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { incomeRange, financialGoals } = await req.json();

    const incomeLabels: Record<string, string> = {
      'under_30k': 'under $30,000 per year',
      '30k_60k': '$30,000-$60,000 per year',
      '60k_100k': '$60,000-$100,000 per year',
      '100k_150k': '$100,000-$150,000 per year',
      'over_150k': 'over $150,000 per year',
      'prefer_not_say': 'not specified',
    };

    const incomeLabel = incomeLabels[incomeRange] || 'not specified';

    const lessons = [
      {
        id: '1',
        title: 'Understanding Your Income',
        description: 'Learn how to maximize and manage your income effectively',
        category: 'Income Management',
        difficulty: 1,
        estimatedMinutes: 8,
        why: `With an income ${incomeLabel}, understanding income optimization is crucial for achieving your goals.`,
      },
      {
        id: '2',
        title: 'Building an Emergency Fund',
        description: 'Create a safety net for unexpected expenses',
        category: 'Savings',
        difficulty: 1,
        estimatedMinutes: 10,
        why: 'Emergency funds are the foundation of financial security, regardless of income level.',
      },
      {
        id: '3',
        title: 'Budgeting Basics',
        description: 'Master the 50/30/20 rule and track your spending',
        category: 'Budgeting',
        difficulty: 2,
        estimatedMinutes: 12,
        why: 'A solid budget helps you allocate resources toward your financial goals effectively.',
      },
      {
        id: '4',
        title: 'Understanding Credit Scores',
        description: 'Learn what affects your credit and how to improve it',
        category: 'Credit',
        difficulty: 2,
        estimatedMinutes: 10,
        why: 'Good credit opens doors to better interest rates and financial opportunities.',
      },
      {
        id: '5',
        title: 'Debt Management Strategies',
        description: 'Learn effective methods to pay off debt',
        category: 'Debt',
        difficulty: 3,
        estimatedMinutes: 15,
        why: financialGoals.toLowerCase().includes('debt') 
          ? 'This directly addresses your goal of managing debt.'
          : 'Managing debt efficiently frees up money for savings and investments.',
      },
      {
        id: '6',
        title: 'Introduction to Investing',
        description: 'Understand stocks, bonds, and index funds',
        category: 'Investing',
        difficulty: 3,
        estimatedMinutes: 15,
        why: financialGoals.toLowerCase().includes('invest') 
          ? 'This will help you achieve your investment goals.'
          : 'Investing is key to building long-term wealth.',
      },
      {
        id: '7',
        title: 'Retirement Planning 101',
        description: 'Start planning for your future today',
        category: 'Retirement',
        difficulty: 4,
        estimatedMinutes: 12,
        why: financialGoals.toLowerCase().includes('retire') 
          ? 'Essential for achieving your retirement goals.'
          : 'The earlier you start planning for retirement, the better.',
      },
      {
        id: '8',
        title: 'Tax Optimization',
        description: 'Learn legal ways to reduce your tax burden',
        category: 'Taxes',
        difficulty: 4,
        estimatedMinutes: 15,
        why: 'Understanding taxes helps you keep more of your hard-earned money.',
      },
      {
        id: '9',
        title: 'Real Estate Investing',
        description: 'Explore property investment opportunities',
        category: 'Investing',
        difficulty: 5,
        estimatedMinutes: 18,
        why: financialGoals.toLowerCase().includes('house') || financialGoals.toLowerCase().includes('property') 
          ? 'This aligns with your real estate goals.'
          : 'Real estate can be a powerful wealth-building tool.',
      },
      {
        id: '10',
        title: 'Building Passive Income',
        description: 'Create income streams that work for you',
        category: 'Income Management',
        difficulty: 5,
        estimatedMinutes: 20,
        why: financialGoals.toLowerCase().includes('business') 
          ? 'This supports your entrepreneurial aspirations.'
          : 'Passive income provides financial freedom and security.',
      },
    ];

    const plan = {
      lessons,
      recommendedPath: lessons.map(l => l.id),
      estimatedCompletionWeeks: Math.ceil(lessons.length / 2),
      personalizedMessage: `Based on your income range (${incomeLabel}) and goals (${financialGoals}), we've created a personalized learning path to help you achieve financial success.`,
    };

    return new Response(
      JSON.stringify(plan),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
