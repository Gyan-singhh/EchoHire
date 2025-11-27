import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateInterviewFeedback(interviewData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    throw new Error("GEMINI_API_KEY environment variable is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  try {
    const { jobTitle, questions, answers, fullTranscript } = interviewData;

    const prompt = `You are an expert interview evaluator. Analyze the following interview and provide structured feedback.

JOB TITLE: ${jobTitle}

INTERVIEW QUESTIONS (raw data):
${JSON.stringify(questions, null, 2)}

INTERVIEW ANSWERS (raw data):
${JSON.stringify(answers, null, 2)}

FULL TRANSCRIPT:
${fullTranscript}

Provide feedback in this EXACT JSON format:
{
  "rating": number from 0 to 10,
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "overallComment": "Detailed overall assessment here..."
  }
}

Guidelines:
- Rating: 0-10 (10 being best)
- 3 strengths and 3 improvements
- Overall comment: 2-3 sentences
- Be constructive and professional
- Focus on communication skills, technical knowledge, and relevance to ${jobTitle}`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const feedbackData = JSON.parse(text);

    feedbackData.rating = Math.max(0, Math.min(10, feedbackData.rating));

    return { success: true, data: feedbackData };
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error(
      error.message || "Failed to generate feedback with Gemini AI"
    );
  }
}
