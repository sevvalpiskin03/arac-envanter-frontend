import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function GET() {
  return relayBackendResponse(await authenticatedBackendFetch("companies"));
}

export async function POST(request: Request) {
  return relayBackendResponse(await authenticatedBackendFetch("companies", { method: "POST", body: await request.text() }));
}
