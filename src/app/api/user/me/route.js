import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import dbConnect from "@/server/db/dbConnect";
import User from "@/server/models/User";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function GET(request) {
  try {
    await dbConnect();

    const decodedToken = await verifyToken(request);
    
    if (!decodedToken) {
      return ErrorResponse("Unauthorized", 401);
    }
    const userId = decodedToken.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return ErrorResponse("User not found", 404);
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return ErrorResponse("Server error", 500);
  }
}
