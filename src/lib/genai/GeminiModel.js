import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateInterviewQuestions(jobDetails) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable is not set");
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert interview question generator. Your sole task is to create questions.
Generate 10 short, clear, and simple interview questions based on the following details:

Job title: ${jobDetails.title}
Job description: ${jobDetails.jobDescription}
Required skills: ${jobDetails.skillsRequired.join(", ")}

You must output *only* a valid JSON array of strings. Do not include any other text, explanation, or markdown formatting.
Example format: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9", "Question 10"]
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const text = result.response.text();
    const questions = JSON.parse(text);

    if (!Array.isArray(questions) || questions.length === 0)
      throw new Error("Invalid or empty response array");

    return questions.slice(0, 10).map(String);
  } catch (error) {
    console.error("Gemini API error:", error.message);
    if (error.message.startsWith("Failed to parse")) {
      throw error;
    }
    throw new Error("Failed to generate interview questions due to API error");
  }
}
