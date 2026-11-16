import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader eyebrow="Facilities" title="Facilities and repayments" />
      <Card className="py-14 text-center">
        <h2 className="text-lg font-bold text-aubergine-800">Your first facility will appear here</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-600">
          After your campaign funds and the custodian disburses, you&apos;ll see the repayment schedule, balances and payment history.
        </p>
      </Card>
    </>
  );
}
