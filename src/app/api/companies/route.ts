import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function GET() {
  return relayBackendResponse(await authenticatedBackendFetch("companies"));
}
