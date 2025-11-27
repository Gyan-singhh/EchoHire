import { NextResponse } from "next/server";

export function ErrorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}