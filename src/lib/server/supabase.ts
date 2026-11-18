import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

let adminClient: SupabaseClient | null = null;

/** Full database access. Only ever used on the server, after checking who is asking. */
export function db() {
  adminClient ??= createClient(url, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  return adminClient;
}

/** Reads and refreshes the signed-in person's session cookie. */
export async function sessionClient() {
  const store = await cookies();
  return createServerClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* called while rendering: the session refreshes on the next action instead */
        }
      },
    },
  });
}
