import { NextRequest, NextResponse } from "next/server";
import {
  AuthConfigurationError,
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (
    typeof credentials !== "object" ||
    credentials === null ||
    !("email" in credentials) ||
    !("password" in credentials) ||
    typeof credentials.email !== "string" ||
    typeof credentials.password !== "string"
  ) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  try {
    if (!verifyAdminCredentials(credentials.email, credentials.password)) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieName, createSessionToken(), sessionCookieOptions());
    return response;
  } catch (error) {
    if (!(error instanceof AuthConfigurationError)) throw error;
    console.error("Não foi possível autenticar a equipe:", error);
    return NextResponse.json(
      { error: "O acesso administrativo não está configurado." },
      { status: 503 },
    );
  }
}
