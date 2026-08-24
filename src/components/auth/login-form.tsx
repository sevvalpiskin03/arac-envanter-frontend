"use client";

import { AlertCircle, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(result.message ?? "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı. Lütfen kısa süre sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="email">E-posta adresi</label>
        <div className="input-wrap">
          <Mail aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@firma.com"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="password">Şifre</label>
        <div className="input-wrap">
          <LockKeyhole aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Şifrenizi girin"
            minLength={8}
            required
          />
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </div>
      </div>

      {error ? (
        <p className="login-error" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}

      <button className="login-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            Giriş yapılıyor
          </>
        ) : (
          "Giriş Yap"
        )}
      </button>
    </form>
  );
}
