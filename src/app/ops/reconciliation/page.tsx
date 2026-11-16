import type { Metadata } from "next";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { reconciliation } from "@/lib/demo-data";
import { cedis } from "@/lib/format";

export const metadata: Metadata = { title: "Reconciliation" };

const tone = { Matched: "good", Underpayment: "bad", Duplicate: "bad", "Awaiting authorisation": "warn" } as const;

export default function ReconciliationPage() {
  return (
    <>
      <PageHeader eyebrow="Operations" title="Payment reconciliation" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">
        Expected payments against what the custodian has received. An investor&apos;s uploaded receipt is supporting evidence only; a payment
        clears when the money is matched.
      </p>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold">Investor</th>
              <th className="px-5 py-3 font-semibold">Campaign</th>
              <th className="px-5 py-3 font-semibold">Method</th>
              <th className="px-5 py-3 text-right font-semibold">Expected</th>
              <th className="px-5 py-3 text-right font-semibold">Received</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {reconciliation.map((r) => (
              <tr key={r.ref}>
                <td className="px-5 py-4 font-mono text-xs">{r.ref}</td>
                <td className="px-5 py-4">{r.investor}</td>
                <td className="px-5 py-4 font-mono text-xs">{r.campaign}</td>
                <td className="px-5 py-4">{r.method}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums">{cedis(r.expected)}</td>
                <td className={`px-5 py-4 text-right font-mono tabular-nums ${r.received < r.expected ? "text-danger-600" : ""}`}>{cedis(r.received)}</td>
                <td className="px-5 py-4">
                  <StatusPill tone={tone[r.status as keyof typeof tone]}>{r.status}</StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
