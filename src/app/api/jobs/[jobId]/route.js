import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import Job from "@/server/models/Job";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const jobId = (await params).jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job by id:", error);
    return ErrorResponse(error.message || "Server Error");
  }
}
