import Link from "next/link";
import { DashboardBand } from "@/components/dashboard-band";
import { ButtonLink, Card, Label, StatusPill } from "@/components/ui";
import { applicationStages, businessApplication, kybStages } from "@/lib/data";
import { cedis } from "@/lib/format";

export default function BusinessOverview() {
  const overall = Math.round(kybStages.reduce((s, k) => s + k.done, 0) / kybStages.length);
  const app = businessApplication;
  return (
    <>
      <DashboardBand
        eyebrow="Business overview"
        greeting="Good morning, Abrewa Trading"
        figureLabel="Financing requested"
        figure={cedis(app.amount)}
        action={<ButtonLink href="/business/applications/new" variant="accent">New application</ButtonLink>}
        stats={[
          { label: "Application stage", value: `${app.stageIndex + 1} of ${applicationStages.length}`, hint: applicationStages[app.stageIndex] },
          { label: "Verification", value: `${overall}%`, hint: "Across five stages" },
          { label: "Open requests", value: String(app.requests.length), hint: `Due ${app.requests[0]?.due ?? "-"}` },
          { label: "Active facilities", value: "0", hint: "After disbursement" },
        ]}
      />
      <div className="mt-6" />

      <div className="stagger grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Label>Current application</Label>
              <h2 className="mt-1 text-xl font-bold text-aubergine-800">
                {app.product} · {cedis(app.amount)}
              </h2>
              <p className="mt-1 font-mono text-xs text-ink-500">{app.ref}</p>
            </div>
            <StatusPill tone="brand">In review</StatusPill>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-ink-800">{applicationStages[app.stageIndex]}</span>
              <span className="font-mono text-ink-500">
                Stage {app.stageIndex + 1} of {applicationStages.length}
              </span>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {applicationStages.map((s, i) => (
                <span key={s} className={`h-2 flex-1 rounded-sm ${i < app.stageIndex ? "bg-aubergine-800" : i === app.stageIndex ? "bg-saffron-500" : "bg-ink-100"}`} />
              ))}
            </div>
          </div>
          <Link href="/business/applications" className="mt-5 inline-block text-sm font-semibold text-aubergine-500 hover:underline">
            View tracker →
          </Link>
        </Card>

        <Card>
          <Label>Verification</Label>
          <p className="mt-2 font-mono text-4xl font-medium text-aubergine-800">{overall}%</p>
          <p className="text-sm text-ink-600">complete across five stages</p>
          <ul className="mt-4 space-y-2">
            {kybStages.map((k) => (
              <li key={k.name} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-ink-700">{k.name}</span>
                <span className={`font-mono text-xs ${k.done === 100 ? "text-success-600" : "text-saffron-800"}`}>{k.done}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="stagger mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <Label>Needs your attention</Label>
          <ul className="mt-3 divide-y divide-ink-100">
            {app.requests.map((r) => (
              <li key={r.title} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-ink-800">{r.title}</p>
                  <p className="text-sm text-ink-500">Due {r.due}</p>
                </div>
                <ButtonLink href="/business/applications" variant="secondary">
                  Respond
                </ButtonLink>
              </li>
            ))}
            <li className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-ink-800">Add your remaining shareholder</p>
                <p className="text-sm text-ink-500">Ownership adds up to 80%</p>
              </div>
              <ButtonLink href="/business/verification" variant="secondary">
                Complete
              </ButtonLink>
            </li>
          </ul>
        </Card>
        <Card>
          <Label>Facilities</Label>
          <p className="mt-3 text-ink-600">No active facilities yet. Once a campaign funds and money is disbursed, your repayment schedule appears here.</p>
        </Card>
      </div>
    </>
  );
}
