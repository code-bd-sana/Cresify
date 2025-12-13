import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: "aidfjnvociydfnovfadf",
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token?.role;

  // Protect admin routes
  if (pathname.startsWith("/dashboard/admin-dashboard")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect provider routes
  if (pathname.startsWith("/dashboard/service-provider-dashboard")) {
    if (userRole !== "provider") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect seller/store routes
  if (
    pathname.startsWith("/dashboard/store-profile") ||
    pathname.startsWith("/dashboard/products")
  ) {
    if (userRole !== "seller") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect customer routes
  if (
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard/admin-dashboard") &&
    !pathname.startsWith("/dashboard/service-provider-dashboard") &&
    !pathname.startsWith("/dashboard/store-profile") &&
    !pathname.startsWith("/dashboard/products")
  ) {
    if (userRole !== "buyer" && userRole !== "customer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/products",
    "/dashboard/store-profile",
    "/dashboard/payments",
    "/dashboard/profile",
    "/dashboard/analytics",
    "/dashboard/reviews",
    "/dashboard/messages",
    "/dashboard/settings",
    "/dashboard/admin-dashboard/users",
    "/dashboard/admin-dashboard/products",
    "/dashboard/admin-dashboard/services",
    "/dashboard/orders",
    "/dashboard/booking",
    "/dashboard/payments",
    "/dashboard/content",
    "/dashboard/messages",
    "/dashboard/settings",
  ],
};
