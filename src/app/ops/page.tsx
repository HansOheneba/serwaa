import { DashboardBand } from "@/components/dashboard-band";
import { Suspense } from "react";
import { QueueList } from "@/components/queue-list";
import { opsQueue } from "@/lib/data";
import { cedis } from "@/lib/format";

export default function QueuePage() {
  const total = opsQueue.reduce((s, a) => s + a.amount, 0);
  return (
    <>
      <DashboardBand
        eyebrow="Operations · application queue"
        greeting="Today's queue"
        figureLabel="Financing requested in the queue"
        figure={cedis(total)}
        series={[3, 4, 4, 6, 5, 7, 8, 7, 9, 10, 12]}
        stats={[
          { label: "Open applications", value: String(opsQueue.length) },
          { label: "Awaiting documents", value: String(opsQueue.filter((a) => a.outstanding > 0).length) },
          { label: "At committee", value: String(opsQueue.filter((a) => a.stage === "Credit committee").length) },
          { label: "Unassigned", value: String(opsQueue.filter((a) => a.officer === "Unassigned").length), hint: "Needs an officer" },
        ]}
      />
      <Suspense fallback={<div className="mt-6 h-64 rounded-2xl bg-ink-50" />}>
        <QueueList />
      </Suspense>
      <p className="mt-3 text-xs text-ink-500">
        You can&apos;t approve the credit assessment of an application you originated. Approvals are recorded in the audit trail.
      </p>
    </>
  );
}
