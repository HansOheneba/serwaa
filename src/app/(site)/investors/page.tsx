import type { Metadata } from "next";
import { AudiencePage } from "@/components/audience-page";
import { OpportunityCard } from "@/components/opportunity-card";
import { opportunities } from "@/lib/data";

export const metadata: Metadata = { title: "For investors" };

export default function InvestorsPage() {
  return (
    <AudiencePage
      eyebrow="For investors"
      title="Private credit, explained plainly"
      intro="Lend to verified businesses from GH₵100. See opportunities that fit your goals, pay by Mobile Money or bank transfer, and track every cedi you are owed."
      primary={{ href: "/login", label: "Start investing" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
      aside={<OpportunityCard o={opportunities[1]} showMatch anonymous />}
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
    />
  );
}
