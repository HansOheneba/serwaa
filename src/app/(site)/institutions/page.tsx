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
        { title: "Mandate-based pipeline", body: "Set sectors, ticket sizes, structures, tenors and return parameters. The pipeline follows them." },
        { title: "Data rooms", body: "Full transaction detail, credit memoranda and documents, with every access logged." },
        { title: "Allocation control", body: "Express interest with a proposed amount and agree allocations with our team." },
        { title: "Consolidated reporting", body: "Exposure, concentration, repayment performance and maturities across every deal." },
        { title: "Team access", body: "Invite colleagues and set what each person can see and do." },
        { title: "Deep verification", body: "Every borrower passes ownership mapping, director and UBO checks and document verification." },
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
