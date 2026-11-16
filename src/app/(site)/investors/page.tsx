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
      intro="Lend to verified businesses from GH₵100. See opportunities that fit your goals, pay by Mobile Money or bank transfer, and track every cedi you are owed."
      primary={{ href: "/onboarding?as=investor", label: "Start investing" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      photo={photos.investorLaptop}
      aside={<div className="shadow-xl shadow-aubergine-900/10"><OpportunityCard o={opportunities[1]} showMatch anonymous /></div>}
      features={[
        { title: "Matched to you", body: "A short questionnaire builds your profile. Each opportunity shows which of your preferences it meets and which it doesn't." },
        { title: "Your money stays protected", body: "Payments go straight to a licensed custodian, never to a Serwaa wallet." },
        { title: "Honest numbers", body: "Expected, pending, received and overdue amounts are always labelled and never added together." },
        { title: "Pay from your phone", body: "MTN MoMo, Telecel Cash, AT Money or bank transfer with a unique reference." },
        { title: "Concentration warnings", body: "We tell you before a new investment would tip too much of your portfolio into one sector or business." },
        { title: "Answers on hand", body: "Ask about your schedule or an opportunity's risks and get answers drawn only from your records and approved documents." },
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
