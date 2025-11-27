import { NextResponse } from "next/server";
import { generateInterviewFeedback } from "@/lib/genai/generateInterviewFeedback";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await generateInterviewFeedback(body);

    if (!result.success) {
      console.error("🚨 Feedback generation failed:", result.error);
      return ErrorResponse(result.error || "Failed to generate feedback", 500);
    }

    return NextResponse.json({
      success: true,
      message: "Feedback generated",
      data: result.data,
    });
  } catch (error) {
    console.error("🚨 Error in interview feedback route:", error);
    return ErrorResponse(error.message || "Failed to generate feedback", 500);
  }
}
