import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Map route prefixes to the roles allowed in them
const ROLE_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/seller", roles: ["SELLER", "ADMIN"] },
  { prefix: "/dashboard/middleman", roles: ["MIDDLEMAN", "ADMIN"] },
  { prefix: "/dashboard/buyer", roles: ["BUYER", "ADMIN"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
];

export async function proxy(req: Request) {
  const session = await auth();
  const { pathname } = new URL(req.url);

  // Any /dashboard route requires login
  if (pathname.startsWith("/dashboard") && !session?.user) {
    const loginUrl = new URL("/signin", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-specific dashboard areas
  const match = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (match && session?.user && !match.roles.includes(session.user.role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};