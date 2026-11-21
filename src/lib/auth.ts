import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createAuthClient } from "./supabase/server";
import { db, isDbConfigured } from "./supabase/admin";

/** Returns the signed-in user only if they are listed in public.admins. */
export async function getAdminUser(): Promise<User | null> {
  if (!isDbConfigured()) return null;
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); // verifies the JWT with Supabase Auth
  if (!user) return null;
  const { data } = await db()
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return data ? user : null;
}

/** For admin pages: redirects to the login page unless the visitor is an admin. */
export async function assertAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For API routes: returns a ready 401/403 response, or the admin user. */
export async function requireAdminApi(): Promise<
  { user: User } | { response: NextResponse }
> {
  if (!isDbConfigured()) {
    return {
      response: NextResponse.json({ error: "not_configured" }, { status: 503 }),
    };
  }
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  const { data } = await db()
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) {
    return { response: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { user };
}
