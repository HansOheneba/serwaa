import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Operations", template: "%s · Operations · Serwaa" } };

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return (
    <AppShell
      audience="ops"
      portal="Operations"
      user={{ name: "Serwaa team", detail: "Staff" }}
      nav={[
        { href: "/ops", label: "Application queue", icon: "queue" },
        { href: "/ops/campaigns", label: "Campaigns", icon: "campaigns" },
        { href: "/ops/reconciliation", label: "Reconciliation", icon: "reconcile" },
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
