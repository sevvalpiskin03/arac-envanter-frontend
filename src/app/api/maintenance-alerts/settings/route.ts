import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function PATCH(request: Request) {
  return relayBackendResponse(await authenticatedBackendFetch("maintenance-alerts/settings", { method: "PATCH", body: await request.text() }));
}
