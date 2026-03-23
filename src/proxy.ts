import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

export async function proxy(req: NextRequest) {
  // Si no hay credenciales configuradas, dejar pasar (auth desactivada)
  if (
    !process.env.AUTH_USER ||
    !process.env.AUTH_PASSWORD ||
    !process.env.SESSION_SECRET
  ) {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  const isLoginRoute = path === "/login";

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Sin sesión válida y no está en /login → redirigir a /login
  if (!session && !isLoginRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Con sesión válida y está en /login → redirigir a /
  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
