import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { getNews } from "@/lib/db";
import { isAuthenticatedToken, sessionCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!isAuthenticatedToken(token)) redirect("/admin/login");
  return <AdminDashboard initialNews={getNews()} />;
}
