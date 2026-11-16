import type { Metadata } from "next";
import { ReconciliationView } from "@/components/ops-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Reconciliation" };

export default function ReconciliationPage() {
  return (
    <>
      <PageHeader eyebrow="Operations" title="Payments to confirm" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">Match each payment to what actually arrived. A screenshot or receipt from the payer is never enough on its own.</p>
      <ReconciliationView />
    </>
  );
}
