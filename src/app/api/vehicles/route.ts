import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function GET(request: Request) {
  const query = new URL(request.url).search;
  return relayBackendResponse(await authenticatedBackendFetch(`vehicles${query}`));
}

export async function POST(request: Request) {
  const body = await request.text();
  return relayBackendResponse(
    await authenticatedBackendFetch("vehicles", { method: "POST", body }),
  );
}
