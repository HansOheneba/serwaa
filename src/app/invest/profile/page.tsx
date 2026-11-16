import type { Metadata } from "next";
import { Card, PageHeader, StatusPill } from "@/components/ui";

export const metadata: Metadata = { title: "My profile" };

const profile: [string, string][] = [
  ["Objectives", "Regular income, diversification"],
  ["Risk willingness", "Moderate"],
  ["Capacity to bear loss", "Moderate"],
  ["Experience", "Fixed income; new to private credit"],
  ["Preferred structures", "Invoice and purchase order financing"],
  ["Preferred length", "Up to 6 months"],
  ["Liquidity needs", "Can lock funds for 6 months"],
  ["Preferred sectors", "Trade, manufacturing, logistics"],
  ["Concentration", "No more than 30% in one sector"],
  ["Outstanding checks", "Source of wealth (requested)"],
];

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="My profile" title="Income focused">
        <StatusPill tone="good">Identity verified</StatusPill>
      </PageHeader>
      <p className="-mt-4 mb-8 max-w-2xl text-ink-600">
        Built from your questionnaire answers. Edit your answers and your matches update. We&apos;ll remind you to review this every 12 months.
      </p>
      <Card className="p-0">
        <dl className="divide-y divide-ink-100">
          {profile.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr]">
              <dt className="text-sm text-ink-500">{k}</dt>
              <dd className="font-semibold text-ink-800">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
      <p className="mt-6 text-sm text-ink-500">
        Your profile helps us show relevant opportunities. It is not a suitability assessment or financial advice.
      </p>
    </>
  );
}
