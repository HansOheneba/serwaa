import type { Metadata } from "next";
import { StageTracker } from "@/components/stage-tracker";
import { Button, ButtonLink, Card, Label, PageHeader } from "@/components/ui";
import { applicationStages, businessApplication } from "@/lib/demo-data";
import { cedis } from "@/lib/format";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  const app = businessApplication;
  return (
    <>
      <PageHeader eyebrow="Applications" title={`${app.product} · ${cedis(app.amount)}`}>
        <ButtonLink href="/business/applications/new" variant="secondary">
          New application
        </ButtonLink>
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <Label>Progress</Label>
          <p className="mt-1 mb-5 font-mono text-xs text-ink-500">
            {app.ref} · submitted {app.submitted}
          </p>
          <StageTracker stages={applicationStages} current={app.stageIndex} />
        </Card>
        <div className="space-y-4">
          <Card>
            <Label>Information request</Label>
            {app.requests.map((r) => (
              <div key={r.title} className="mt-3">
                <p className="font-semibold text-ink-800">{r.title}</p>
                <p className="mt-1 text-sm text-ink-600">
                  Your credit analyst needs these to complete the cash flow analysis. Due {r.due}.
                </p>
                <div className="mt-4 rounded-xl border-2 border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
                  Drop PDF statements here
                </div>
                <div className="mt-4 flex gap-2">
                  <Button disabled title="Uploads are not enabled in the prototype">
                    Send response
                  </Button>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <Label>Summary</Label>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              {[
                ["Amount", cedis(app.amount)],
                ["Structure", app.product],
                ["Repayment", "Single repayment at invoice settlement"],
                ["Expected funding", "December 2026"],
                ["Debtor", "National supermarket chain (sample)"],
                ["Invoice due", "28 Feb 2027"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-semibold text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
