import type { Metadata } from "next";
import { ContentHero, ContentSection, InfoCard } from "@/components/content";
import { CustodyIllustration, VerifyIllustration } from "@/components/illustrations";
import { ButtonLink, MoneyBadge } from "@/components/ui";
import type { MoneyState } from "@/lib/data";

export const metadata: Metadata = { title: "Protection and risk" };

const kyb = [
  { title: "1. Business identity", body: "Registered name and number, incorporation date, business type, addresses, industry, activity, website and tax details." },
  { title: "2. Ownership and management", body: "Directors, shareholders and their percentages, beneficial owners, representatives, senior managers, and related, parent or subsidiary companies." },
  { title: "3. Corporate documents", body: "Certificate of incorporation, constitution, registry extract, ownership declaration, director and shareholder IDs, tax registration, permits and licences." },
  { title: "4. Financial documents", body: "Audited and management accounts, bank statements, tax returns, existing loans, receivables and payables reports, sales records and forecasts." },
  { title: "5. Commercial evidence", body: "Contracts, purchase orders, invoices, delivery notes, receivables schedules, payment records, offtake and insurance documents." },
];

const principles = [
  { title: "Licensed partners hold the money", body: "Investor funds go straight to a custodian-controlled escrow or trust account. Serwaa tracks, instructs and reconciles; it never holds funds or runs a wallet." },
  { title: "People decide, software assists", body: "Software reads documents, analyses and drafts. Credit approvals, fund releases and default decisions are made by authorised people." },
  { title: "Only cleared money counts", body: "Interest shown, pending subscriptions and pending payments are kept apart and never counted as funding." },
  { title: "Every match explained", body: "Each opportunity shows why it appears for you. Until regulators permit otherwise, matching is factual and preference-based, never advice." },
  { title: "Enter once, reuse everywhere", body: "Profiles, documents and terms are captured once and carried through every later stage, so nothing is re-typed or lost." },
  { title: "Configured, not hard-coded", body: "Products, document rules, workflows, fees and taxes are configuration. Regulatory limits are locked against override." },
  { title: "The true state of returns", body: "Expected, accrued, due, received and overdue amounts are always labelled and never blended." },
  { title: "Every decision leaves a trace", body: "Sensitive actions record who acted, when, what changed and why. History is preserved, never overwritten." },
  { title: "Separation of duties", body: "Nobody approves an application they originated, or every stage of a campaign they prepared. The system enforces it." },
  { title: "Built for mobile next", body: "All rules live behind secure APIs, so the mobile apps that follow use exactly the same controls." },
];

const outcomes = [
  { title: "Fully funded", body: "The target is reached in cleared funds. Closing starts: final reconciliation, documents, and a separately approved release of funds to the business." },
  { title: "Partly funded", body: "Partial funding never goes ahead automatically. It proceeds only under terms approved in advance, or the campaign closes and refunds." },
  { title: "Not funded", body: "If the minimum isn't reached, the campaign is cancelled and the custodian refunds every investor." },
  { title: "Oversubscribed", body: "Excess money is never accepted automatically. Allocation follows disclosed, legally approved rules, and any excess is refunded." },
  { title: "Withdrawn", body: "An authorised administrator can withdraw a campaign under set rules. The decision is recorded and investors are told." },
];

const states: { state: MoneyState; body: string }[] = [
  { state: "expected", body: "Due later under the schedule. Not money you have." },
  { state: "pending", body: "Payment started, not yet confirmed." },
  { state: "confirmed", body: "Confirmed by the provider, not yet cleared." },
  { state: "cleared", body: "Held and reconciled by the custodian." },
  { state: "received", body: "Paid out to you." },
  { state: "overdue", body: "Due and not yet paid." },
];

const risks = [
  { title: "You can lose money", body: "A business may repay late, repay only part, or not repay at all. You could lose some or all of what you invest." },
  { title: "Your money is locked in", body: "Private credit is illiquid. You generally can't withdraw before the investment matures." },
  { title: "Returns are not guaranteed", body: "Expected returns are targets based on the agreed terms, never promises." },
  { title: "Concentration adds risk", body: "Putting too much into one business or sector raises your risk. Serwaa warns you before an investment would push you past your own limits." },
];

export default function ProtectionPage() {
  return (
    <>
      <ContentHero
        eyebrow="Protection and risk"
        title="How Serwaa protects businesses and investors"
        intro="Serwaa is built on controls, not promises. Here is where your money goes, how every business is checked, who makes decisions, what happens when a campaign succeeds or doesn't, and the risks you should understand before investing."
      >
        <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
          <ButtonLink href="#custody" variant="outlined">Where the money goes</ButtonLink>
          <ButtonLink href="#verification" variant="outlined">How businesses are verified</ButtonLink>
          <ButtonLink href="#risks" variant="outlined">Risks of investing</ButtonLink>
        </div>
      </ContentHero>

      <ContentSection
        id="custody"
        tone="tint"
        eyebrow="Your money"
        title="Investor money never sits with Serwaa"
        lead="When you invest, you pay a licensed custodian, bank or payment partner directly, by Mobile Money or bank transfer with a unique reference. Serwaa tracks and reconciles every payment, but never holds investor money, pools it in its own accounts, or runs a wallet."
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal className="flex justify-center rounded-3xl bg-white p-8 ring-1 ring-ink-200">
            <CustodyIllustration className="h-56 w-auto" />
          </div>
          <div data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
            {states.map((s) => (
              <div key={s.state} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <MoneyBadge state={s.state} />
                <p className="mt-3 text-sm leading-6 text-ink-700">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-600">
          Funding progress counts cleared money only. A receipt or screenshot you upload is supporting evidence, never proof that funds have cleared.
          Serwaa never asks for or stores your Mobile Money PIN.
        </p>
      </ContentSection>

      <ContentSection
        id="verification"
        eyebrow="Every business"
        title="Five stages of verification before any credit decision"
        lead="A registration form and a certificate don't prove who a business is. Every business on Serwaa completes five stages, and each director, shareholder and beneficial owner is verified individually, with identity, face match and screening against sanctions, politically exposed persons and adverse media."
      >
        <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ol data-reveal-stagger className="grid gap-3">
            {kyb.map((k) => (
              <li key={k.title} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <p className="font-bold text-aubergine-800">{k.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-600">{k.body}</p>
              </li>
            ))}
          </ol>
          <div data-reveal className="space-y-4 lg:sticky lg:top-28">
            <div className="flex justify-center rounded-3xl bg-ink-50 p-8">
              <VerifyIllustration className="h-48 w-auto" />
            </div>
            <p className="text-sm leading-6 text-ink-600">
              Documents are read and checked automatically, with mismatches, expiry, duplicates and tampering signals flagged for an officer.
              Automated checks are never treated as proof: a business can&apos;t reach credit approval until every mandatory item is verified.
              Incomplete documents, a genuine risk issue and a failed identity check are always kept as separate outcomes.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        tone="dark"
        eyebrow="Our principles"
        title="Ten rules the whole platform is built on"
        lead="These aren't policies on a page. Each one is enforced by the system itself, and the sensitive ones are tested automatically."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((p, i) => (
            <InfoCard key={p.title} tone="dark" title={p.title} body={p.body} meta={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="campaigns"
        eyebrow="Campaign outcomes"
        title="What happens when a campaign closes"
        lead="Approved deals raise money through campaigns that publish only after independent compliance and committee approvals. When a campaign closes, one of five outcomes applies, and every one is recorded and communicated."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {outcomes.map((o) => (
            <InfoCard key={o.title} {...o} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="risks"
        tone="tint"
        eyebrow="Before you invest"
        title="The risks of investing in private credit"
        lead="Lending to growing businesses can earn regular returns, but it carries real risk. Please read this before you invest."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        title="Investing opens only after regulatory approval"
        lead="Regulated investment features stay switched off until the required approval and licensing from Ghana's Securities and Exchange Commission are in place. Serwaa is designed to meet Ghanaian data protection, anti-money-laundering and financial sector requirements, with encryption, multi-factor sign-in, role-based access and a complete audit trail."
      >
        <ButtonLink href="/faq">Read the FAQs</ButtonLink>
      </ContentSection>
    </>
  );
}
