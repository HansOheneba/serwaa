"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "./ui";
import { requestSignIn } from "@/lib/actions";

const field =
  "mt-1.5 w-full rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

/** Passwordless: we email a one-time link that opens the right portal. */
export function SignInForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState("");
  const [error, setError] = useState(params.get("error") === "link" ? "That link has expired or was already used. Send yourself a new one." : "");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await requestSignIn(email);
    setBusy(false);
    if (r.ok) setSent(r.message);
    else setError(r.message);
  }

  if (sent)
    return (
      <div className="rounded-2xl bg-aubergine-50 p-6 text-center" role="status">
        <MailCheck className="mx-auto size-9 text-aubergine-800" aria-hidden="true" />
        <p className="mt-4 font-semibold text-aubergine-800">Check your inbox</p>
        <p className="mt-2 text-sm leading-6 text-ink-700">{sent}</p>
        <button type="button" onClick={() => setSent("")} className="mt-4 text-sm font-semibold text-aubergine-500 hover:underline">
          Use a different email
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-semibold text-ink-800">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          placeholder="you@company.com"
        />
      </label>
      {error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-600" role="alert">
          {error}{" "}
          {/find an account/.test(error) && (
            <Link href="/onboarding" className="underline">
              Create an account
            </Link>
          )}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Sending…" : "Email me a sign-in link"}
      </Button>
      <p className="text-center text-xs text-ink-500">No password needed. The link works once and expires in an hour.</p>
    </form>
  );
}
