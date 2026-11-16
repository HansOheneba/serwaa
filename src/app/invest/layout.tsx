import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Investor portal", template: "%s · Investor · Serwaa" } };

export default function InvestLayout({ children }: LayoutProps<"/invest">) {
  return (
    <AppShell
      portal="Investor"
      user={{ name: "Demo investor", detail: "Income focused profile" }}
      nav={[
        { href: "/invest", label: "Portfolio" },
        { href: "/invest/discover", label: "Discover" },
        { href: "/invest/profile", label: "My profile" },
      ]}
    >
      {children}
    </AppShell>
  );
}
