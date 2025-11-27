import dbConnect from "@/server/db/dbConnect";
import bcryptjs from "bcryptjs";
import User from "@/server/models/User";
import { NextResponse } from "next/server";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username, email, password, role } = reqBody;
  
    if (!username || !email || !password || !role) {
      return ErrorResponse("All fields are required", 400);
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ErrorResponse("User already exists", 400);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const safeUser = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    return ErrorResponse(error.message, 500);
  }
}
