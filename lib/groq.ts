import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateCompanyInterviewData(companyName: string) {
  const prompt = `You are an expert technical recruiter and career advisor. Provide detailed interview preparation information for ${companyName} in the following JSON format:

{
  "difficulty": "Easy/Medium/Hard",
  "rounds": ["Round 1 name and duration", "Round 2...", "..."],
  "topConcepts": ["Concept 1", "Concept 2", "..."],
  "commonQuestions": ["Question 1 with LeetCode number if applicable", "Question 2...", "..."],
  "leetcodeCount": "Approximate number of questions to practice",
  "tips": "Detailed preparation tips and company-specific advice"
}

Make it specific to ${companyName}'s actual interview process. Include realistic rounds, relevant DSA topics, actual interview questions asked at this company, and actionable preparation tips.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert technical interview coach who provides accurate, detailed interview preparation guidance. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content || ""
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error("Invalid JSON response from AI")
  } catch (error) {
    console.error("Groq API error:", error)
    throw error
  }
}

export async function chatWithAI(messages: Array<{ role: string; content: string }>, companyContext: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert interview preparation coach helping a candidate prepare for ${companyContext}. 
          
Provide specific, actionable advice about:
- Interview preparation strategies
- Topic-specific study plans
- Question-solving approaches
- Time management tips
- Company culture and what they value
- Common mistakes to avoid

Be encouraging, specific, and practical. Reference real interview experiences when relevant.`
        },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response."
  } catch (error) {
    console.error("Groq chat error:", error)
    throw error
  }
}