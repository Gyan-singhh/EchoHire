import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  let isValid = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.TOKEN_SECRET || "secret"
      );
      await jwtVerify(token, secret);
      isValid = true;
    } catch (err) {
      console.log("Invalid/expired token:", err.message);
    }
  }

  if (token && !isValid) {
    const response = NextResponse.next();
    response.cookies.delete("token");
    return pathname === "/login"
      ? response
      : NextResponse.redirect(new URL("/login", request.url));
  }

  if (isValid && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isValid && !PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
