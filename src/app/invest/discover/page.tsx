import type { Metadata } from "next";
import { Suspense } from "react";
import { DiscoverView } from "@/components/investor-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return (
    <>
      <PageHeader eyebrow="Discover" title="Opportunities for you" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">The closest matches to your preferences come first. Save any to come back to, or compare up to three side by side.</p>
      <Suspense fallback={<div className="h-64 rounded-2xl bg-ink-50" />}>
        <DiscoverView />
      </Suspense>
    </>
  );
}
