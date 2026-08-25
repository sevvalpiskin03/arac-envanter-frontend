import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";
export async function PATCH(request:Request,context:RouteContext<"/api/companies/[companyId]">){const {companyId}=await context.params;return relayBackendResponse(await authenticatedBackendFetch(`companies/${companyId}`,{method:"PATCH",body:await request.text()}));}
