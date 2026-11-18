import type { Metadata } from "next";
import { TeamView } from "@/components/backoffice-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Team and roles" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Back office" title="Who works on Serwaa, and what each person can do" />
      <TeamView />
    </>
  );
}
