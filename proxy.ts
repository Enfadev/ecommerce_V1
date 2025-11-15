import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { adminLogger, createAdminAccessLog } from "@/lib/security";

const PROTECTED_PATHS = ["/admin", "/profile", "/order-history", "/wishlist", "/checkout"];

const ADMIN_RESTRICTED_PATHS = ["/checkout", "/wishlist", "/order-history"];

const PROTECTED_API_ROUTES = ["/api/admin", "/api/profile", "/api/orders", "/api/wishlist", "/api/checkout"];

const ADMIN_RESTRICTED_API_ROUTES = ["/api/cart", "/api/wishlist", "/api/checkout", "/api/orders"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🛡️ Proxy executing for:", pathname);

  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname.startsWith("/api/upload") || pathname.startsWith("/static") || pathname.includes(".") || pathname === "/api/test" || pathname === "/jwt-test") {
    console.log("⏭️ Skipping proxy for:", pathname);
    const response = NextResponse.next();
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline'",
        "script-src-elem 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline'",
        "frame-src https://js.stripe.com https://www.paypal.com https://sandbox.paypal.com https://www.sandbox.paypal.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://*.stripe.com https://www.paypal.com https://www.paypalobjects.com https://ui-avatars.com",
        "connect-src 'self' https://api.stripe.com https://js.stripe.com https://api-m.sandbox.paypal.com https://api-m.paypal.com https://www.paypal.com https://www.sandbox.paypal.com",
      ].join("; ") + ";"
    );
    return response;
  }

  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isProtectedAPI = PROTECTED_API_ROUTES.some((path) => pathname.startsWith(path));

  if (isProtectedPath || isProtectedAPI) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      if (isProtectedAPI) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      } else {
        if (pathname.startsWith("/admin")) {
          return new NextResponse(null, { status: 404 });
        }

        const loginUrl = new URL("/signin", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      if (isProtectedAPI) {
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
      } else {
        if (pathname.startsWith("/admin")) {
          return new NextResponse(null, { status: 404 });
        }

        const loginUrl = new URL("/signin", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (payload.role !== "ADMIN") {
        adminLogger.log(createAdminAccessLog(payload.id, payload.email, payload.role, pathname, request, false, "Insufficient privileges - Admin role required"));

        if (isProtectedAPI) {
          return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        } else {
          return new NextResponse(null, { status: 404 });
        }
      }

      adminLogger.log(createAdminAccessLog(payload.id, payload.email, payload.role, pathname, request, true));
    }

    const isAdminRestrictedPath = ADMIN_RESTRICTED_PATHS.some((path) => pathname.startsWith(path));
    const isAdminRestrictedAPI = ADMIN_RESTRICTED_API_ROUTES.some((path) => pathname.startsWith(path));

    if ((isAdminRestrictedPath || isAdminRestrictedAPI) && payload.role === "ADMIN") {
      if (isProtectedAPI || isAdminRestrictedAPI) {
        return NextResponse.json({ error: "Customer access only - Admin cannot access this feature" }, { status: 403 });
      } else {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    response.headers.set("x-user-email", payload.email);
    response.headers.set("x-user-role", payload.role);
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline'",
        "script-src-elem 'self' https://js.stripe.com https://www.paypal.com 'unsafe-inline'",
        "frame-src https://js.stripe.com https://www.paypal.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://*.stripe.com https://www.paypal.com",
        "connect-src 'self' https://api.stripe.com https://js.stripe.com https://api-m.sandbox.paypal.com https://api-m.paypal.com https://www.paypal.com",
      ].join("; ") + ";"
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
