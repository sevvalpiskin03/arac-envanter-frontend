import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/companies/[companyId]/units">,
) {
  const { companyId } = await context.params;
  return relayBackendResponse(
    await authenticatedBackendFetch(`companies/${companyId}/units`),
  );
}
