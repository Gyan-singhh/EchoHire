import { NextResponse } from "next/server";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error) {
    return ErrorResponse("Logout failed", 500);
  }
}
