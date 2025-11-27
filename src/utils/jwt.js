import jwt from "jsonwebtoken";
import { ErrorResponse } from "./ErrorResponse";

export const verifyToken = async function (request) {
  const token = await request?.cookies?.get("token")?.value;

  if (!token) {
    return ErrorResponse("No token provided", 401);
  }
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};
