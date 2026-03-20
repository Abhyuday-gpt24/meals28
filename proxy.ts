import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // We can finally use Prisma here!

export async function proxy(request: NextRequest) {
  // 1. Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Initialize the Supabase client to manage the Auth cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Get the current logged-in user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // 4. Define our protected routes
  const isAdminRoute = path.startsWith("/admin");
  const isKitchenRoute = path.startsWith("/kitchen");
  const isDriverRoute = path.startsWith("/driver");
  const isAuthRequired =
    path.startsWith("/checkout") ||
    path.startsWith("/orders") ||
    path.startsWith("/profile");

  const isProtected =
    isAdminRoute || isKitchenRoute || isDriverRoute || isAuthRequired;

  // 5. Kick out completely unauthenticated users
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 6. Role-Based Access Control (RBAC) Logic using Prisma
  if (user && (isAdminRoute || isKitchenRoute || isDriverRoute)) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const role = dbUser?.role;

    // Enforce Admin rules
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Enforce Kitchen rules (Admins and Staff can view it)
    if (isKitchenRoute && role !== "STAFF" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Enforce Driver rules (Admins and Drivers can view it)
    if (isDriverRoute && role !== "DRIVER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 7. Return the response with refreshed secure cookies
  return supabaseResponse;
}

// 8. Configure exactly which routes this proxy should intercept
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
