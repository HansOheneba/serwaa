import type { Metadata } from "next";
import { ContentHero, ContentSection, InfoCard } from "@/components/content";
import { CustodyIllustration, VerifyIllustration } from "@/components/illustrations";
import { ButtonLink, MoneyBadge } from "@/components/ui";
import type { MoneyState } from "@/lib/data";

export const metadata: Metadata = { title: "Protection and risk" };

const checks = [
  { title: "Who the business is", body: "That it's properly registered, where it operates and what it does." },
  { title: "Who owns and runs it", body: "Every director and every owner, checked individually against their ID." },
  { title: "Its company papers", body: "Registration, licences and permits, checked against official records where possible." },
  { title: "How it's doing", body: "Accounts and bank statements, to see whether it can genuinely repay." },
  { title: "The deal itself", body: "The invoice, order or contract behind the request, and the customer who will pay it." },
];

const promises = [
  { title: "Your money isn't held by us", body: "Investor money sits with a licensed custodian. Serwaa never holds it, pools it or lends it out." },
  { title: "Experienced people decide", body: "Every financing decision is made by our credit team, not left to an algorithm." },
  { title: "No one approves their own deal", body: "The person who brings in a deal can never be the one who signs it off." },
  { title: "Terms are fixed and visible", body: "The price, fees and repayment dates are agreed and shown to both sides before anyone commits." },
  { title: "You see why a deal suits you", body: "Each opportunity tells you which of your goals it meets and which it doesn't. The decision stays yours." },
  { title: "Your details stay private", body: "Your personal and financial information is protected and only seen by the people who need it." },
];

const outcomes = [
  { title: "Fully funded", body: "The money is released to the business and repayments begin on the agreed dates." },
  { title: "Partly funded", body: "The deal only goes ahead at a smaller size if that was agreed in advance. Otherwise everyone is refunded." },
  { title: "Not funded", body: "The deal is cancelled and every investor gets their money back." },
  { title: "Oversubscribed", body: "Extra money isn't kept. Places are shared out under published rules and the rest is refunded." },
  { title: "Withdrawn", body: "If a deal is withdrawn, investors are told why and refunded." },
];

const states: { state: MoneyState; body: string }[] = [
  { state: "expected", body: "Still to come, on the agreed date." },
  { state: "pending", body: "You've paid, and we're waiting for it to arrive." },
  { state: "confirmed", body: "Your payment went through and is on its way." },
  { state: "cleared", body: "Safely with the custodian." },
  { state: "received", body: "Paid out to you." },
  { state: "overdue", body: "Late, and we're following it up." },
];

const risks = [
  { title: "You can lose money", body: "A business may repay late, repay only part, or not repay at all. You could lose some or all of what you invest." },
  { title: "Your money is tied up", body: "You generally can't take your money out before the investment ends." },
  { title: "Returns are not guaranteed", body: "Expected returns are what the business has agreed to pay, not a promise that it will." },
  { title: "Don't put it all in one place", body: "Spreading your money across businesses and sectors lowers your risk. We'll warn you if you're putting too much in one." },
];

export default function ProtectionPage() {
  return (
    <>
      <ContentHero
        eyebrow="Protection and risk"
        title="How Serwaa protects businesses and investors"
        intro="Where your money goes, how we check every business, what happens if a deal doesn't fill, and the risks to understand before you invest."
      >
        <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
          <ButtonLink href="#custody" variant="outlined">Where the money goes</ButtonLink>
          <ButtonLink href="#verification" variant="outlined">How businesses are checked</ButtonLink>
          <ButtonLink href="#risks" variant="outlined">Risks of investing</ButtonLink>
        </div>
      </ContentHero>

      <ContentSection
        id="custody"
        tone="tint"
        eyebrow="Your money"
        title="Your money never sits with Serwaa"
        lead="When you invest, you pay a licensed custodian directly, by Mobile Money or bank transfer. We never hold, pool or lend out investor money, and you can always see exactly where yours stands."
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal className="flex justify-center rounded-3xl bg-white p-8 ring-1 ring-ink-200">
            <CustodyIllustration className="h-56 w-auto" />
          </div>
          <div data-reveal-stagger className="grid gap-5 sm:grid-cols-2">
            {states.map((s) => (
              <div key={s.state} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <MoneyBadge state={s.state} />
                <p className="mt-3 text-sm leading-6 text-ink-700">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 text-sm leading-6 text-ink-600">We will never ask for your Mobile Money PIN.</p>
      </ContentSection>

      <ContentSection
        id="verification"
        eyebrow="Every business"
        title="Five things we check before a business can raise a cedi"
        lead="Investors only ever see businesses that have passed every check."
      >
        <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ol data-reveal-stagger className="grid gap-4">
            {checks.map((k, i) => (
              <li key={k.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <span className="font-mono text-sm text-saffron-700">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-bold text-aubergine-800">{k.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">{k.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-reveal className="flex justify-center rounded-3xl bg-ink-50 p-8 lg:sticky lg:top-28">
            <VerifyIllustration className="h-48 w-auto" />
          </div>
        </div>
      </ContentSection>

      <ContentSection tone="dark" eyebrow="What you can count on" title="Six promises we hold ourselves to">
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((p) => (
            <InfoCard key={p.title} tone="dark" title={p.title} body={p.body} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="campaigns"
        eyebrow="When a deal closes"
        title="What happens to your money in every case"
        lead="When a deal stops taking money, one of five things happens, and you're told which."
      >
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {outcomes.map((o) => (
            <InfoCard key={o.title} {...o} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="risks"
        tone="tint"
        eyebrow="Before you invest"
        title="The risks you should know about"
        lead="Lending to growing businesses can earn steady returns, but it isn't a savings account. Please read this before you invest."
      >
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {risks.map((r) => (
            <div key={r.title} className="rounded-2xl bg-white p-6 ring-1 ring-danger-600/20">
              <p className="font-bold text-danger-600">{r.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink-700">{r.body}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Regulation"
        title="Investing opens once we're approved"
        lead="Investing on Serwaa opens once we receive approval from Ghana's Securities and Exchange Commission. Serwaa is owned and operated by Bomevan Group."
      >
        <ButtonLink href="/faq">Read the FAQs</ButtonLink>
      </ContentSection>
    </>
  );
}
