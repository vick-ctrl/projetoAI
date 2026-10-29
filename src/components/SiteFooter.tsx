import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link aria-label="Sitech, início" className="brand footer-brand" href="/">
          <span className="brand-mark">S</span>
          <span>sitech<span className="brand-dot">.</span></span>
        </Link>
        <p>Conhecimento que abre caminhos.</p>
        <Link href="/admin/login">Área da equipe</Link>
      </div>
    </footer>
  );
}
