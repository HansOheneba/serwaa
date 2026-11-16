import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: { default: "Business portal", template: "%s · Business · Serwaa" } };

export default function BusinessLayout({ children }: LayoutProps<"/business">) {
  return (
    <AppShell
      portal="Business"
      user={{ name: "Abrewa Agro Processing Ltd", detail: "Finance lead" }}
      nav={[
        { href: "/business", label: "Overview" },
        { href: "/business/verification", label: "Verification" },
        { href: "/business/applications", label: "Applications" },
        { href: "/business/facilities", label: "Facilities" },
      ]}
    >
      {children}
    </AppShell>
  );
}
