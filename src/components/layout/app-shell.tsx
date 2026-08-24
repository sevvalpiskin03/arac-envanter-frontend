"use client";

import {
  Bell,
  Building2,
  CarFront,
  FileSpreadsheet,
  LayoutDashboard,
  Settings,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

const navigation = [
  { href: "/dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
  { href: "/dashboard/vehicles", label: "Araç Envanteri", icon: CarFront },
  { href: "#", label: "Bakım ve Tamir", icon: Wrench, disabled: true },
  { href: "#", label: "Bakım Uyarıları", icon: Bell, disabled: true },
  { href: "#", label: "Raporlar", icon: FileSpreadsheet, disabled: true },
  { href: "#", label: "Şirket ve Birimler", icon: Building2, disabled: true },
];

interface AppShellProps {
  admin: { name: string; email: string };
  children: ReactNode;
}

export function AppShell({ admin, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="brand-icon">FY</span>
          <span><strong>Filo Yönetimi</strong><small>Araç ve bakım takibi</small></span>
        </div>
        <nav className="app-navigation" aria-label="Ana menü">
          {navigation.map(({ href, label, icon: Icon, disabled }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return disabled ? (
              <span className="nav-item nav-disabled" key={label} aria-disabled="true">
                <Icon aria-hidden="true" /> {label}<small>Yakında</small>
              </span>
            ) : (
              <Link className={`nav-item ${active ? "nav-active" : ""}`} href={href} key={label}>
                <Icon aria-hidden="true" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-account">
          <span className="account-avatar">{admin.name.slice(0, 2).toLocaleUpperCase("tr-TR")}</span>
          <span><strong>{admin.name}</strong><small>{admin.email}</small></span>
          <Settings aria-hidden="true" />
        </div>
        <LogoutButton />
      </aside>
      <main className="app-content">{children}</main>
      <nav className="mobile-navigation" aria-label="Mobil ana menü">
        {navigation.slice(0, 3).map(({ href, label, icon: Icon, disabled }) =>
          disabled ? (
            <span className="mobile-nav-item nav-disabled" key={label}><Icon /><small>{label}</small></span>
          ) : (
            <Link className={`mobile-nav-item ${pathname === href ? "nav-active" : ""}`} href={href} key={label}>
              <Icon /><small>{label}</small>
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
