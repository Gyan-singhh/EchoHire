import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import Application from "@/server/models/Application";
import Job from "@/server/models/Job";
import Question from "@/server/models/Question";
import { verifyToken } from "@/utils/jwt";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyToken(req);
    if (!user) return ErrorResponse(401, "Unauthorized");

    const { interviewId: jobId } = await params;
    if (!jobId) return ErrorResponse("Job ID is required", 400);
  
    const job = await Job.findById(jobId).populate("questions");
    if (!job) return ErrorResponse("Job not found", 404);

    if (!job.isMockTest) {
      const application = await Application.findOne({
        candidate: user.id,
        jobId: job._id,
      });

      if (!application) {
        return ErrorResponse(
          "You have not applied for this job. Access denied.",
          403
        );
      }
    }

    return NextResponse.json({
      success: true,
      jobTitle: job.title,
      questions: job.questions || [],
      isMockTest: job.isMockTest || false,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return ErrorResponse(500, "Failed to fetch interview questions.");
  }
}
