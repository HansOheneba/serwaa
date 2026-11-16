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
        a: "Serwaa connects small and medium businesses that need funding to deliver their work with investors who want to earn by backing them. We check every business, agree the terms, and handle the payments in both directions.",
      },
      {
        q: "Who runs Serwaa?",
        a: "Serwaa is owned and operated by Bomevan Group. Bomevan's team checks every business and decides which deals to back. Investor money is held by licensed custodians, not by Bomevan or Serwaa.",
      },
      {
        q: "Who is Serwaa for?",
        a: "Businesses that need funding to fulfil orders, contracts or invoices; individuals who want to invest; and institutions such as funds, banks and family offices.",
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
        a: "Your company registration papers, IDs for your directors and owners, recent accounts and bank statements, and the invoice, order or contract behind the request. We'll tell you exactly what applies to your business.",
      },
      {
        q: "How is my application assessed?",
        a: "Our team checks your documents and finances and looks closely at the deal itself, then our credit team decides. You can see where your application is at any time, and exactly what we still need from you.",
      },
      {
        q: "When do I receive the money?",
        a: "Once your deal is approved, it opens to investors. When enough money has come in, it's released to you along with your repayment dates.",
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
        a: "Anyone eligible under Ghanaian regulation who verifies their identity and tells us where their money comes from. Institutions go through their own checks.",
      },
      {
        q: "How does Serwaa decide what to show me?",
        a: "A short questionnaire asks about your goals, how long you can invest for and how much risk you can take. We show the closest matches first and tell you why each one fits. It's a comparison, not advice.",
      },
      {
        q: "How do I pay?",
        a: "By Mobile Money (MTN MoMo, Telecel Cash, AT Money) or bank transfer, straight to a licensed custodian. We will never ask for your Mobile Money PIN.",
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
        a: "No. Expected returns are what the business has agreed to pay, not a promise that it will. Businesses can repay late or not in full, your money is tied up until the deal ends, and you could lose some or all of it.",
      },
    ],
  },
  {
    title: "Safety and regulation",
    items: [
      {
        q: "Where is my money held?",
        a: "With a licensed custodian, never in Serwaa's own accounts.",
      },
      {
        q: "Is investing available now?",
        a: "Investing opens once we receive approval from Ghana's Securities and Exchange Commission.",
      },
      {
        q: "What happens if a business misses a repayment?",
        a: "We contact the business straight away and work with them to get repayments back on track. You're kept informed throughout, and if the repayment dates have to change, you'll see the new ones.",
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
        intro="How Serwaa works, where your money is held, and what happens when things don't go to plan."
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
