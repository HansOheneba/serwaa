import type { Metadata } from "next";
import { InstitutionTeam } from "@/components/institution-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Team and roles" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Team and roles" title="Who can act for your organisation" />
      <InstitutionTeam />
    </>
  );
}
