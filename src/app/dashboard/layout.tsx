import { AppShell } from "@/components/layout/app-shell";
import { requireAdmin } from "@/lib/session";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const admin = await requireAdmin();
  return <AppShell admin={admin}>{children}</AppShell>;
}
