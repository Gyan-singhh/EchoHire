import { NextResponse } from "next/server";
import Job from "@/server/models/Job";
import Question from "@/server/models/Question";
import dbConnect from "@/server/db/dbConnect";
import { ErrorResponse } from "@/utils/ErrorResponse";
import { verifyToken } from "@/utils/jwt";
import User from "@/server/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      title,
      jobDescription,
      skillsRequired,
      experienceLevel,
      location,
      minSalary,
      maxSalary,
      jobType,
      openings,
      companyName,
      questions,
      responsibilities,
      requirements,
    } = body;

    const user = await verifyToken(req);

    if (!user) {
      return ErrorResponse("Unauthorized", 401);
    }

    const questionDoc = await Question.create({ text: questions });

    const job = await Job.create({
      title,
      createdBy: user?.id,
      jobDescription,
      skillsRequired,
      experienceLevel,
      companyName,
      salaryRange: { minSalary, maxSalary },
      location,
      jobType,
      openings,
      questions: questionDoc._id,
      responsibilities,
      requirements: requirements,
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    return ErrorResponse(error.message || "Server Error");
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const jobs = await Job.find({ isMockTest: { $ne: true } });
    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    return ErrorResponse(error.message || "Server Error");
  }
}
