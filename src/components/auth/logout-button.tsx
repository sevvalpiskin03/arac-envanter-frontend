"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function logout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <button className="logout-button" type="button" onClick={logout} disabled={isSubmitting}>
      {isSubmitting ? "Çıkılıyor…" : "Çıkış Yap"}
    </button>
  );
}
