import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getMaintenance } from "@/lib/maintenance";

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
  if (pathname === "/maintenance" || pathname === "/api/health") return NextResponse.next();

  let enabled: boolean;
  try {
    enabled = (await getMaintenance()).enabled;
  } catch {
    // Do not accidentally expose the site if maintenance state cannot be read.
    enabled = true;
    console.error("Unable to read maintenance state; public access temporarily paused.");
  }
  if (!enabled) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const headers = { "Retry-After": "300", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (pathname.startsWith("/api/") || !["GET", "HEAD"].includes(request.method)) {
    return NextResponse.json({ error: "Site en maintenance. Veuillez réessayer plus tard." }, { status: 503, headers });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  return NextResponse.rewrite(url, { status: 503, headers });
}

export const config = {
  matcher: ["/((?!_next/|brand/|icons/|og\\.png$|favicon\\.ico$).*)"],
};
