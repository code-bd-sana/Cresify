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

  //   if (pathname === "/dashboard/payments") {

  //     if (userRole !== 'customer' && userRole !== 'butler') {
  //       return NextResponse.redirect(new URL('/login', req.url));
  //     }
  //   }

  //   if (pathname === "/dashboard/adminTools") {

  //     if (userRole !== 'admin') {
  //       return NextResponse.redirect(new URL('/login', req.url));
  //     }
  //   }

  //   if (pathname === "/dashboard/schedule") {
  //     if (userRole !== 'butler') {
  //       return NextResponse.redirect(new URL('/login', req.url));
  //     }
  //   }

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
    '/profile',
'/product-details/:path*',
'/cart',
'/dashboard/refund',
'/book-now'

  ],
};