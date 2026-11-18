import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Operations", template: "%s · Operations · Serwaa" } };

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return (
    <AppShell
      audience="ops"
      portal="Operations"
      user={{ name: "A. Mensah", detail: "Credit analyst" }}
      nav={[
        { href: "/ops", label: "Application queue", icon: "queue", count: 5 },
        { href: "/ops/campaigns", label: "Campaigns", icon: "campaigns", count: 3 },
        { href: "/ops/reconciliation", label: "Reconciliation", icon: "reconcile", count: 3 },
        { href: "/ops/accounts", label: "Accounts", icon: "accounts" },
        { href: "/ops/ledger", label: "Ledger", icon: "ledger" },
        { href: "/ops/team", label: "Team and roles", icon: "team" },
        { href: "/ops/fees", label: "Fees", icon: "fees" },
      ]}
      action={{ href: "/ops", label: "Review next", icon: "queue" }}
      search={{ href: "/ops", placeholder: "Search businesses and references" }}
      metric={{ label: "In queue", value: "5" }}
    >
      {children}
    </AppShell>
  );
}
