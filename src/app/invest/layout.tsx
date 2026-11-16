import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Investor portal", template: "%s · Investor · Serwaa" } };

export default function InvestLayout({ children }: LayoutProps<"/invest">) {
  return (
    <AppShell
      portal="Investor"
      user={{ name: "Ama Owusu", detail: "Income focused profile" }}
      nav={[
        { href: "/invest", label: "Portfolio", icon: "portfolio" },
        { href: "/invest/discover", label: "Discover", icon: "discover", count: 3 },
        { href: "/invest/profile", label: "My profile", icon: "profile" },
      ]}
      action={{ href: "/invest/discover", label: "Find opportunities", icon: "discover" }}
      search={{ href: "/invest/discover", placeholder: "Search opportunities and sectors" }}
      metric={{ label: "Outstanding", value: "GH₵ 18,750" }}
    >
      {children}
    </AppShell>
  );
}
