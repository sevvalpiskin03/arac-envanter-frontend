import { NextResponse } from "next/server";

function clearAuthCookie(response: NextResponse) {
  response.cookies.set("vehicle_admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("redirect") ?? "/";
  const safeTarget = target.startsWith("/") && !target.startsWith("//") ? target : "/";
  const response = NextResponse.redirect(new URL(safeTarget, url.origin));
  clearAuthCookie(response);
  return response;
}
