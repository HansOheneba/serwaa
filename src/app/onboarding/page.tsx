import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingFlow } from "@/components/onboarding/flow";

export const metadata: Metadata = { title: "Create your account" };

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-ink-50" />}>
      <OnboardingFlow />
    </Suspense>
  );
}
