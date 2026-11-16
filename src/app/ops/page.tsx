"use client";

import { Suspense } from "react";
import { DashboardBand } from "@/components/dashboard-band";
import { QueueList } from "@/components/queue-list";
import { cedis } from "@/lib/format";
import { useWorkspace } from "@/lib/store";

export default function QueuePage() {
  const ws = useWorkspace();
  const open = ws.applications.filter((a) => a.status !== "Approved" && a.status !== "Rejected");
  const total = open.reduce((s, a) => s + a.amount, 0);
  return (
    <>
      <DashboardBand
        eyebrow="Operations · application queue"
        greeting="Today's queue"
        figureLabel="Financing requested in the queue"
        figure={cedis(total)}
        series={[3, 4, 4, 6, 5, 7, 8, 7, 9, 10, 12]}
        stats={[
          { label: "Open applications", value: String(open.length) },
          { label: "Waiting on business", value: String(open.filter((a) => a.status === "Information requested").length) },
          { label: "Replies to review", value: String(ws.requests.filter((r) => r.status === "Responded").length) },
          { label: "Unassigned", value: String(open.filter((a) => a.officer === "Unassigned").length), hint: "Needs an officer" },
        ]}
      />
      <Suspense fallback={<div className="mt-6 h-64 rounded-2xl bg-ink-50" />}>
        <QueueList />
      </Suspense>
    </>
  );
}
