import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import { verifyToken } from "@/utils/jwt";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { generateInterviewQuestions } from "@/lib/genai/GeminiModel";
import Question from "@/server/models/Question";
import Job from "@/server/models/Job";

export async function POST(req) {
  const user = await verifyToken(req);
  if (!user) return ErrorResponse("Unauthorized", 401);
  const body = await req.json();
  const { title, jobDescription, skillsRequired } = body;

  if (!title || !jobDescription || !skillsRequired?.length)
    return ErrorResponse("Missing required fields", 400);

  await dbConnect();
  try {
    const questions = await generateInterviewQuestions({
      title,
      jobDescription,
      skillsRequired,
    });

    if (!questions?.length) {
      return ErrorResponse("Failed to generate questions", 500);
    }

    const questionDoc = await Question.create({ text: questions });

    const job = await Job.create({
      title,
      createdBy: user.id,
      jobDescription,
      skillsRequired,

      isMockTest: true,
      questions: questionDoc._id,
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("Error creating mock test:", error);
    return ErrorResponse(error.message || "Server Error");
  }
}
