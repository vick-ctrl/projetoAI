import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/db";

export const dynamic = "force-dynamic";

type CoursePageProps = { params: Promise<{ slug: string }> };

export function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const course = getCourse(slug);
    return { title: course?.name ?? "Curso não encontrado" };
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const semesters = [...new Set(course.subjects.map((subject) => subject.semester))];
  return (
    <section className="page-section container">
      <Link className="back-link" href="/cursos">← Todos os cursos</Link>
      <div className="course-detail-intro">
        <p className="eyebrow">{course.area} · {course.duration}</p>
        <h1>{course.name}</h1>
        <p>{course.description}</p>
      </div>
      <div className="curriculum-heading">
        <div><p className="eyebrow">Conheça a formação</p><h2>O que você vai aprender</h2></div>
        <span className="mock-badge">Matriz demonstrativa</span>
      </div>
      <div className="curriculum">
        {semesters.map((semester) => (
          <section className="semester" key={semester}>
            <h3><span>{String(semester).padStart(2, "0")}</span> Semestre</h3>
            <div className="subject-list">
              {course.subjects.filter((subject) => subject.semester === semester).map((subject) => (
                <article className="subject" key={subject.name}>
                  <h4>{subject.name}</h4>
                  <p>{subject.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mock-notice">Conteúdo curricular demonstrativo, não oficial. A matriz definitiva será publicada após validação da coordenação.</p>
    </section>
  );
}
