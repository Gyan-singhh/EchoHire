import { NextResponse } from "next/server";
import Job from "@/server/models/Job";
import dbConnect from "@/server/db/dbConnect";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { verifyToken } from "@/utils/jwt";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyToken(req);
    if (!user) {
      return ErrorResponse("Unauthorized", 401);
    }
    const jobs = await Job.find({ createdBy: user.id });
    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    return ErrorResponse(error.message || "Server Error");
  }
}