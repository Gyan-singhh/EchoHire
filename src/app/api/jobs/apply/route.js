import { NextResponse } from "next/server";
import { ErrorResponse } from "@/utils/ErrorResponse";
import Job from "@/server/models/Job";
import Application from "@/server/models/Application";
import { uploadFile } from "@/utils/upload";
import { verifyToken } from "@/utils/jwt";
import dbConnect from "@/server/db/dbConnect";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume");
    const jobId = formData.get("jobId");

    const { id: candidateId } = await verifyToken(req);

    if (!resume || !jobId || !candidateId) {
      return ErrorResponse("Missing required fields", 400);
    }

    const { url: resumeUrl, publicId } = await uploadFile(resume);
    if (!resumeUrl || !publicId) {
      return ErrorResponse("Failed to upload resume", 500);
    }

    await dbConnect();

    const application = new Application({
      jobId,
      candidate: candidateId,
      resume: {
        resumeUrl,
        publicId,
      },
    });
    await application.save();

    const job = await Job.findById(jobId);
    if (!job) {
      return ErrorResponse("Job not found", 404);
    }

    if (!job.applicants.includes(candidateId)) {
      job.applicants.push(candidateId);
      await job.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          resumeUrl,
          jobId,
          candidateId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return ErrorResponse(error.message || "Server Error", 500);
  }
}
