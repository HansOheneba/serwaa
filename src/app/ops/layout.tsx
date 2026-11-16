import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Operations", template: "%s · Operations · Serwaa" } };

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return (
    <AppShell
      portal="Operations"
      user={{ name: "A. Mensah", detail: "Credit analyst" }}
      nav={[
        { href: "/ops", label: "Application queue" },
        { href: "/ops/campaigns", label: "Campaigns" },
        { href: "/ops/reconciliation", label: "Reconciliation" },
      ]}
    >
      {children}
    </AppShell>
  );
}
