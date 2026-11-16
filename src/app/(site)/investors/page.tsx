import type { Metadata } from "next";
import { AudiencePage } from "@/components/audience-page";
import { ContentSection, InfoCard } from "@/components/content";
import { OpportunityCard } from "@/components/opportunity-card";
import { ButtonLink } from "@/components/ui";
import { opportunities } from "@/lib/data";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { title: "For investors" };

export default function InvestorsPage() {
  return (
    <AudiencePage
      eyebrow="For investors"
      title="Private credit, explained plainly"
      intro="Earn from lending to real Ghanaian businesses, starting at GH₵100. Every borrower is verified, your money is held by a licensed custodian, and your statement shows exactly what you’ve been paid."
      primary={{ href: "/onboarding?as=investor", label: "Start investing" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      photo={photos.investorLaptop}
      aside={<div className="shadow-xl shadow-aubergine-900/10"><OpportunityCard o={opportunities[1]} showMatch anonymous /></div>}
      features={[
        { title: "Checked down to the owners", body: "Every director, shareholder and beneficial owner is verified and screened before a business can raise a cedi." },
        { title: "Start with GH₵100", body: "Small minimums let you spread your money across several businesses and sectors instead of betting on one." },
        { title: "Your money never sits with us", body: "You pay a licensed custodian directly. Serwaa can't spend, pool or lend out your money." },
        { title: "Refunded if a deal doesn't fill", body: "If a campaign misses its minimum, the custodian returns your money. Partial deals never go ahead automatically." },
        { title: "See why it fits, and why it doesn't", body: "Each opportunity lists which of your preferences it meets and which it misses, so you decide with the full picture." },
        { title: "Warned before you over-commit", body: "If a new investment would push too much of your money into one business or sector, you're told before you pay." },
      ]}
      steps={[
        "Create an account and verify your identity",
        "Answer the profile questionnaire",
        "Review matched opportunities and their risks",
        "Subscribe, pay, and track repayments",
      ]}
      note="Investing on Serwaa opens only after regulatory approval. Expected returns are not guaranteed, repayments can be late, and you can lose some or all of your capital."
    >
      <ContentSection
        tone="tint"
        eyebrow="Your profile"
        title="Five short sections shape what you see"
        lead="Your answers build a profile that ranks opportunities by fit. Your willingness to take risk and your capacity to absorb a loss are assessed separately, and capacity always comes first."
      >
        <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InfoCard title="Your finances" body="Income, commitments and how much you can invest." meta="Section 1" />
          <InfoCard title="Your objectives" body="Income, growth, preservation, diversification or impact." meta="Section 2" />
          <InfoCard title="Your preferences" body="Amount, tenor, sectors, structures and security." meta="Section 3" />
          <InfoCard title="Your experience" body="What you've invested in and how well you know the risks." meta="Section 4" />
          <InfoCard title="Your risk tolerance" body="How you'd handle delays, losses and needing your money back." meta="Section 5" />
        </div>
        <p className="mt-6 text-sm text-ink-600">
          Profiles fall into five categories: Conservative, Income focused, Balanced, Growth oriented and Higher risk tolerance. They guide what you see; they aren&apos;t advice.
        </p>
      </ContentSection>
      <ContentSection
        eyebrow="Who can invest"
        title="From GH₵100, once you're verified"
        lead="Eligible individuals verify their identity on their phone, with ID, face match and liveness, declare their source of funds, and acknowledge the risks. Eligibility, limits and the minimum depend on regulation."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/products#returns">How investors are repaid</ButtonLink>
          <ButtonLink href="/protection" variant="outlined">
            Protection and risk
          </ButtonLink>
        </div>
      </ContentSection>
    </AudiencePage>
  );
}
