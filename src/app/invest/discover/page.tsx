import type { Metadata } from "next";
import { Suspense } from "react";
import { DiscoverList } from "@/components/discover-list";
import { PageHeader } from "@/components/ui";
import { opportunities } from "@/lib/data";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return (
    <>
      <PageHeader eyebrow="Discover" title="Opportunities for your profile" />
      <p className="-mt-4 mb-6 max-w-2xl text-ink-600">
        Ranked by how closely each one fits the preferences you gave us. This is a factual comparison, not advice.
      </p>
      <Suspense fallback={<div className="h-64 rounded-2xl bg-ink-50" />}>
        <DiscoverList opportunities={opportunities} />
      </Suspense>
    </>
  );
}
