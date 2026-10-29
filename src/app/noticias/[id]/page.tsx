import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/db";

export const dynamic = "force-dynamic";

type NewsDetailProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const { id } = await params;
  const article = getNewsById(Number(id));
  return { title: article?.title ?? "Notícia não encontrada" };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isSafeInteger(articleId) || articleId < 1) notFound();

  const article = getNewsById(articleId);
  if (!article) notFound();

  const date = new Date(`${article.createdAt.replace(" ", "T")}Z`);
  return (
    <article className="page-section container news-detail">
      <Link className="back-link" href="/noticias">← Todas as notícias</Link>
      <p className="eyebrow">
        Notícia da escola ·{" "}
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date)}
        </time>
      </p>
      <h1>{article.title}</h1>
      <p className="news-detail-excerpt">{article.excerpt}</p>
      <div className="news-detail-body">{article.body}</div>
    </article>
  );
}
