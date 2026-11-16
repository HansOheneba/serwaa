import type { Metadata } from "next";
import Link from "next/link";
import { Label } from "@/components/ui";

export const metadata: Metadata = { title: "Log in" };

const accounts = [
  { href: "/business", title: "Business", who: "Sample Agro Processing Ltd", body: "Verification, applications, information requests and repayments." },
  { href: "/invest", title: "Individual investor", who: "Demo investor", body: "Profile, matched opportunities, subscriptions and portfolio." },
  { href: "/ops", title: "Operations team", who: "Credit analyst", body: "Application queue, credit review, campaigns and reconciliation." },
];

export default function LoginPage() {
  return (
    <section className="bg-ink-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:py-24">
        <Label>Demo access</Label>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.025em] text-aubergine-800">Choose an account</h1>
        <p className="mt-3 max-w-xl text-ink-600">
          This prototype has no sign-in yet. Pick a sample account to explore that portal. Everything you see is example data.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {accounts.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-aubergine-500"
            >
              <p className="text-xs font-semibold text-ink-500">{a.who}</p>
              <h2 className="mt-1 text-xl font-bold text-aubergine-800">{a.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-600">{a.body}</p>
              <span className="mt-6 text-sm font-semibold text-aubergine-500 group-hover:underline">Continue →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
