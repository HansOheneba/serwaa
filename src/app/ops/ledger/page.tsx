import type { Metadata } from "next";
import { LedgerView } from "@/components/backoffice-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Ledger" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Back office" title="Every money movement, booked" />
      <LedgerView />
    </>
  );
}
