import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend";

interface BackendLoginResponse {
  accessToken?: string;
  message?: string | string[];
}

export async function POST(request: Request) {
  try {
    const credentials = (await request.json()) as unknown;
    const backendResponse = await fetch(getBackendUrl("auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
    const result = (await backendResponse.json()) as BackendLoginResponse;

    if (!backendResponse.ok || !result.accessToken) {
      const message = Array.isArray(result.message)
        ? result.message[0]
        : result.message;
      return NextResponse.json(
        { message: message ?? "E-posta veya şifre hatalı." },
        { status: backendResponse.status },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("vehicle_admin_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Kimlik doğrulama servisine ulaşılamadı." },
      { status: 503 },
    );
  }
}
