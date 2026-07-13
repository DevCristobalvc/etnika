import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPanel = pathname.startsWith("/admin/") && pathname !== "/admin";
  const session = request.cookies.get("admin_session")?.value;

  if (isPanel && session !== "1") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (pathname === "/admin" && session === "1") {
    return NextResponse.redirect(new URL("/admin/pedidos", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
