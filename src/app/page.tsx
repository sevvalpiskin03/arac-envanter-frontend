import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();

  if (cookieStore.has("vehicle_admin_token")) {
    redirect("/dashboard");
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-title">
        <aside className="login-brand-panel">
          <div className="brand-lockup">
            <span className="brand-icon" aria-hidden="true">
              FY
            </span>
            <span>
              <strong>Filo Yönetimi</strong>
              <small>Araç ve bakım takibi</small>
            </span>
          </div>

          <div className="brand-message">
            <span className="eyebrow">İşletmeniz için tek panel</span>
            <h1>Araçlarınızın kontrolü her zaman sizde.</h1>
            <p>
              Envanter, kilometre, bakım ve tamir kayıtlarını düzenli ve güvenli
              biçimde yönetin.
            </p>
          </div>

          <div className="brand-feature-list" aria-label="Sistem özellikleri">
            <span>Güvenli admin erişimi</span>
            <span>Kilometre bazlı bakım takibi</span>
            <span>Türkçe ve kolay kullanım</span>
          </div>
        </aside>

        <section className="login-form-panel">
          <div className="mobile-brand">
            <span className="brand-icon" aria-hidden="true">
              FY
            </span>
            <strong>Filo Yönetimi</strong>
          </div>
          <div className="login-copy">
            <span className="eyebrow">Yönetim paneli</span>
            <h2 id="login-title">Tekrar hoş geldiniz</h2>
            <p>Devam etmek için admin hesabınızla giriş yapın.</p>
          </div>
          <LoginForm />
          <p className="login-security-note">
            Bu alan yalnızca yetkili çalışanların kullanımına açıktır.
          </p>
        </section>
      </section>
    </main>
  );
}
