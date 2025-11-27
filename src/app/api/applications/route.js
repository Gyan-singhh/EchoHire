import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import Application from "@/server/models/Application";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { verifyToken } from "@/utils/jwt";

export async function GET(req) {
  try {
    await dbConnect();
    const decodedToken = await verifyToken(req);

    if (!decodedToken) {
      return ErrorResponse("Unauthorized", 401);
    }
    const userId = decodedToken.id;

    const applications = await Application.find({ candidate: userId })
      .populate("jobId", "title companyName location jobType salaryRange")
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    return ErrorResponse(error.message || "Server Error");
  }
}
