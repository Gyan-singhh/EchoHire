import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import { verifyToken } from "@/utils/jwt";
import { ErrorResponse } from "@/utils/ErrorResponse";
import Attempt from "@/server/models/Attempt";
import { generateInterviewFeedback } from "@/lib/genai/generateInterviewFeedback";

export async function POST(req) {
  await dbConnect();

  const {
    jobId,
    jobTitle,
    questionId,
    questions,
    answers,
    fullTranscript,
    isMockTest,
  } = await req.json();
  const { id: candidateId } = await verifyToken(req);

  if (
    !jobId ||
    !questionId ||
    !answers ||
    !fullTranscript ||
    !candidateId ||
    !jobTitle ||
    !questions
  ) {
    return ErrorResponse("Missing required fields", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const interviewData = {
      jobTitle,
      questions,
      answers,
      fullTranscript,
    };

    const feedbackResult = await generateInterviewFeedback(interviewData);
    if (!feedbackResult.success) {
      throw new Error(feedbackResult.error || "Failed to generate feedback");
    }

    const { rating, feedback } = feedbackResult.data;

    await Attempt.create(
      [
        {
          candidate: candidateId,
          job: jobId,
          questions: questionId,
          answers: answers.map((ans) => ({ answerText: ans })),
          rating,
          feedback,
          isMockTest,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(
      {
        success: true,
        message: "Feedback generated successfully",
        data: { rating, feedback },
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    return ErrorResponse(error.message || "Something went wrong", 500);
  } finally {
    session.endSession();
  }
}
