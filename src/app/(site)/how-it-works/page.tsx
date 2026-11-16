import type { Metadata } from "next";
import { ButtonLink, Label, MoneyBadge } from "@/components/ui";
import type { MoneyState } from "@/lib/data";

export const metadata: Metadata = { title: "How it works" };

const lifecycle = [
  { phase: "Originate", items: ["Business registers and completes verification", "Application with supporting evidence", "Validation checklist and document checks", "Credit analysis and memorandum", "Risk review and approval by authorised staff"] },
  { phase: "Structure", items: ["Pricing, tenor, fees and security set", "Repayment schedule generated before funding", "Term sheet issued to the business"] },
  { phase: "Raise", items: ["Campaign drafted from the approved terms", "Independent compliance and committee approvals", "Published to eligible, matched investors", "Investors subscribe and pay the custodian"] },
  { phase: "Close", items: ["Final reconciliation of cleared funds", "Closing checklist and disbursement approval", "Custodian releases funds to the business", "Refunds if a campaign does not fund"] },
  { phase: "Service", items: ["Repayments tracked against the schedule", "Distributions to investors by the agreed waterfall", "Arrears, collections and restructuring when needed"] },
];

const states: { state: MoneyState; body: string }[] = [
  { state: "expected", body: "Due later under the agreed schedule. Not money you have." },
  { state: "pending", body: "A payment has started but the provider hasn't confirmed it." },
  { state: "confirmed", body: "The provider confirmed it; the custodian hasn't cleared it yet." },
  { state: "cleared", body: "Held by the custodian and reconciled. Only this counts toward funding." },
  { state: "received", body: "Paid out to you." },
  { state: "overdue", body: "Contractually due and not yet paid." },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-20">
        <Label>How it works</Label>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.025em] text-aubergine-800 text-balance sm:text-5xl">
          One connected record, from first application to final repayment
        </h1>
        <div className="mt-14 grid gap-6 md:grid-cols-5">
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

      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-aubergine-800">Every amount has a label</h2>
          <p className="mt-2 max-w-2xl text-ink-600">Serwaa never adds expected returns to money received. You will see one of these six labels next to every figure.</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
