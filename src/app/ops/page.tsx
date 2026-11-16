import { DashboardBand } from "@/components/dashboard-band";
import { Card, StatusPill } from "@/components/ui";
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
      <Card className="rise-in mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Business</th>
              <th className="px-5 py-3 text-right font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Officer</th>
              <th className="px-5 py-3 text-right font-semibold">Docs due</th>
              <th className="px-5 py-3 font-semibold">Next action</th>
            </tr>
          </thead>
          <tbody className="stagger divide-y divide-ink-100">
            {opsQueue.map((a) => (
              <tr key={a.ref} className="hover:bg-aubergine-50/50">
                <td className="px-5 py-4 font-mono text-xs">{a.ref}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-ink-900">{a.business}</p>
                  <p className="text-xs text-ink-500">{a.industry}</p>
                </td>
                <td className="px-5 py-4 text-right font-mono tabular-nums">{cedis(a.amount)}</td>
                <td className="px-5 py-4">
                  <StatusPill tone={a.stage === "Credit committee" ? "brand" : "neutral"}>{a.stage}</StatusPill>
                </td>
                <td className={`px-5 py-4 ${a.officer === "Unassigned" ? "font-semibold text-danger-600" : ""}`}>{a.officer}</td>
                <td className="px-5 py-4 text-right font-mono">{a.outstanding}</td>
                <td className="px-5 py-4 text-ink-700">{a.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-3 text-xs text-ink-500">
        You can&apos;t approve the credit assessment of an application you originated. Approvals are recorded in the audit trail.
      </p>
    </>
  );
}
