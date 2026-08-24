import "server-only";
import { redirect } from "next/navigation";
import { authenticatedBackendFetch } from "./authenticated-backend";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export async function requireAdmin(): Promise<AdminProfile> {
  const response = await authenticatedBackendFetch("auth/me");

  if (!response?.ok) {
    redirect("/api/auth/logout?redirect=/");
  }

  return (await response.json()) as AdminProfile;
}
