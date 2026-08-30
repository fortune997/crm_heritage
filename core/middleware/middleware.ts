import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;

  // Redirection si l'utilisateur est déjà connecté et essaie d'aller sur /login
  if (token && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Liste des routes protégées
  const protectedRoutes = ["/dashboard", "/admin"];
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin", "/login", "/register"],
};
