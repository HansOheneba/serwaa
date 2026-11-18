import type { Metadata } from "next";
import { InstitutionPortfolio } from "@/components/institution-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Portfolio" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Portfolio" title="Your investments" />
      <InstitutionPortfolio />
    </>
  );
}
