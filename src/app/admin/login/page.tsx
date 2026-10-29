"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Não foi possível entrar.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="admin-page container">
      <div className="admin-card">
        <Link className="back-link" href="/">← Voltar ao site</Link>
        <p className="eyebrow">Área restrita</p>
        <h1>Olá, equipe.</h1>
        <p>Acesse para compartilhar as novidades da escola.</p>
        <form className="admin-form" onSubmit={submit}>
          <label htmlFor="email">E-mail</label>
          <input autoComplete="username" id="email" name="email" required type="email" />
          <label htmlFor="password">Senha</label>
          <input autoComplete="current-password" id="password" name="password" required type="password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={pending} type="submit">
            {pending ? "Entrando..." : "Entrar"} <span>→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
