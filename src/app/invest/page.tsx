import { DashboardBand } from "@/components/dashboard-band";
import { ButtonLink, Card, Label, StatusPill } from "@/components/ui";
import { portfolio as p } from "@/lib/data";
import { cedis } from "@/lib/format";

export default function PortfolioPage() {
  return (
    <>
      <DashboardBand
        eyebrow={`Portfolio · as of ${p.asOf}`}
        greeting="Good morning, Ama"
        figureLabel="Outstanding principal"
        figure={cedis(p.outstandingPrincipal)}
        figureState="cleared"
        series={[0, 5000, 5000, 12500, 12500, 17500, 22500, 21250, 20000, 19375, 18750]}
        action={<ButtonLink href="/invest/discover" variant="accent">Discover opportunities</ButtonLink>}
        stats={[
          { label: "Returns received", value: cedis(p.returnsReceived, true), state: "received" },
          { label: "Expected returns", value: cedis(p.expectedFutureReturns), state: "expected", hint: "Not guaranteed" },
          { label: "Pending", value: cedis(p.pending), state: "pending", hint: "Not yet invested" },
          { label: "Overdue", value: cedis(p.overdue), state: "overdue" },
        ]}
      />
      <p className="mt-3 text-xs text-ink-500">Principal repaid so far {cedis(p.principalRepaid)}.</p>

      <Card className="rise-in mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs tracking-[0.08em] text-ink-500 uppercase">
              <th className="px-5 py-3 font-semibold">Investment</th>
              <th className="px-5 py-3 text-right font-semibold">Invested</th>
              <th className="px-5 py-3 text-right font-semibold">Outstanding</th>
              <th className="px-5 py-3 text-right font-semibold">Received</th>
              <th className="px-5 py-3 font-semibold">Next payment</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="stagger divide-y divide-ink-100">
            {p.holdings.map((h) => (
              <tr key={h.business}>
                <td className="px-5 py-4">
                  <p className="font-semibold text-ink-900">{h.business}</p>
                  <p className="text-xs text-ink-500">{h.product}</p>
                </td>
                <td className="px-5 py-4 text-right font-mono tabular-nums">{cedis(h.amount)}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums">{cedis(h.outstanding)}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums">{cedis(h.received, true)}</td>
                <td className="px-5 py-4">
                  <p>{h.nextPayment}</p>
                  {h.nextAmount > 0 && <p className="font-mono text-xs text-money-expected">{cedis(h.nextAmount, true)} expected</p>}
                </td>
                <td className="px-5 py-4">
                  <StatusPill tone={h.status === "Repaying" ? "good" : "brand"}>{h.status}</StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-4">
        <Label>Sector exposure</Label>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full" role="img" aria-label="Manufacturing 44%, logistics 33%, trade and distribution 23%">
          <span className="bg-aubergine-800" style={{ width: "44%" }} />
          <span className="bg-aubergine-400" style={{ width: "33%" }} />
          <span className="bg-saffron-500" style={{ width: "23%" }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-700">
          <span><span className="mr-1.5 inline-block size-2.5 rounded-sm bg-aubergine-800" />Manufacturing 44%</span>
          <span><span className="mr-1.5 inline-block size-2.5 rounded-sm bg-aubergine-400" />Logistics 33%</span>
          <span><span className="mr-1.5 inline-block size-2.5 rounded-sm bg-saffron-500" />Trade and distribution 23%</span>
        </div>
      </Card>
    </>
  );
}
