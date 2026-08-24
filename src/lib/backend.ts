import "server-only";

const DEFAULT_BACKEND_URL = "http://localhost:3001/api/v1";

export function getBackendUrl(path: string): string {
  const baseUrl = process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
