import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { getCourses, getNews } from "@/lib/db";

export const dynamic = "force-dynamic";

const highlights = [
  { number: "01", title: "Aprenda fazendo", text: "Conhecimento conectado com a prática." },
  { number: "02", title: "Construa seu caminho", text: "Formação técnica para novas possibilidades." },
  { number: "03", title: "Faça parte", text: "Uma comunidade que cresce junto." },
];

export default function HomePage() {
  const courses = getCourses();
  const news = getNews(3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span /> Educação técnica, novas possibilidades</p>
            <h1>Seu próximo passo começa <span>aqui.</span></h1>
            <p className="hero-description">
              Aprenda na prática, descubra seus talentos e prepare-se para transformar o seu futuro.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/cursos">Explore os cursos <span>↗</span></Link>
              <Link className="text-link" href="/noticias">Últimas notícias <span>→</span></Link>
            </div>
            <div className="hero-note"><span className="note-icon">✳</span> Formação que acompanha o mundo.</div>
          </div>
          <div aria-label="Ilustração abstrata de formas geométricas" className="hero-art" role="img">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-disc"><span>ideias</span><strong>em<br />movimento</strong></div>
            <span className="art-star star-one">✳</span>
            <span className="art-star star-two">✳</span>
            <span className="art-caption">APRENDER · CRIAR · TRANSFORMAR</span>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>EDUCAÇÃO COM PROPÓSITO</span>
          <Link aria-label="Conheça os destaques" href="#destaques">↓</Link>
          <span>SEU FUTURO EM CONSTRUÇÃO</span>
        </div>
      </section>

      <section className="section container" id="destaques">
        <div className="section-heading">
          <div><p className="eyebrow">Uma escola, muitos caminhos</p><h2>O futuro é feito <span>de escolhas.</span></h2></div>
          <Link className="text-link" href="/cursos">Ver todos os cursos <span>→</span></Link>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article className="highlight-card" key={item.number}>
              <span className="highlight-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="courses-band">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">Conheça as possibilidades</p><h2>Aprender para <span>fazer acontecer.</span></h2></div>
            <Link className="text-link" href="/cursos">Explorar catálogo <span>→</span></Link>
          </div>
          <div className="course-preview-grid">
            {courses.slice(0, 3).map((course, index) => (
              <Link className={`course-preview course-color-${index + 1}`} href={`/cursos/${course.slug}`} key={course.slug}>
                <span className="course-area">{course.area}</span>
                <h3>{course.name}</h3>
                <span className="course-arrow">↗</span>
              </Link>
            ))}
          </div>
          <p className="mock-notice">Matrizes e descrições demonstrativas aguardam validação oficial da coordenação.</p>
        </div>
      </section>

      <section className="section container news-section">
        <div className="section-heading">
          <div><p className="eyebrow">Acontece por aqui</p><h2>Novidades da <span>comunidade.</span></h2></div>
          <Link className="text-link" href="/noticias">Todas as notícias <span>→</span></Link>
        </div>
        {news.length ? (
          <div className="news-grid">{news.map((article) => <NewsCard article={article} key={article.id} />)}</div>
        ) : (
          <div className="empty-news"><span>✳</span><p>As novidades da escola aparecem aqui em breve.</p></div>
        )}
      </section>
    </>
  );
}
