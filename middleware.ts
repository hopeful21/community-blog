import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const protectedRoutes = [
    "/posts/create",
  ];

  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/posts/create",
  ],
};