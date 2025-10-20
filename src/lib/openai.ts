import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - use backend in production
});

export async function generatePersonalizedLessons(
  country: string,
  language: string,
  ageGroup: string,
  incomeRange: string,
  culturalValue: string,
  financialGoals: string
): Promise<any> {
  const prompt = `You are an expert financial educator creating a personalized learning curriculum.

Create a customized financial literacy learning plan for someone with these characteristics:
- Country: ${country}
- Language: ${language}
- Age Group: ${ageGroup}
- Income Range: ${incomeRange}
- Cultural Value: ${culturalValue}
- Financial Goals: ${financialGoals}

Generate exactly 10 lessons that are:
1. Tailored to their income level and local financial context
2. Aligned with their cultural values and goals
3. Progressive in difficulty (beginner to advanced)
4. Practical and actionable for their country/region

For EACH lesson, provide:
- id: A unique number (1-10)
- title: Clear, engaging title
- description: 2-3 sentences explaining what they'll learn
- category: One of (Income Management, Savings, Budgeting, Credit, Debt, Investing, Retirement, Taxes, Real Estate)
- difficulty: Number 1-5
- estimatedMinutes: Realistic time estimate (5-20 minutes)
- content: Detailed lesson content (300-500 words) that is:
  * Culturally sensitive and relevant to ${country}
  * Uses local currency and examples
  * Addresses their specific goals: ${financialGoals}
  * Written in clear, accessible language
  * Includes practical action steps
- why: 1-2 sentences explaining why this lesson is important for THEIR specific situation

Return ONLY valid JSON in this exact format:
{
  "lessons": [
    {
      "id": "1",
      "title": "...",
      "description": "...",
      "category": "...",
      "difficulty": 1,
      "estimatedMinutes": 10,
      "content": "...",
      "why": "..."
    }
  ],
  "personalizedMessage": "A warm, encouraging message explaining why this plan fits their goals",
  "estimatedCompletionWeeks": 8
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful financial education expert that creates personalized learning plans. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    const content = response.choices[0].message.content?.trim();
    if (!content) throw new Error('No response from OpenAI');

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating lessons:', error);
    throw error;
  }
}

export { openai };