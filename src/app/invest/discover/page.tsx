import type { Metadata } from "next";
import { OpportunityCard } from "@/components/opportunity-card";
import { PageHeader } from "@/components/ui";
import { opportunities } from "@/lib/data";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  const sorted = [...opportunities].sort((a, b) => b.match - a.match);
  return (
    <>
      <PageHeader eyebrow="Discover" title="Opportunities for your profile" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">
        Ranked by how closely each one fits the preferences you gave us. This is a factual comparison, not advice.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((o) => (
          <OpportunityCard key={o.id} o={o} href={`/invest/opportunities/${o.id}`} showMatch />
        ))}
      </div>
    </>
  );
}
