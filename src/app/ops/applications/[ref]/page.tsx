import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseView } from "@/components/ops-views";
import { opsQueue } from "@/lib/data";

export const metadata: Metadata = { title: "Application" };

export function generateStaticParams() {
  return opsQueue.map((q) => ({ ref: q.ref }));
}

export default function CasePage(props: PageProps<"/ops/applications/[ref]">) {
  return (
    <Suspense fallback={<p className="text-ink-500">Loading application…</p>}>
      <Case params={props.params} />
    </Suspense>
  );
}

async function Case({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return <CaseView refId={ref} />;
}
