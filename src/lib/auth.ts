import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const sessionCookieName = "sitech_session";
const sessionDurationSeconds = 60 * 60 * 8;

export class AuthConfigurationError extends Error {}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new AuthConfigurationError("SESSION_SECRET deve ter pelo menos 32 caracteres.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) {
    throw new AuthConfigurationError("Configure ADMIN_EMAIL e ADMIN_PASSWORD para habilitar o login.");
  }
  if (email.length > 254 || password.length > 256) return false;

  const submittedEmail = Buffer.from(email.trim().toLowerCase());
  const configuredEmail = Buffer.from(expectedEmail.trim().toLowerCase());
  const submittedPassword = createHmac("sha256", "sitech-credential-check")
    .update(password)
    .digest();
  const configuredPassword = createHmac("sha256", "sitech-credential-check")
    .update(expectedPassword)
    .digest();

  return (
    submittedEmail.length === configuredEmail.length &&
    timingSafeEqual(submittedEmail, configuredEmail) &&
    timingSafeEqual(submittedPassword, configuredPassword)
  );
}

export function createSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDurationSeconds;
  const payload = Buffer.from(String(expiresAt)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isAuthenticated(request: NextRequest) {
  return isAuthenticatedToken(request.cookies.get(sessionCookieName)?.value);
}

export function isAuthenticatedToken(token: string | undefined) {
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }
  const expiresAt = Number(Buffer.from(payload, "base64url").toString("utf8"));
  return Number.isSafeInteger(expiresAt) && expiresAt > Date.now() / 1000;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationSeconds,
  };
}
