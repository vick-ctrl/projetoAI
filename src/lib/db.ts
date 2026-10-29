import "server-only";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Course, News } from "@/lib/types";

const databasePath =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "sitech.sqlite");

declare global {
  var sitechDatabase: Database.Database | undefined;
}

function openDatabase() {
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      semester INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const count = database.prepare("SELECT COUNT(*) AS count FROM courses").get() as {
    count: number;
  };
  if (count.count === 0) {
    seedCourses(database);
  }

  return database;
}

function seedCourses(database: Database.Database) {
  const courses: Array<Omit<Course, "subjects">> = [
    {
      slug: "administracao",
      name: "Administração",
      area: "Gestão e negócios",
      description:
        "Conhecimentos para apoiar a gestão de organizações, pessoas, recursos e processos.",
      duration: "3 semestres",
    },
    {
      slug: "desenvolvimento-de-sistemas",
      name: "Desenvolvimento de Sistemas",
      area: "Tecnologia",
      description:
        "Fundamentos para projetar, desenvolver e manter sistemas e aplicações.",
      duration: "3 semestres",
    },
    {
      slug: "enfermagem",
      name: "Enfermagem",
      area: "Saúde",
      description:
        "Formação técnica introdutória para atuação em equipes e serviços de saúde.",
      duration: "4 semestres",
    },
    {
      slug: "mecanica",
      name: "Mecânica",
      area: "Indústria",
      description:
        "Conceitos de processos de fabricação, materiais, desenho e manutenção mecânica.",
      duration: "3 semestres",
    },
  ];
  const insertCourse = database.prepare(
    "INSERT INTO courses (slug, name, area, description, duration) VALUES (?, ?, ?, ?, ?)",
  );
  const insertSubject = database.prepare(
    "INSERT INTO subjects (course_slug, name, description, semester) VALUES (?, ?, ?, ?)",
  );

  const seed = database.transaction(() => {
    for (const course of courses) {
      insertCourse.run(
        course.slug,
        course.name,
        course.area,
        course.description,
        course.duration,
      );
      for (const [index, name] of [
        "Fundamentos da área",
        "Comunicação e trabalho em equipe",
        "Práticas profissionais",
      ].entries()) {
        insertSubject.run(
          course.slug,
          name,
          `Conteúdo demonstrativo de ${name.toLowerCase()}. Consulte a coordenação para a matriz curricular oficial.`,
          index + 1,
        );
      }
    }
  });
  seed();
}

export function getDatabase() {
  globalThis.sitechDatabase ??= openDatabase();
  return globalThis.sitechDatabase;
}

export function getCourses(): Course[] {
  const database = getDatabase();
  const rows = database
    .prepare("SELECT slug, name, area, description, duration FROM courses ORDER BY name")
    .all() as Array<Omit<Course, "subjects">>;
  const subjects = database
    .prepare(
      "SELECT course_slug AS courseSlug, name, description, semester FROM subjects ORDER BY semester, name",
    )
    .all() as Array<{
    courseSlug: string;
    name: string;
    description: string;
    semester: number;
  }>;

  return rows.map((course) => ({
    ...course,
    subjects: subjects
      .filter((subject) => subject.courseSlug === course.slug)
      .map(({ courseSlug: _courseSlug, ...subject }) => subject),
  }));
}

export function getCourse(slug: string): Course | undefined {
  return getCourses().find((course) => course.slug === slug);
}

export function getNews(limit?: number): News[] {
  const database = getDatabase();
  const query = `
    SELECT id, title, excerpt, body, created_at AS createdAt
    FROM news
    ORDER BY created_at DESC, id DESC
    ${limit === undefined ? "" : "LIMIT ?"}
  `;
  const rows =
    limit === undefined
      ? database.prepare(query).all()
      : database.prepare(query).all(limit);
  return rows as News[];
}

export function getNewsById(id: number): News | undefined {
  return getDatabase()
    .prepare(
      `SELECT id, title, excerpt, body, created_at AS createdAt
       FROM news WHERE id = ?`,
    )
    .get(id) as News | undefined;
}
