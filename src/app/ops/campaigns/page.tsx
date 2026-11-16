import type { Metadata } from "next";
import { Card, FundingBar, Label, MoneyBadge, PageHeader, StatusPill } from "@/components/ui";
import { campaignStages, opsCampaigns } from "@/lib/demo-data";
import { cedis, percent } from "@/lib/format";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <>
      <PageHeader eyebrow="Operations" title="Campaigns" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">
        A campaign publishes only after every approval stage is signed off by a different authorised person. Funding counts cleared money only.
      </p>
      <div className="space-y-4">
        {opsCampaigns.map((c) => {
          const live = c.stageIndex === campaignStages.length - 1;
          return (
            <Card key={c.ref}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink-500">{c.ref}</p>
                  <h2 className="text-lg font-bold text-aubergine-800">{c.business}</h2>
                </div>
                <StatusPill tone={live ? "good" : "warn"}>{campaignStages[c.stageIndex]}</StatusPill>
              </div>
              <div className="mt-4 flex gap-1" aria-label={`Approval stage ${c.stageIndex + 1} of ${campaignStages.length}`}>
                {campaignStages.map((s, i) => (
                  <span key={s} title={s} className={`h-1.5 flex-1 rounded-sm ${i <= c.stageIndex ? "bg-aubergine-800" : "bg-ink-100"}`} />
                ))}
              </div>
              {live ? (
                <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
                  <FundingBar target={c.target} cleared={c.cleared} pending={c.pending} />
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center gap-2"><MoneyBadge state="cleared" /><span className="font-mono">{cedis(c.cleared)} · {percent(c.cleared, c.target)}%</span></span>
                    <span className="inline-flex items-center gap-2"><MoneyBadge state="pending" /><span className="font-mono">{cedis(c.pending)}</span></span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-saffron-50 p-4 text-sm text-saffron-900">
                  <Label className="text-saffron-800">Waiting on</Label>
                  <p className="mt-1">Compliance review by a KYC and compliance officer. The drafter can&apos;t approve this stage.</p>
                </div>
              )}
              <p className="mt-4 text-xs text-ink-500">Target {cedis(c.target)}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}
