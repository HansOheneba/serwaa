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
      intro="Turn invoices, purchase orders and contracts into working capital. Register once, and your verified profile carries into every application."
      primary={{ href: "/onboarding?as=business", label: "Start an application" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      photo={photos.carpenter}
      features={[
        { title: "Twelve financing structures", body: "Invoice, purchase order, contract, working capital, inventory, equipment, supply chain and more." },
        { title: "Enter it once", body: "Your company details, owners and documents prefill every application. No re-typing at each stage." },
        { title: "Know where you stand", body: "A live tracker shows the current stage, what we need from you and by when." },
        { title: "Clear terms up front", body: "You see the full repayment schedule before the deal is offered to investors." },
        { title: "One place to repay", body: "Track balances, upcoming repayments and payment history for every facility." },
        { title: "Help when you need it", body: "Messages with your assigned officer sit next to the application they relate to." },
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
        title="Five stages, done once"
        lead="Verification proves who your business is and who owns it. You can save and come back at any point, and you only do it once: every later application reuses it."
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
