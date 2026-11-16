import type { Metadata } from "next";
import { FacilityView } from "@/components/business-views";

export const metadata: Metadata = { title: "Repayments" };

export default function FacilitiesPage() {
  return <FacilityView />;
}
