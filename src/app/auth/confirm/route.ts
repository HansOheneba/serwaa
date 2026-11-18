import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { db, sessionClient } from "@/lib/server/supabase";

const home = { business: "/business", investor: "/invest", institution: "/institution", staff: "/ops" } as const;

/** The link in a sign-in email lands here: verify it, set the session, open the right portal. */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const token_hash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const next = url.searchParams.get("next");
  const fail = NextResponse.redirect(new URL("/login?error=link", url));
  if (!token_hash) return fail;
  const auth = await sessionClient();
  const { data, error } = await auth.auth.verifyOtp({ token_hash, type });
  if (error || !data.user) return fail;
  const { data: p } = await db().from("profiles").select("kind").eq("id", data.user.id).maybeSingle();
  const dest = next?.startsWith("/") && !next.startsWith("//") ? next : p ? home[p.kind as keyof typeof home] : "/ops";
  return NextResponse.redirect(new URL(dest, url));
}
