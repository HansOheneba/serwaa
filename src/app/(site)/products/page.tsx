import type { Metadata } from "next";
import { ContentHero, ContentSection, InfoCard } from "@/components/content";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Financing products" };

const products = [
  { title: "Invoice financing", body: "An advance against invoices you've issued to creditworthy customers. Repaid when your customer settles the invoice.", meta: "Repaid from the invoice" },
  { title: "Purchase order financing", body: "Funds the supplies or goods you need to fulfil a confirmed purchase order. We link the order, buyer, supplier and expected payment date.", meta: "Repaid when the buyer pays" },
  { title: "Contract financing", body: "Working capital to deliver a signed contract, from mobilisation to completion.", meta: "Repaid from contract payments" },
  { title: "Working capital financing", body: "Cover stock, payroll or seasonal gaps when cash comes in later than costs go out.", meta: "Repaid from operating cash flow" },
  { title: "Inventory financing", body: "Buy stock ahead of demand, with the inventory itself supporting the facility.", meta: "Repaid as stock sells" },
  { title: "Equipment financing", body: "Acquire machinery, vehicles or tools that grow output, repaid over the asset's useful life.", meta: "Repaid in instalments" },
  { title: "Receivables financing", body: "Unlock cash tied up across your book of customer receivables, not just a single invoice.", meta: "Repaid as receivables collect" },
  { title: "Revenue-based financing", body: "Repay as a share of your revenue, so payments rise and fall with how your business performs.", meta: "Repaid as a share of revenue" },
  { title: "Asset-backed financing", body: "Borrow against assets the business owns, such as property, equipment or stock.", meta: "Secured on business assets" },
  { title: "Structured SME debt", body: "A tailored term facility for larger or more complex needs, with terms set around the business plan.", meta: "Repaid on an agreed schedule" },
  { title: "Supply chain financing", body: "Finance that flows along a supply chain, helping suppliers get paid sooner by strong buyers.", meta: "Repaid by the anchor buyer" },
  { title: "Other approved structures", body: "Where a deal doesn't fit the list, our structuring team can design another legally approved private credit structure.", meta: "Structured case by case" },
];

const returns = [
  { title: "Fixed interest", body: "Interest at an agreed rate over the financing period." },
  { title: "Amortising repayment", body: "Principal and interest repaid together in regular instalments." },
  { title: "Bullet repayment", body: "Interest paid periodically and principal at maturity, or both at maturity where agreed." },
  { title: "Interest only", body: "Regular interest payments, with the principal returned at maturity." },
  { title: "Revenue sharing", body: "An agreed share of a defined revenue stream over a set period." },
  { title: "Profit sharing", body: "An agreed share of defined profits, as set out in the transaction documents." },
  { title: "Invoice and receivables", body: "Repayment tied to the settlement of a verified invoice or receivable." },
  { title: "Factoring", body: "Receivables bought at a discount, with returns coming from collection." },
];

export default function ProductsPage() {
  return (
    <>
      <ContentHero
        eyebrow="Financing products"
        title="Financing built around how your business earns"
        intro="Serwaa offers twelve ways to finance a business, from a single invoice to a full supply chain. Every deal is structured, priced and scheduled before investors see it, so both sides know the terms from day one."
      >
        <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
          <ButtonLink href="/onboarding?as=business">Apply for financing</ButtonLink>
          <ButtonLink href="#returns" variant="outlined">
            How investors are repaid
          </ButtonLink>
        </div>
      </ContentHero>

      <ContentSection
        tone="tint"
        eyebrow="For businesses"
        title="Twelve financing structures"
        lead="Each product has its own application fields, document requirements and repayment pattern. You choose the closest fit; our team confirms the right structure during credit review."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <InfoCard key={p.title} {...p} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="returns"
        eyebrow="For investors"
        title="How investors are repaid"
        lead="Returns follow the structure of each deal. The full repayment schedule is generated and approved before a campaign opens, and every amount you're owed is labelled as expected, due, received or overdue."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {returns.map((r) => (
            <InfoCard key={r.title} {...r} />
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-500">
          Expected returns are never guaranteed. Repayments can be late or incomplete, and you could lose some or all of the money you invest.
        </p>
      </ContentSection>

      <ContentSection
        tone="dark"
        eyebrow="Before a deal goes live"
        title="Terms are fixed before anyone invests"
        lead="Every transaction records its amount, rate, calculation method, tenor, grace period, fees, security and late-payment terms. The campaign copies those terms exactly, so what investors see is what the business agreed."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-3">
          <InfoCard tone="dark" title="Structured by specialists" body="Our structuring team sets pricing, tenor, repayment frequency, fees, security and conditions in one record." />
          <InfoCard tone="dark" title="Schedule generated first" body="The repayment schedule is calculated from the agreed terms and approved before the campaign is published." />
          <InfoCard tone="dark" title="Changes need approval" body="Any change to the terms creates a new version and must be approved again. Earlier versions are kept." />
        </div>
      </ContentSection>
    </>
  );
}
