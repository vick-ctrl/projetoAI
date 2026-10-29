import { NextRequest, NextResponse } from "next/server";
import { getDatabase, getNews } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getNews());
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  let article: unknown;
  try {
    article = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (
    typeof article !== "object" ||
    article === null ||
    !("title" in article) ||
    !("excerpt" in article) ||
    !("body" in article) ||
    typeof article.title !== "string" ||
    typeof article.excerpt !== "string" ||
    typeof article.body !== "string"
  ) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  }

  const title = article.title.trim();
  const excerpt = article.excerpt.trim();
  const body = article.body.trim();
  if (!title || !excerpt || !body || title.length > 120 || excerpt.length > 240 || body.length > 10000) {
    return NextResponse.json(
      { error: "Confira os campos: título até 120, resumo até 240 e texto até 10.000 caracteres." },
      { status: 400 },
    );
  }

  const result = getDatabase()
    .prepare("INSERT INTO news (title, excerpt, body) VALUES (?, ?, ?)")
    .run(title, excerpt, body);
  const created = getNews().find((item) => item.id === Number(result.lastInsertRowid));
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    return NextResponse.json({ error: "Identificador de notícia inválido." }, { status: 400 });
  }

  const result = getDatabase().prepare("DELETE FROM news WHERE id = ?").run(id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Notícia não encontrada." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
