import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mk_admin_session";
const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "marrakech-premium-dev-secret-change-me-please-0001",
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      // fallthrough
    }
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Keep the preview and health checks reachable; assets are excluded below.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
