import type { Metadata } from "next";
import { NewApplicationForm } from "@/components/business-views";
import { Card, Label, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "New application" };

export default function NewApplicationPage() {
  return (
    <>
      <PageHeader eyebrow="New application" title="Apply for financing" />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-7 sm:p-9">
          <NewApplicationForm />
        </Card>
        <Card className="h-fit bg-aubergine-50 p-7 ring-aubergine-100">
          <Label>Already on file</Label>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
            <li>Your company details and registration</li>
            <li>Your directors and owners</li>
            <li>Your verified company documents</li>
            <li>Your 2025 accounts</li>
          </ul>
          <p className="mt-5 text-sm text-ink-600">We&apos;ll ask for anything specific to this deal once we&apos;ve read your application.</p>
        </Card>
      </div>
    </>
  );
}
