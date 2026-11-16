import type { Metadata } from "next";
import { AudiencePage } from "@/components/audience-page";
import { ContentSection, InfoCard } from "@/components/content";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { title: "For institutions" };

export default function InstitutionsPage() {
  return (
    <AudiencePage
      eyebrow="For institutions"
      title="A verified SME credit pipeline, matched to your mandate"
      intro="For private credit funds, banks, development finance institutions, family offices and corporate investors who want structured access to SME lending."
      primary={{ href: "/onboarding?as=institution", label: "Request access" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      photo={photos.boardroom}
      features={[
        { title: "No origination team needed", body: "Verification, credit analysis and structuring are done before a deal reaches you, so you deploy capital without building the machinery." },
        { title: "Only deals that fit", body: "Your pipeline is filtered by sector, ticket size, structure, tenor and return, so your team reviews what it can actually fund." },
        { title: "Diligence you can audit", body: "Credit memoranda, documents and verification results sit in data rooms, and every view is logged." },
        { title: "Agree allocations directly", body: "Express interest with an amount and agree your allocation with our team before you commit." },
        { title: "One view of exposure", body: "See concentration, repayment performance and maturities across every deal, ready for your own reporting." },
        { title: "Control who sees what", body: "Invite colleagues and set exactly what each person can view, approve or download." },
      ]}
      steps={["Register your institution", "Complete institutional verification", "Set your mandate", "Review pipeline and agree allocations"]}
    >
      <ContentSection
        tone="tint"
        eyebrow="Your mandate"
        title="A pipeline that follows your rules"
        lead="Institutions verify their registration, authorised signatories, beneficial ownership and authority to invest, then record a mandate. Opportunities are matched to it, and every data room view is logged."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard title="Sectors" body="The industries you want exposure to, and those you don't." />
          <InfoCard title="Ticket sizes" body="Minimum and maximum amounts per transaction." />
          <InfoCard title="Structures and tenors" body="Which financing structures and terms fit your fund." />
          <InfoCard title="Return parameters" body="The return profile your mandate requires." />
        </div>
      </ContentSection>
    </AudiencePage>
  );
}
