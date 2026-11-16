import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { Weave } from "@/components/weave";

export const metadata: Metadata = { title: "Facilities" };

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader eyebrow="Facilities" title="Facilities and repayments" />
      <div className="relative overflow-hidden rounded-2xl bg-white px-5 pt-28 pb-14 text-center ring-1 ring-ink-200">
        <Weave fade="b" className="inset-x-0 top-0 h-28" />
        <h2 className="text-lg font-bold text-aubergine-800">Your first facility will appear here</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-600">
          After your campaign funds and the custodian disburses, you&apos;ll see the repayment schedule, balances and payment history.
        </p>
      </div>
    </>
  );
}
