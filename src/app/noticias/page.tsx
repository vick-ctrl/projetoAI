import type { Metadata } from "next";
import { NewsCard } from "@/components/NewsCard";
import { getNews } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notícias" };

export default function NewsPage() {
  const news = getNews();
  return (
    <section className="page-section container">
      <div className="page-intro">
        <p className="eyebrow">Acontece por aqui</p>
        <h1>Uma comunidade <span>em movimento.</span></h1>
        <p>Acompanhe as histórias, eventos e novidades da nossa escola.</p>
      </div>
      {news.length ? (
        <div className="news-grid">{news.map((article) => <NewsCard article={article} key={article.id} />)}</div>
      ) : (
        <div className="empty-news"><span>✳</span><p>Nenhuma notícia publicada ainda. Volte em breve!</p></div>
      )}
    </section>
  );
}
