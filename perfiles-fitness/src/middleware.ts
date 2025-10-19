import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 🔍 Verificar si la cookie loggedIn está activa
  const loggedIn = req.cookies.get("loggedIn")?.value === "true";

  // Rutas públicas (no requieren login)
  const isAuthRoute =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register";

  // 🚫 Si no está logueado e intenta entrar a rutas protegidas
  if (!loggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Si ya está logueado y trata de ir a login o register → redirigir al inicio
  if (loggedIn && isAuthRoute) {
    const inicioUrl = new URL("/inicio", req.url);
    return NextResponse.redirect(inicioUrl);
  }

  // ✅ Permitir acceso si pasa las validaciones
  return NextResponse.next();
}

// 🔧 Rutas donde se aplicará este middleware
export const config = {
  matcher: [
    "/inicio/:path*",
    "/buscar/:path*",
    "/mibiblioteca/:path*",
    "/crearlista/:path*",
    "/canciones/:path*",
    "/login",
    "/register",
  ],
};
