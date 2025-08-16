import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const tokenCookie = req.cookies.get("token")?.value;
  const userVerified = req.cookies.get("isVerified")?.value;
  const userType = req.cookies.get("userType")?.value;
  const is_completed = req.cookies.get("is_completed")?.value;

  if (pathname.startsWith("/applicant")) {
    if (!tokenCookie) {
      if (pathname !== "/applicant/login" && pathname !== "/applicant/form") {
        return NextResponse.redirect(new URL("/applicant/login", req.url));
      }
      return NextResponse.next();
    }
    if (userVerified !== undefined && userVerified !== true) {
      if (
        tokenCookie &&
        userVerified !== "true" &&
        pathname !== "/applicant/form/emailVerification"
      ) {
        return NextResponse.redirect(
          new URL("/applicant/form/emailVerification", req.url)
        );
      }
    }
    if (is_completed !== undefined && is_completed === "false") {
      if (
        tokenCookie &&
        is_completed === "false" &&
        pathname !== "/applicant/profile/edit-profile"
      ) {
        return NextResponse.redirect(
          new URL("/applicant/profile/edit-profile", req.url)
        );
      }
    }

    if (tokenCookie && userVerified === "true") {
      if (userType !== "applicant") {
        return NextResponse.redirect(new URL("/employer/home", req.url));
      }
      if (
        pathname === "/applicant/login" ||
        pathname === "/applicant/form/emailVerification"
      ) {
        return NextResponse.redirect(
          new URL("/applicant/career-areas", req.url)
        );
      }
      return NextResponse.next();
    }
    if (tokenCookie && is_completed) {
      if (
        pathname === "/applicant/login" ||
        pathname === "/applicant/form/emailVerification"
      ) {
        return NextResponse.redirect(
          new URL("/applicant/career-areas", req.url)
        );
      }
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/employer")) {
    if (!tokenCookie) {
      if (pathname !== "/employer/login" && pathname !== "/employer/form") {
        return NextResponse.redirect(new URL("/employer/login", req.url));
      }
      return NextResponse.next();
    }
    if (userVerified !== undefined && userVerified !== true) {
    if (
      tokenCookie &&
      userVerified !== "true" &&
      pathname !== "/employer/form/emailVerification"
    ) {
      return NextResponse.redirect(
        new URL("/employer/form/emailVerification", req.url)
      );
    }
  }
  if (is_completed !== undefined && is_completed === "false") {
    if (
      tokenCookie &&
      is_completed === "false" &&
      pathname !== "/employer/profile/edit-profile"
    ) {
      return NextResponse.redirect(
        new URL("/employer/profile/edit-profile", req.url)
      );
    }
  }
    if (tokenCookie && userVerified === "true") {
      if (userType !== "employer") {
        return NextResponse.redirect(
          new URL("/applicant/career-areas", req.url)
        );
      }

      if (
        pathname === "/employer/login" ||
        pathname === "/employer/form/emailVerification"
      ) {
        return NextResponse.redirect(new URL("/employer/home", req.url));
      }
      return NextResponse.next();
    }

    if (tokenCookie && is_completed) {
      if (
        pathname === "/employer/login" ||
        pathname === "/employer/form/emailVerification"
      ) {
        return NextResponse.redirect(new URL("/employer/home", req.url));
      }
      return NextResponse.next();
    }
  }
  //feed
  if (!tokenCookie && userVerified !== "true" && pathname === "/feed") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|assets/images|favicon.ico).*)"],
};
