import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { getBackendUrl } from "@/lib/backend";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

async function getAdminProfile(token: string): Promise<AdminProfile | null> {
  try {
    const response = await fetch(getBackendUrl("auth/me"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as AdminProfile;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vehicle_admin_token")?.value;

  if (!token) redirect("/");

  const admin = await getAdminProfile(token);
  if (!admin) redirect("/api/auth/logout?redirect=/");

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <h1>Filo Yönetimi</h1>
            <p>{admin.email}</p>
          </div>
          <LogoutButton />
        </header>
        <section className="welcome-card">
          <span>Authentication tamamlandı</span>
          <h2>Hoş geldiniz, {admin.name}</h2>
          <p>
            Frontend ve backend güvenli şekilde haberleşiyor. Araç envanteri
            özelliklerine geçmeden önce bu temel akışı birlikte doğrulayacağız.
          </p>
        </section>
      </div>
    </main>
  );
}
