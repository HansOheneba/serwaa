import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketplaceDetail } from "@/components/marketplace";
import { opportunities } from "@/lib/data";

export const metadata: Metadata = { title: "Deal" };

export function generateStaticParams() {
  return opportunities.map((o) => ({ id: o.id }));
}

export default function DealPage(props: PageProps<"/marketplace/[id]">) {
  return (
    <section className="bg-white py-16 pb-28 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Suspense fallback={<p className="text-ink-500">Loading deal…</p>}>
          <Deal params={props.params} />
        </Suspense>
      </div>
    </section>
  );
}

async function Deal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MarketplaceDetail id={id} />;
}
