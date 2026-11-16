import type { Metadata } from "next";
import { Suspense } from "react";
import { BusinessApplications } from "@/components/business-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader eyebrow="Applications" title="Your applications" />
      <Suspense fallback={<div className="h-96 rounded-2xl bg-ink-50" />}>
        <BusinessApplications />
      </Suspense>
    </>
  );
}
