import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generatePersonalizedLessons(
  country: string,
  language: string,
  ageGroup: string,
  incomeRange: string,
  culturalValue: string,
  financialGoals: string
): Promise<any> {
  console.log('Calling OpenAI API...');
  
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  const prompt = `Create a personalized financial literacy learning plan in valid JSON format.

Important: Only output the Json and nothing else

User Profile:
- Country: ${country}
- Language: ${language}
- Age Group: ${ageGroup}
- Income Range: ${incomeRange}
- Cultural Value: ${culturalValue}
- Financial Goals: ${financialGoals}

Generate exactly 5 lessons. Each lesson must have:
- id: string (1-5)
- title: string
- description: string (2-3 sentences)
- category: string (Income Management, Savings, Budgeting, Credit, Debt, Investing, Retirement, Taxes, or Real Estate)
- difficulty: number (1-5)
- estimatedMinutes: number (5-20)
- content: string (100-150 words, culturally relevant to ${country})
- why: string (1-2 sentences)
- quiz: array of 3 questions, each with:
  - id: string
  - question: string
  - options: array of 4 strings
  - correctAnswer: string (must exactly match one option)
  - explanation: string

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown, no explanations
2. All strings must use double quotes, not single quotes
3. Escape all quotes inside strings with backslash
4. No trailing commas
5. Keep content concise to avoid token limits
6. Make sure correctAnswer exactly matches one of the options

Example structure:
{
  "lessons": [{
    "id": "1",
    "title": "Understanding Income",
    "description": "Learn the basics.",
    "category": "Income Management",
    "difficulty": 1,
    "estimatedMinutes": 10,
    "content": "Content here...",
    "why": "This is important because...",
    "quiz": [{
      "id": "1-1",
      "question": "What is income?",
      "options": ["Money earned", "Money spent", "Money saved", "Money invested"],
      "correctAnswer": "Money earned",
      "explanation": "Income is money you earn."
    }]
  }],
  "personalizedMessage": "Welcome message here",
  "estimatedCompletionWeeks": 1
}`;

  try {
    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // More reliable JSON mode
      messages: [
        {
          role: 'system',
          content: 'You are a JSON API that only outputs valid JSON. Never include markdown, explanations, or any text outside the JSON object.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" }, // Force JSON output
      max_tokens: 4000, // Reduced to prevent truncation
      temperature: 0.5 // Lower temperature for more consistent output
    });

    console.log('OpenAI response received');
    let content = response.choices[0].message.content?.trim();
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }


    console.log('OpenAI response object:', response);
    content = response.choices?.[0]?.message?.content ?? '';
    console.log('RAW content length:', content.length);
    console.log('RAW content preview (first 2000 chars):\n', content.slice(0, 6000));
    console.log('RAW content around error position (if present):\n', 
                content.slice(Math.max(0, 15000 - 100), Math.min(content.length, 15000 + 100)));


    // Remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let cleaned = content.trim();

    // If the model wrapped everything in quotes (stringified JSON), fix it
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1); // remove outer quotes
    cleaned = cleaned.replace(/\\"/g, '"'); // unescape inner quotes
    cleaned = cleaned.replace(/\\n/g, '\n'); // unescape newlines
    cleaned = cleaned.replace(/\\r/g, '\r'); // unescape carriage returns
    }


    console.log('Parsing JSON response...');
    const parsed = JSON.parse(content);
    
    // Validate the structure
    if (!parsed.lessons || !Array.isArray(parsed.lessons)) {
      throw new Error('Invalid response structure: missing lessons array');
    }

    // Validate each lesson has quiz questions
    parsed.lessons.forEach((lesson: any, index: number) => {
      if (!lesson.quiz || !Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
        console.warn(`Lesson ${index + 1} missing quiz, adding default questions`);
        lesson.quiz = getDefaultQuizForLesson(lesson.id);
      }
    });

    console.log('Successfully parsed response');
    return parsed;
  } catch (error: any) {
    console.error('Error in generatePersonalizedLessons:', error);
    
    // If JSON parsing fails, return a fallback plan
    if (error instanceof SyntaxError) {
      console.log('JSON parse error, using fallback plan');
      return getFallbackLearningPlan(country, incomeRange, financialGoals);
    }
    
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
      throw new Error(`OpenAI API error: ${error.response.data.error?.message || 'Unknown error'}`);
    }
    throw error;
  }
}

// Fallback learning plan if API fails
function getFallbackLearningPlan(country: string, incomeRange: string, financialGoals: string) {
  return {
    lessons: [
      {
        id: "1",
        title: "Understanding Your Income",
        description: "Learn how to track and understand your income sources. Master the difference between gross and net income.",
        category: "Income Management",
        difficulty: 1,
        estimatedMinutes: 10,
        content: `Understanding your income is the foundation of financial literacy. Your gross income is what you earn before taxes and deductions, while net income is what actually reaches your bank account. For someone in ${country} with an income range of ${incomeRange}, it's crucial to know exactly how much money you have available each month. Start by listing all your income sources: salary, freelance work, investments, or any other earnings. Track your income for at least one month to understand your financial baseline. This knowledge will help you make informed decisions about budgeting, saving, and working toward your goal of ${financialGoals}.`,
        why: `This is essential for your ${financialGoals} because you need to know your starting point before planning your financial future.`,
        quiz: [
          {
            id: "1-1",
            question: "What is the difference between gross and net income?",
            options: [
              "Gross is after taxes, net is before taxes",
              "Gross is before taxes and deductions, net is what you actually receive",
              "They are the same thing",
              "Gross includes investments, net does not"
            ],
            correctAnswer: "Gross is before taxes and deductions, net is what you actually receive",
            explanation: "Gross income is your total earnings before any taxes or deductions, while net income is what actually hits your bank account."
          },
          {
            id: "1-2",
            question: "Why is tracking your income important?",
            options: [
              "To impress others with how much you make",
              "To understand your financial baseline and make informed decisions",
              "It is not important",
              "Only for tax purposes"
            ],
            correctAnswer: "To understand your financial baseline and make informed decisions",
            explanation: "Tracking income helps you understand exactly how much money you have available for budgeting, saving, and reaching your financial goals."
          },
          {
            id: "1-3",
            question: "Which should you use when creating a budget?",
            options: [
              "Gross income",
              "Net income",
              "Expected future income",
              "Average of both"
            ],
            correctAnswer: "Net income",
            explanation: "Always budget based on net income because that is the actual money you have available to spend after taxes and deductions."
          }
        ]
      },
      {
        id: "2",
        title: "Creating Your First Budget",
        description: "Build a personalized budget that works for your lifestyle and income level.",
        category: "Budgeting",
        difficulty: 2,
        estimatedMinutes: 15,
        content: `A budget is your financial roadmap. It helps you allocate your money wisely and work toward ${financialGoals}. Start with the 50/30/20 rule: 50% for needs (rent, food, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. Adjust these percentages based on your ${incomeRange} income level and local cost of living in ${country}. List all your monthly expenses and categorize them. Be honest about your spending habits. Use budgeting apps or a simple spreadsheet to track everything. Review and adjust your budget monthly.`,
        why: `Budgeting is the key tool to achieve ${financialGoals} and take control of your financial future.`,
        quiz: [
          {
            id: "2-1",
            question: "What is the 50/30/20 budgeting rule?",
            options: [
              "50% savings, 30% needs, 20% wants",
              "50% needs, 30% wants, 20% savings",
              "50% wants, 30% needs, 20% debt",
              "50% income, 30% expenses, 20% taxes"
            ],
            correctAnswer: "50% needs, 30% wants, 20% savings",
            explanation: "The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment."
          },
          {
            id: "2-2",
            question: "How often should you review your budget?",
            options: [
              "Once a year",
              "Never, once it is set",
              "Monthly",
              "Only when you get a raise"
            ],
            correctAnswer: "Monthly",
            explanation: "Reviewing your budget monthly helps you stay on track and make adjustments as your income or expenses change."
          },
          {
            id: "2-3",
            question: "What category do groceries fall under?",
            options: [
              "Wants",
              "Needs",
              "Savings",
              "Debt"
            ],
            correctAnswer: "Needs",
            explanation: "Groceries are essential expenses and fall under the needs category in your budget."
          }
        ]
      }
      // Add 8 more lessons following the same structure...
    ],
    personalizedMessage: `Welcome! This learning plan is designed specifically for your financial goals: ${financialGoals}. Each lesson builds on the previous one to help you gain confidence and control over your finances.`,
    estimatedCompletionWeeks: 8
  };
}

function getDefaultQuizForLesson(lessonId: string): any[] {
  return [
    {
      id: `${lessonId}-1`,
      question: "What is the main concept of this lesson?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "This covers the key concept discussed in the lesson."
    },
    {
      id: `${lessonId}-2`,
      question: "How can you apply this lesson?",
      options: ["Apply method 1", "Apply method 2", "Apply method 3", "Apply method 4"],
      correctAnswer: "Apply method 1",
      explanation: "This is the most practical way to use what you learned."
    },
    {
      id: `${lessonId}-3`,
      question: "Why is this lesson important?",
      options: ["Reason 1", "Reason 2", "Reason 3", "Reason 4"],
      correctAnswer: "Reason 1",
      explanation: "This lesson helps you build stronger financial habits."
    }
  ];
}

export { openai };

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type GeneratedLesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimatedMinutes: number;
  content: string;
  why: string;
  quiz: QuizQuestion[];
};