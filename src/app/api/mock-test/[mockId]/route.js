import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import { verifyToken } from "@/utils/jwt";
import { ErrorResponse } from "@/utils/ErrorResponse";
import Job from "@/server/models/Job";
import Attempt from "@/server/models/Attempt";
import User from "@/server/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyToken(req);
    if (!user) return ErrorResponse("Unauthorized", 401);

    const candidate = await User.findById(user.id);
    if (!candidate || candidate.role !== "candidate")
      return ErrorResponse("Access denied. candidate only.", 403);

    const { mockId } = await params;
    if (!mockId) return ErrorResponse("Missing mock test ID", 400);

    const job = await Job.findById(mockId);
    if (!job)
      return ErrorResponse("Mock test not found", 404);

    const attempt = await Attempt.findOne({
      candidate: user.id,
      job: mockId,
    }).populate("questionId");

    return NextResponse.json(
      {
        success: true,
        mockTest: {
          id: job._id,
          title: job.title,
          description: job.jobDescription,
          skillsRequired: job.skillsRequired,
          attempt: attempt
            ? {
                answers: attempt.answers,
                feedback: attempt.feedback,
                rating: attempt.rating,
              }
            : null,
            createdAt: job.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching mock test:", error);
    return ErrorResponse(error.message || "Server Error");
  }
}
