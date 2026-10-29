import type { Metadata } from "next";
import Link from "next/link";
import { getCourses } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cursos técnicos" };

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <section className="page-section container">
      <div className="page-intro">
        <p className="eyebrow">Encontre seu caminho</p>
        <h1>Conhecimento para <span>ir mais longe.</span></h1>
        <p>Explore áreas de formação, conheça as disciplinas e imagine onde sua curiosidade pode chegar.</p>
      </div>
      <div className="catalog-grid">
        {courses.map((course, index) => (
          <Link className={`catalog-card course-color-${(index % 3) + 1}`} href={`/cursos/${course.slug}`} key={course.slug}>
            <span className="course-area">{course.area}</span>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <span className="catalog-meta">{course.duration} <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </div>
      <p className="mock-notice">Os cursos e componentes curriculares exibidos são conteúdo provisório. Confirme a oferta e a matriz oficial com a coordenação.</p>
    </section>
  );
}
