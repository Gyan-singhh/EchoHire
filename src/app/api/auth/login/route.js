import dbConnect from "@/server/db/dbConnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/server/models/User";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return ErrorResponse("Email and password are required", 400);
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return ErrorResponse("User does not exist", 400);
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return ErrorResponse("Invalid credentials", 401);
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role : user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24000 * 60 * 60, 
      path: "/",
    });

    return response;
  } catch (error) {
    return ErrorResponse(error.message, 500);
  }
}
