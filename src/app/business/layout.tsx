import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Business portal", template: "%s · Business · Serwaa" } };

export default function BusinessLayout({ children }: LayoutProps<"/business">) {
  return (
    <AppShell
      audience="business"
      portal="Business"
      user={{ name: "Abrewa Trading Ltd", detail: "Finance lead" }}
      nav={[
        { href: "/business", label: "Overview", icon: "overview" },
        { href: "/business/verification", label: "Verification", icon: "verify", count: 3 },
        { href: "/business/applications", label: "Applications", icon: "applications", count: 1 },
        { href: "/business/facilities", label: "Repayments", icon: "facilities" },
      ]}
      action={{ href: "/business/applications/new", label: "New application", icon: "plus" }}
      search={{ href: "/business/applications", placeholder: "Search applications and documents" }}
      metric={{ label: "Verified", value: "86%" }}
    >
      {children}
    </AppShell>
  );
}
