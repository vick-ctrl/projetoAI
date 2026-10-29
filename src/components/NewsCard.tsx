import type { News } from "@/lib/types";
import Link from "next/link";

export function NewsCard({ article }: { article: News }) {
  const date = new Date(`${article.createdAt.replace(" ", "T")}Z`);
  return (
    <Link className="news-card" href={`/noticias/${article.id}`}>
      <div className="news-card-top">
        <span className="eyebrow">Notícias da escola</span>
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date)}
        </time>
      </div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
    </Link>
  );
}
