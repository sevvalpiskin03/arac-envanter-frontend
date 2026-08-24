import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function POST() { return relayBackendResponse(await authenticatedBackendFetch("maintenance-alerts/send-emails", { method: "POST" })); }
