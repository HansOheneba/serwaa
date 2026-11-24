import type { Metadata } from "next";
import Link from "next/link";
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
        "Verify your business",
        "Apply, attaching invoices, purchase orders or contracts",
        "Review the term sheet and receive funds once the campaign closes",
      ]}
    >
      <ContentSection
        tone="tint"
        eyebrow="Verification"
        title="Why we check so carefully"
        lead="Investors are lending to a business they've never met. Our checks are what give them the confidence to back you, so the more complete your profile, the sooner your deal can be funded."
      >
        <div data-reveal-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <InfoCard title="Who you are" body="Your registration and where you operate." />
          <InfoCard title="Who owns it" body="Your directors and owners, each with ID." />
          <InfoCard title="Your papers" body="Certificate of incorporation, licences and permits." />
          <InfoCard title="Your finances" body="Recent accounts and bank statements." />
          <InfoCard title="Your deal" body="The invoice, order or contract you need funded." />
        </div>
        <p className="mt-8 max-w-3xl leading-7 text-ink-700">
          Once you pass, you get a verified profile you can share with banks, suppliers and tender boards, so you stop handing over the same
          documents again and again.{" "}
          <Link href="/verify" className="font-semibold text-aubergine-500 hover:underline">
            About Serwaa Verify
          </Link>
        </p>
      </ContentSection>
      <ContentSection
        eyebrow="Not sure where to start?"
        title="Tell us what you need funded"
        lead="Most businesses come to us with an invoice, a purchase order or a contract. If yours is different, our team will suggest the right structure."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/products">See all financing products</ButtonLink>
          <ButtonLink href="/onboarding?as=business" variant="outlined">
            Start an application
          </ButtonLink>
        </div>
      </ContentSection>
    </AudiencePage>
  );
}
