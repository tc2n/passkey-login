import { cookies } from "next/headers";
import { decrypt } from "./app/_lib/session";
import { NextResponse } from "next/server";

// USES EDGE RUNTIME
export default async function middleware(request) {
  // 1. Check if route is protected
  const protectedRoutes = ["/home"];
  const currentPath = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);

  // 2. Check fro valid session
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (isProtectedRoute) {
    // 3. Redirect unauthd users
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    }
  }

  if (currentPath.startsWith("/auth/") && session?.userId) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  // 4. Render route
  return NextResponse.next();
}

// Do *not* run Routes middleware on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
