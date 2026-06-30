import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const publicRoutes = ["/signin"];

export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const userRole = token?.role?.toUpperCase();

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // ////
  
  if (pathname === "/dashboard/admin") {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname === "/dashboard/teacher") {
    if (userRole === "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (pathname === "/dashboard/student") {
    if (userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (pathname === "/dashboard/librarian") {
    if (userRole === "LIBRARIAN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (pathname === "/dashboard/parents") {
    if (userRole === "PARENTS") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }


  ///////////
  if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/exam") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/users") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard/teacher") && userRole !== "TEACHER") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard/student") && userRole !== "STUDENT") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/parents") && userRole !== "PARENTS") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard/library") && userRole !== "LIBRARIAN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
