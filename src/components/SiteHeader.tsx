import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link aria-label="Sitech, início" className="brand" href="/">
          <span className="brand-mark">S</span>
          <span>sitech<span className="brand-dot">.</span></span>
        </Link>
        <nav aria-label="Navegação principal" className="main-nav">
          <Link href="/cursos">Cursos</Link>
          <Link href="/noticias">Notícias</Link>
        </nav>
        <Link className="header-cta" href="/cursos">
          Encontre seu curso <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
