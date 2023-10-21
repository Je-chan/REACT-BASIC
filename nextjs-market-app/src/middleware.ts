import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

// 만약 아래의 config 가 살아 있다면 해당 경로에 대해서만 middleware 함수가 동작한다
// export const config = {
//   matcher: ["/admin/:path*", "/user"],
// };

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: "HELLO" });

  // 사용자가 접근한 path
  const pathname = req.nextUrl.pathname;

  // "/user" 페이지는 로그인된 유저만 접근 가능하도록 설정
  if (pathname.startsWith("/user") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // "/admin" 페이지는 userType 이 Admin 인 유저만 접근 가능하도록 설정
  if (pathname.startsWith("/admin") && session?.role !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인된 유저는 로그인, 회원가입 페이지에 접근 불가능
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
