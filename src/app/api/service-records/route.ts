import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function GET(request: Request) {
  return relayBackendResponse(await authenticatedBackendFetch(`service-records${new URL(request.url).search}`));
}

export async function POST(request: Request) {
  return relayBackendResponse(await authenticatedBackendFetch("service-records", { method: "POST", body: await request.text() }));
}
