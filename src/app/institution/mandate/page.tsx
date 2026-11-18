import type { Metadata } from "next";
import { MandateEditor } from "@/components/institution-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Mandate" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Mandate" title="What you invest in" />
      <MandateEditor />
    </>
  );
}
