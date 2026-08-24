import { authenticatedBackendFetch } from "@/lib/authenticated-backend";

export async function GET(request: Request) {
  const response = await authenticatedBackendFetch(`reports/excel${new URL(request.url).search}`);
  if (!response) return Response.json({ message: "Oturum bulunamadı." }, { status: 401 });
  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": response.headers.get("Content-Disposition") ?? "attachment; filename=filo-raporu.xlsx",
    },
  });
}
