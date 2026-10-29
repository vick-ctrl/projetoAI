"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { News } from "@/lib/types";

export default function AdminDashboard({ initialNews }: { initialNews: News[] }) {
  const router = useRouter();
  const [news, setNews] = useState(initialNews);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          excerpt: form.get("excerpt"),
          body: form.get("body"),
        }),
      });
      const result = (await response.json()) as News | { error: string };
      if (!response.ok || !("id" in result)) {
        setError("error" in result ? result.error : "Não foi possível publicar a notícia.");
        return;
      }
      setNews((current) => [result, ...current]);
      formElement.reset();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  async function removeArticle(id: number) {
    if (!window.confirm("Deseja excluir esta notícia?")) return;
    setError("");
    try {
      const response = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        setError(result.error ?? "Não foi possível excluir a notícia.");
        return;
      }
      setNews((current) => current.filter((article) => article.id !== id));
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }

  return (
    <section className="admin-dashboard container">
      <div className="dashboard-heading">
        <div><p className="eyebrow">Área da equipe</p><h1>Notícias da escola</h1></div>
        <button className="button button-outline" onClick={logout} type="button">Sair <span>↗</span></button>
      </div>
      <div className="dashboard-grid">
        <form className="admin-form publish-form" onSubmit={publish}>
          <div><p className="eyebrow">Compartilhe com a comunidade</p><h2>Nova notícia</h2></div>
          <label htmlFor="title">Título</label>
          <input id="title" maxLength={120} name="title" required />
          <label htmlFor="excerpt">Resumo</label>
          <textarea id="excerpt" maxLength={240} name="excerpt" required rows={3} />
          <label htmlFor="body">Texto da notícia</label>
          <textarea id="body" maxLength={10000} name="body" required rows={7} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={pending} type="submit">
            {pending ? "Publicando..." : "Publicar notícia"} <span>→</span>
          </button>
        </form>
        <div className="dashboard-news">
          <div><p className="eyebrow">Publicadas</p><h2>Últimas notícias <span>({news.length})</span></h2></div>
          {news.length ? news.map((article) => (
            <article className="managed-news" key={article.id}>
              <div><h3>{article.title}</h3><p>{article.excerpt}</p></div>
              <button aria-label={`Excluir ${article.title}`} className="delete-button" onClick={() => removeArticle(article.id)} type="button">Excluir</button>
            </article>
          )) : <p className="admin-empty">Você ainda não publicou notícias.</p>}
        </div>
      </div>
    </section>
  );
}
