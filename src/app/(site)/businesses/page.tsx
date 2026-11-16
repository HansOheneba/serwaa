import type { Metadata } from "next";
import { AudiencePage } from "@/components/audience-page";

export const metadata: Metadata = { title: "For businesses" };

export default function BusinessesPage() {
  return (
    <AudiencePage
      eyebrow="For businesses"
      title="Finance that fits your trade"
      intro="Turn invoices, purchase orders and contracts into working capital. Register once, and your verified profile carries into every application."
      primary={{ href: "/onboarding?as=business", label: "Start an application" }}
      secondary={{ href: "/how-it-works", label: "How it works" }}
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
    />
  );
}
