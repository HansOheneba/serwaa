import type { Metadata } from "next";
import Link from "next/link";
import { ContentHero } from "@/components/content";

export const metadata: Metadata = { title: "Questions" };

const groups: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "About Serwaa",
    items: [
      {
        q: "What is Serwaa?",
        a: "Serwaa is a private credit platform. It connects small and medium businesses that need financing with individual and institutional investors who want access to private credit, and gives one team a single system to verify, assess, structure, fund and service every deal.",
      },
      {
        q: "Who runs Serwaa?",
        a: "Serwaa is owned and operated by Bomevan Group. Bomevan's team runs verification, credit assessment, structuring, campaigns and servicing on the platform, while investor money is held by licensed custodians.",
      },
      {
        q: "Who is Serwaa for?",
        a: "Businesses seeking financing for invoices, purchase orders, contracts, working capital and more; individual investors; and institutions such as private credit funds, banks, development finance institutions, family offices and corporate investors.",
      },
      {
        q: "Which sectors do you finance?",
        a: "Any legitimate business with real orders, contracts or customers: trade and distribution, manufacturing, construction, services, healthcare, logistics, energy, agriculture and more. We assess each deal on its own merits.",
      },
    ],
  },
  {
    title: "For businesses",
    items: [
      {
        q: "How do I apply?",
        a: (
          <>
            <Link href="/onboarding?as=business" className="font-semibold text-aubergine-500 underline">
              Create a business account
            </Link>
            , complete the five-stage verification, then apply for the structure that fits your deal. Most businesses apply with an invoice, purchase order or contract they already hold.
          </>
        ),
      },
      {
        q: "What documents will I need?",
        a: "Company registration documents, IDs for directors and shareholders, recent financial statements and bank statements, and commercial evidence for the deal, such as the invoice, purchase order or contract. The exact list adapts to your company type, industry and the financing you ask for.",
      },
      {
        q: "How is my application assessed?",
        a: "It moves through twelve stages, each with a named officer: screening, document and ownership verification, compliance review, financial and commercial analysis, credit assessment, risk review, committee where required, structuring and final approval. Software prepares the analysis; authorised people make the decision.",
      },
      {
        q: "When do I receive the money?",
        a: "After your deal is approved, it opens to investors as a campaign. Once enough cleared money is raised and the closing checklist is complete, the custodian releases funds to you, with your repayment schedule.",
      },
    ],
  },
  {
    title: "For investors",
    items: [
      {
        q: "How much do I need to start?",
        a: "The proposed minimum is GH₵100 per opportunity, subject to regulation. Some opportunities may set a higher minimum.",
      },
      {
        q: "Who can invest?",
        a: "Eligible individuals and institutions who complete identity verification, screening and a source-of-funds declaration. Eligibility, classification and limits depend on regulation and your jurisdiction.",
      },
      {
        q: "How does Serwaa decide what to show me?",
        a: "A short questionnaire covers your finances, objectives, preferences, experience and risk tolerance. Serwaa ranks opportunities by how well they fit and explains which preferences each one meets and doesn't. It's a factual comparison, not advice.",
      },
      {
        q: "How do I pay?",
        a: "By Mobile Money (MTN MoMo, Telecel Cash, AT Money) or bank transfer, directly to a licensed custodian using a unique reference. Serwaa never asks for your Mobile Money PIN.",
      },
      {
        q: "What if a campaign doesn't raise enough?",
        a: (
          <>
            If it doesn&apos;t reach its minimum, it&apos;s cancelled and the custodian refunds you. Partial funding never proceeds automatically.{" "}
            <Link href="/protection#campaigns" className="font-semibold text-aubergine-500 underline">
              See all campaign outcomes
            </Link>
            .
          </>
        ),
      },
      {
        q: "Are returns guaranteed?",
        a: "No. Expected returns are targets based on the agreed terms. Businesses can repay late or not in full, private credit is illiquid, and you could lose some or all of your money.",
      },
    ],
  },
  {
    title: "Safety and regulation",
    items: [
      {
        q: "Where is my money held?",
        a: "With a licensed custodian, bank or payment partner in an escrow or trust arrangement, never in Serwaa's own accounts. Only cleared funds count toward a campaign.",
      },
      {
        q: "Is investing available now?",
        a: "Regulated investment features open only after approval and licensing from Ghana's Securities and Exchange Commission. Until then they stay switched off.",
      },
      {
        q: "What happens if a business misses a repayment?",
        a: "The missed payment is flagged at once and investors are told under set rules. A collections team follows up and records every contact. Any restructuring is approved and documented, keeps the original schedule on record, and is shared with investors. Only authorised people can declare a default.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <ContentHero
        eyebrow="Questions"
        title="Everything you need to know about Serwaa"
        intro="How Serwaa works for businesses and investors, where the money is held, and what happens when things don't go to plan."
      />
      <section className="bg-white pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="Question topics" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {groups.map((g) => (
                <li key={g.title}>
                  <a href={`#${g.title.toLowerCase().replace(/\W+/g, "-")}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-aubergine-50 hover:text-aubergine-800">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g.title} id={g.title.toLowerCase().replace(/\W+/g, "-")} className="scroll-mt-28">
                <h2 data-reveal className="text-2xl font-extrabold tracking-[-0.02em] text-aubergine-800">
                  {g.title}
                </h2>
                <div data-reveal-stagger className="mt-5 divide-y divide-ink-200 border-y border-ink-200">
                  {g.items.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-ink-900 marker:hidden hover:text-aubergine-700">
                        {item.q}
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-aubergine-50 text-aubergine-700 transition-transform duration-200 group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <div className="max-w-3xl pb-6 leading-7 text-ink-700">{item.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
