import type { Metadata } from "next";
import { Suspense } from "react";
import { OpportunityDetail } from "@/components/investor-views";
import { opportunities } from "@/lib/data";

export function generateStaticParams() {
  return opportunities.map((o) => ({ id: o.id }));
}

export async function generateMetadata(props: PageProps<"/invest/opportunities/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: opportunities.find((o) => o.id === id)?.business ?? "Opportunity" };
}

export default function OpportunityPage(props: PageProps<"/invest/opportunities/[id]">) {
  return (
    <Suspense fallback={<p className="text-ink-500">Loading opportunity…</p>}>
      <Opportunity params={props.params} />
    </Suspense>
  );
}

async function Opportunity({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OpportunityDetail id={id} />;
}
