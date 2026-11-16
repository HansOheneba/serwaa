import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Operations", template: "%s · Operations · Serwaa" } };

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return (
    <AppShell
      portal="Operations"
      user={{ name: "A. Mensah", detail: "Credit analyst" }}
      nav={[
        { href: "/ops", label: "Application queue", icon: "queue", count: 5 },
        { href: "/ops/campaigns", label: "Campaigns", icon: "campaigns", count: 3 },
        { href: "/ops/reconciliation", label: "Reconciliation", icon: "reconcile", count: 3 },
      ]}
      action={{ href: "/ops", label: "Review next", icon: "queue" }}
      search={{ href: "/ops", placeholder: "Search businesses and references" }}
      metric={{ label: "In queue", value: "5" }}
    >
      {children}
    </AppShell>
  );
}
