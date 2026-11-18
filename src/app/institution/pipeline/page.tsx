import type { Metadata } from "next";
import { InstitutionPipeline } from "@/components/institution-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Pipeline" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Pipeline" title="Live deals that fit your mandate" />
      <InstitutionPipeline />
    </>
  );
}
