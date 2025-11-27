import { NextResponse } from "next/server";
import { ErrorResponse } from "@/utils/ErrorResponse";
import Application from "@/server/models/Application";
import dbConnect from "@/server/db/dbConnect";
import { verifyToken } from "@/utils/jwt";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await verifyToken(req);
    if (!user) {
      return ErrorResponse(401, "Unauthorized: User not authenticated.");
    }

    const assignedInterviews = await Application.find({
      candidate: user.id,
      "assignedInterview.isAssigned": true,
    })
      .populate("jobId", "title company")
      .sort({ "assignedInterview.scheduledAt": 1 });
    return NextResponse.json({
      success: true,
      count: assignedInterviews.length,
      data: assignedInterviews,
    });
  } catch (error) {
    console.error("Error fetching assigned interviews:", error);
    return ErrorResponse(
      500,
      "Server Error: Unable to fetch assigned interviews."
    );
  }
}
