import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import Job from "@/server/models/Job";
import Application from "@/server/models/Application";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { verifyToken } from "@/utils/jwt";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const jobId = (await params).jobId;
    const user = await verifyToken(req);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.createdBy.toString() !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Not your job" },
        { status: 403 }
      );
    }

    const applications = await Application.find({ jobId })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ job, applications });
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return ErrorResponse(error.message || "Server Error");
  }
}
