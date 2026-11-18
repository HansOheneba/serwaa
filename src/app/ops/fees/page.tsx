import type { Metadata } from "next";
import { FeesView } from "@/components/backoffice-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Fees" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Back office" title="What Serwaa charges" />
      <FeesView />
    </>
  );
}
