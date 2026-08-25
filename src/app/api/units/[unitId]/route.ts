import { authenticatedBackendFetch, relayBackendResponse } from "@/lib/authenticated-backend";
export async function PATCH(request:Request,context:RouteContext<"/api/units/[unitId]">){const {unitId}=await context.params;return relayBackendResponse(await authenticatedBackendFetch(`units/${unitId}`,{method:"PATCH",body:await request.text()}));}
