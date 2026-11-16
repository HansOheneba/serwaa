import Link from "next/link";
import { OpportunityCard } from "@/components/opportunity-card";
import { ButtonLink, Label } from "@/components/ui";
import { opportunities } from "@/lib/data";

const audiences = [
  {
    href: "/businesses",
    title: "For businesses",
    body: "Finance invoices, purchase orders, contracts and working capital. Register once and track every step.",
    cta: "Apply for financing",
  },
  {
    href: "/investors",
    title: "For investors",
    body: "Start from GH₵100. See opportunities matched to your goals, with the reason each one appears.",
    cta: "Explore opportunities",
  },
  {
    href: "/institutions",
    title: "For institutions",
    body: "A verified pipeline matched to your mandate, with data rooms, allocations and consolidated reporting.",
    cta: "Partner with Serwaa",
  },
];

const tracks = [
  {
    step: "1",
    title: "Verify and assess",
    body: "The business completes a five-stage verification. Our credit team analyses its finances and the deal, and people make the decision.",
  },
  {
    step: "2",
    title: "Raise capital",
    body: "Approved deals open as campaigns. Investors subscribe and pay by Mobile Money or bank transfer, straight to a licensed custodian.",
  },
  {
    step: "3",
    title: "Fund and service",
    body: "Once enough money has cleared, funds go to the business. Repayments flow back to investors on the agreed schedule.",
  },
];

const principles = [
  { title: "Custodians hold the money", body: "Investor funds go to a licensed escrow or trust account. Serwaa tracks and reconciles; it never runs a wallet." },
  { title: "Only cleared money counts", body: "Pending payments and interest shown are kept apart. Funding progress counts cleared funds only." },
  { title: "People decide", body: "Software reads documents and drafts analysis. Credit approvals, fund releases and defaults stay with authorised staff." },
  { title: "Every match explained", body: "Each opportunity shows why it appears for you. Matching is factual, never advice." },
];

const products = [
  "Invoice financing",
  "Purchase order financing",
  "Contract financing",
  "Working capital",
  "Inventory financing",
  "Equipment financing",
  "Receivables financing",
  "Revenue-based financing",
  "Asset-backed financing",
  "Structured SME debt",
  "Supply chain financing",
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <Label>Private credit platform</Label>
            <h1 className="mt-4 text-5xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance sm:text-6xl">
              Private credit, verified.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">
              Serwaa connects growing businesses that need financing with investors who want access to private credit. Every business is
              verified, every deal is assessed by people, and investor money stays with licensed custodians.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/businesses">Apply for financing</ButtonLink>
              <ButtonLink href="/investors" variant="secondary">
                Explore opportunities
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-0 rounded-3xl bg-aubergine-50" aria-hidden="true" />
            <div className="relative">
              <OpportunityCard o={opportunities[0]} anonymous />
              <p className="mt-3 text-center text-xs text-ink-500">Illustrative opportunity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-8 md:grid-cols-3">
          {audiences.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-aubergine-500"
            >
              <h2 className="text-xl font-bold text-aubergine-800">{a.title}</h2>
              <p className="mt-2 flex-1 leading-7 text-ink-600">{a.body}</p>
              <span className="mt-6 text-sm font-semibold text-aubergine-500 group-hover:underline">{a.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <div className="max-w-2xl">
            <Label>How a deal moves</Label>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-aubergine-800 text-balance">From application to repayment, in one system</h2>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {tracks.map((t) => (
              <li key={t.step} className="border-t-2 border-aubergine-800 pt-5">
                <span className="font-mono text-sm text-saffron-700">{t.step}</span>
                <h3 className="mt-2 text-xl font-bold text-aubergine-800">{t.title}</h3>
                <p className="mt-2 leading-7 text-ink-600">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-aubergine-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance">Built on controls, not promises</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="mt-1.5 h-4 w-4 shrink-0 bg-saffron-500" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 leading-7 text-aubergine-100">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <Label>Financing that fits the trade</Label>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-aubergine-800 text-balance">
            Structures for how businesses actually earn
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {products.map((p) => (
              <li key={p} className="rounded-full bg-aubergine-50 px-4 py-2 text-sm font-semibold text-aubergine-700">
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-saffron-500 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-aubergine-900">Ready to start?</h2>
              <p className="mt-1 text-aubergine-900/80">Create an account to apply for financing or to start investing.</p>
            </div>
            <ButtonLink href="/login">Get started</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
