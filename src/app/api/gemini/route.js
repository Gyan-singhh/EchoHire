import { NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/genai/GeminiModel";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function POST(req) {
  try {
    const body = await req.json();
    const questions = await generateInterviewQuestions(body);
    return NextResponse.json({ questions });
  } catch (error) {
    return ErrorResponse(error.message || "Failed to generate questions");
  }
}
