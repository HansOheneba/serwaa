"use client";

import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ButtonLink } from "./ui";
import { DEMO } from "@/lib/demo";
import { enterDemo, leaveDemo, useAccount, useWorkspace, type Audience, type Me } from "@/lib/store";

const kindFor: Record<Audience, Me["kind"]> = { business: "business", investor: "investor", institution: "institution", ops: "staff" };
const label: Record<Me["kind"], string> = { business: "business", investor: "investor", institution: "corporate investor", staff: "Serwaa team" };
const signUp: Record<Audience, string> = { business: "/onboarding?as=business", investor: "/onboarding?as=investor", institution: "/onboarding?as=institution", ops: "/login" };

function Loading() {
  return (
    <p className="flex items-center gap-2 py-24 text-sm text-ink-500" role="status">
      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      Loading your account…
    </p>
  );
}

/** Shows a portal to someone signed in with that kind of account, or a demo account to visitors. */
export function Gate({ audience, children }: { audience: Audience; children: ReactNode }) {
  const account = useAccount();
  const ws = useWorkspace();
  const path = usePathname();
  const showDemo = DEMO && account.ready && !account.me;

  useEffect(() => {
    if (!showDemo) return;
    enterDemo(audience);
    return leaveDemo;
  }, [showDemo, audience]);

  if (!account.ready) return <Loading />;
  if (account.me?.kind === kindFor[audience]) return children;
  if (showDemo) {
    if (ws.me?.kind !== kindFor[audience]) return <Loading />;
    return (
      <>
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-saffron-50 px-5 py-4 text-sm text-saffron-900 ring-1 ring-saffron-200">
          <Sparkles className="size-4 shrink-0" aria-hidden="true" />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">You&apos;re looking at a demo account.</span> Explore freely. Nothing here is real, and nothing you do is saved.
          </p>
          <span className="flex gap-4 font-semibold">
            <Link href={signUp[audience]} className="underline">
              {audience === "ops" ? "Team sign-in" : "Create your account"}
            </Link>
            {audience !== "ops" && (
              <Link href={`/login?next=${encodeURIComponent(path)}`} className="underline">
                Sign in
              </Link>
            )}
          </span>
        </div>
        {children}
      </>
    );
  }
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-bold text-aubergine-800">{account.me ? "This area is for a different account" : "Sign in to continue"}</h1>
      <p className="mt-3 leading-7 text-ink-600">
        {account.me
          ? `You're signed in as a ${label[account.me.kind]}. Sign in with a ${label[kindFor[audience]]} account to see this page.`
          : `Sign in with your ${label[kindFor[audience]]} account. We'll email you a link, so there's no password to remember.`}
      </p>
      <ButtonLink href={`/login?next=${encodeURIComponent(path)}`} className="mt-8">
        Sign in
      </ButtonLink>
    </div>
  );
}
