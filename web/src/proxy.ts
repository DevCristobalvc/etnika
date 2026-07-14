import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verificarSesionAdmin } from "@/lib/admin-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // /admin = login, /admin/callback = aterrizaje del enlace mágico
  const esPublica = pathname === "/admin" || pathname === "/admin/callback";
  const esPanel = pathname.startsWith("/admin") && !esPublica;

  const cookie = request.cookies.get("admin_session")?.value;
  const autenticado = await verificarSesionAdmin(cookie);

  if (esPanel && !autenticado) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (pathname === "/admin" && autenticado) {
    return NextResponse.redirect(new URL("/admin/pedidos", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
