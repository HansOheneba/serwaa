import type { Metadata } from "next";
import { AudiencePage } from "@/components/audience-page";
import { ContentSection, InfoCard } from "@/components/content";
import { ButtonLink } from "@/components/ui";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { title: "For businesses" };

export default function BusinessesPage() {
  return (
    <AudiencePage
      eyebrow="For businesses"
      title="Finance that fits your trade"
      intro="Turn invoices, purchase orders and contracts into the working capital to deliver them, funded by investors who can see your business has been properly verified."
      primary={{ href: "/onboarding?as=business", label: "Start an application" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      photo={photos.carpenter}
      features={[
        { title: "Borrow against the deal", body: "An invoice, purchase order or contract can be the basis for financing, so you aren't limited by the property you own." },
        { title: "Repay when you get paid", body: "Repayment can follow your customer's payment date, a share of your revenue or a fixed schedule, chosen to fit your cash flow." },
        { title: "Many funders, not one bank", body: "Approved deals are funded by individual and institutional investors together, so one lender's appetite doesn't decide your future." },
        { title: "Terms that can't move", body: "You see the price, fees and full repayment schedule before investors do, and they can't change without a new approval." },
        { title: "Financing for how you trade", body: "Twelve structures, from a single invoice to a whole supply chain, so the facility fits the deal instead of the other way round." },
        { title: "No chasing for updates", body: "You see which of the twelve review stages you're at, who owns it, and exactly what we need from you and by when." },
      ]}
      steps={[
        "Register and verify your email and phone",
        "Complete the five-stage business verification",
        "Apply, attaching invoices, purchase orders or contracts",
        "Review the term sheet and receive funds once the campaign closes",
      ]}
    >
      <ContentSection
        tone="tint"
        eyebrow="Verification"
        title="Five stages of verification"
        lead="Thorough checks are what let investors trust a business they've never met. The work you put in here is what gets your deal funded."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InfoCard title="Business identity" body="Registered name and number, addresses, industry and tax details." meta="Stage 1" />
          <InfoCard title="Ownership" body="Directors, shareholders and beneficial owners, each verified individually." meta="Stage 2" />
          <InfoCard title="Corporate documents" body="Incorporation certificate, constitution, registry extract, IDs and licences." meta="Stage 3" />
          <InfoCard title="Financial documents" body="Accounts, bank statements, tax returns, loans, receivables and forecasts." meta="Stage 4" />
          <InfoCard title="Commercial evidence" body="The contracts, purchase orders and invoices behind your request." meta="Stage 5" />
        </div>
      </ContentSection>
      <ContentSection
        eyebrow="After you apply"
        title="Twelve stages, each with a named officer"
        lead="Screening, document and ownership checks, compliance, financial and commercial analysis, credit assessment, risk review, committee where needed, structuring and final approval. You see the current stage and anything we need from you, with a due date, the whole way through."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/products">See all twelve financing products</ButtonLink>
          <ButtonLink href="/protection#verification" variant="outlined">
            How verification works
          </ButtonLink>
        </div>
      </ContentSection>
    </AudiencePage>
  );
}
