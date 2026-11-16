import type { Metadata } from "next";
import { Card, PageHeader, StatusPill } from "@/components/ui";
import { kybStages } from "@/lib/data";

export const metadata: Metadata = { title: "Verification" };

const items: Record<string, { name: string; status: "Verified" | "Processing" | "Required" | "Information required" }[]> = {
  "Business identity": [
    { name: "Registered name and number", status: "Verified" },
    { name: "Registered and operating address", status: "Verified" },
    { name: "Tax identification", status: "Verified" },
  ],
  "Ownership and management": [
    { name: "Directors (2)", status: "Verified" },
    { name: "Shareholders (80% declared)", status: "Information required" },
    { name: "Ultimate beneficial owners", status: "Processing" },
  ],
  "Corporate documents": [
    { name: "Certificate of incorporation", status: "Verified" },
    { name: "Constitution", status: "Verified" },
    { name: "Registry extract", status: "Verified" },
  ],
  "Financial documents": [
    { name: "Audited accounts 2025", status: "Verified" },
    { name: "Management accounts 2026", status: "Processing" },
    { name: "Bank statements, last 6 months", status: "Required" },
  ],
  "Commercial evidence": [
    { name: "Customer invoice", status: "Verified" },
    { name: "Supply agreement", status: "Verified" },
    { name: "Proof of delivery", status: "Processing" },
  ],
};

const tone = { Verified: "good", Processing: "neutral", Required: "warn", "Information required": "bad" } as const;

export default function VerificationPage() {
  return (
    <>
      <PageHeader eyebrow="Verification" title="Business verification" />
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">
        Five stages establish who your business is and who owns it. Save at any point and come back. Credit review can&apos;t start until every
        mandatory item is complete.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {kybStages.map((k, i) => (
          <Card key={k.name}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-aubergine-800">
                <span className="mr-2 font-mono text-sm text-ink-400">{i + 1}</span>
                {k.name}
              </h2>
              <span className="font-mono text-sm">{k.done}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div className={`h-full ${k.done === 100 ? "bg-success-600" : "bg-saffron-500"}`} style={{ width: `${k.done}%` }} />
            </div>
            <ul className="mt-4 divide-y divide-ink-100">
              {items[k.name].map((it) => (
                <li key={it.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="text-ink-700">{it.name}</span>
                  <StatusPill tone={tone[it.status]}>{it.status}</StatusPill>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
