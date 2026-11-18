"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ButtonLink } from "./ui";
import { useWorkspace, type Audience, type Me } from "@/lib/store";

const kindFor: Record<Audience, Me["kind"]> = { business: "business", investor: "investor", institution: "institution", ops: "staff" };
const label: Record<Me["kind"], string> = { business: "business", investor: "investor", institution: "corporate investor", staff: "Serwaa team" };

/** Shows a portal only to someone signed in with that kind of account. */
export function Gate({ audience, children }: { audience: Audience; children: ReactNode }) {
  const ws = useWorkspace();
  const path = usePathname();
  if (!ws.ready)
    return (
      <p className="flex items-center gap-2 py-24 text-sm text-ink-500" role="status">
        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        Loading your account…
      </p>
    );
  if (ws.me?.kind === kindFor[audience]) return children;
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-bold text-aubergine-800">{ws.me ? "This area is for a different account" : "Sign in to continue"}</h1>
      <p className="mt-3 leading-7 text-ink-600">
        {ws.me
          ? `You're signed in as a ${label[ws.me.kind]}. Sign in with a ${label[kindFor[audience]]} account to see this page.`
          : `Sign in with your ${label[kindFor[audience]]} account. We'll email you a link, so there's no password to remember.`}
      </p>
      <ButtonLink href={`/login?next=${encodeURIComponent(path)}`} className="mt-8">
        Sign in
      </ButtonLink>
    </div>
  );
}
