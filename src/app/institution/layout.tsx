import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Corporate investors", template: "%s · Corporate · Serwaa" } };

export default function InstitutionLayout({ children }: LayoutProps<"/institution">) {
  return (
    <AppShell
      audience="institution"
      portal="Corporate"
      user={{ name: "Your organisation", detail: "Corporate investor" }}
      nav={[
        { href: "/institution", label: "Overview", icon: "overview" },
        { href: "/institution/pipeline", label: "Pipeline", icon: "discover" },
        { href: "/institution/portfolio", label: "Portfolio", icon: "portfolio" },
        { href: "/institution/team", label: "Team and roles", icon: "profile" },
        { href: "/institution/mandate", label: "Mandate", icon: "verify" },
      ]}
      action={{ href: "/institution/pipeline", label: "Review pipeline", icon: "discover" }}
      search={{ href: "/institution/pipeline", placeholder: "Search deals in your mandate" }}
    >
      {children}
    </AppShell>
  );
}
