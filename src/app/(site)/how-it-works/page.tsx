import type { Metadata } from "next";
import { BridgeIllustration } from "@/components/illustrations";
import { ContentSection, InfoCard } from "@/components/content";
import { ButtonLink, Label, MoneyBadge } from "@/components/ui";
import type { MoneyState } from "@/lib/data";

export const metadata: Metadata = { title: "How it works" };

const lifecycle = [
  {
    phase: "Apply",
    items: [
      "Register and verify your business",
      "Apply with the invoice, order or contract behind the deal",
      "Our team reviews your documents and finances",
      "Our credit team decides whether to back it",
    ],
  },
  { phase: "Agree terms", items: ["We set the price, fees and repayment dates with you", "You see every repayment date before anything goes live"] },
  { phase: "Get funded", items: ["Your deal opens to investors", "Investors fund it from their phone or by bank transfer", "Their money waits with a licensed custodian"] },
  { phase: "Receive the money", items: ["When enough has come in, the money is released to you", "If not enough comes in, every investor is refunded"] },
  { phase: "Repay", items: ["You repay on the agreed dates", "Investors receive their share of each repayment", "If a payment slips, we work with you to get back on track"] },
];

const states: { state: MoneyState; body: string }[] = [
  { state: "expected", body: "Still to come, on the agreed date." },
  { state: "pending", body: "You've paid, and we're waiting for it to arrive." },
  { state: "confirmed", body: "Your payment went through and is on its way." },
  { state: "cleared", body: "Safely with the custodian. Only this counts towards a deal." },
  { state: "received", body: "Paid out to you." },
  { state: "overdue", body: "Late, and we're following it up." },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Label>How it works</Label>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.025em] text-aubergine-800 text-balance sm:text-5xl">
              From application to repayment, here&apos;s what happens
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-600">
              Businesses get the money to deliver the work they&apos;ve won. Investors earn from backing them. We handle the checks, the terms and the
              payments in between.
            </p>
          </div>
          <BridgeIllustration className="h-auto w-full" />
        </div>
        <div data-reveal-stagger className="mt-14 grid gap-6 md:grid-cols-5">
          {lifecycle.map((l, i) => (
            <div key={l.phase} className="rounded-2xl bg-ink-50 p-5 ring-1 ring-ink-100">
              <p className="font-mono text-xs text-saffron-700">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-lg font-bold text-aubergine-800">{l.phase}</h2>
              <ul className="mt-3 space-y-2">
                {l.items.map((it) => (
                  <li key={it} className="text-sm leading-6 text-ink-600">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ContentSection
        tone="dark"
        eyebrow="How deals are chosen"
        title="Every deal is judged by people who understand credit"
        lead="A deal is only offered to investors once our credit team is satisfied with three things."
      >
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-3">
          <InfoCard tone="dark" title="The business" body="Is it well run, honestly owned and making money? We look at its accounts, bank statements and the people behind it." />
          <InfoCard tone="dark" title="The deal" body="Is the customer good for the money, and is the repayment date realistic? Two requests from the same business can get different answers." />
          <InfoCard tone="dark" title="The investor" body="Does it suit what you've told us you can afford to put at risk? Your appetite for risk is judged on its own, apart from the business." />
        </div>
      </ContentSection>

      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <h2 data-reveal className="text-2xl font-bold tracking-tight text-aubergine-800">
            Always know where your money is
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Money you&apos;re owed and money you&apos;ve been paid are never added together. Every amount carries one of these labels.
          </p>
          <dl data-reveal-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((s) => (
              <div key={s.state} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <dt>
                  <MoneyBadge state={s.state} />
                </dt>
                <dd className="mt-3 text-sm leading-6 text-ink-700">{s.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <ButtonLink href="/onboarding">Get started</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
