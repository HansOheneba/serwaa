import type { Metadata } from "next";
import { CampaignsView } from "@/components/ops-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <>
      <PageHeader eyebrow="Operations" title="Campaigns" />
      <CampaignsView />
    </>
  );
}
