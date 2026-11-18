import { Suspense } from "react";
import { PortfolioView } from "@/components/investor-views";

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-ink-50" />}>
      <PortfolioView />
    </Suspense>
  );
}
