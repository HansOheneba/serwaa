import type { Metadata } from "next";
import { AccountsView } from "@/components/backoffice-views";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Accounts" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Back office" title="Every business and investor" />
      <AccountsView />
    </>
  );
}
