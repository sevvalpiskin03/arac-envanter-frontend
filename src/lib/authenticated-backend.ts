import "server-only";
import { cookies } from "next/headers";
import { getBackendUrl } from "./backend";

export async function authenticatedBackendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response | null> {
  const token = (await cookies()).get("vehicle_admin_token")?.value;
  if (!token) return null;

  return fetch(getBackendUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function relayBackendResponse(response: Response | null) {
  if (!response) {
    return Response.json({ message: "Oturum bulunamadı." }, { status: 401 });
  }

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
