import type { Metadata } from "next";
import { Button, Card, Label, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "New application" };

const products = [
  "Invoice financing",
  "Purchase order financing",
  "Contract financing",
  "Working capital financing",
  "Inventory financing",
  "Equipment financing",
];

const field = "mt-1.5 w-full rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

export default function NewApplicationPage() {
  return (
    <>
      <PageHeader eyebrow="New application" title="Apply for financing" />
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <form className="space-y-8">
            <fieldset>
              <legend className="text-lg font-bold text-aubergine-800">Financing requirements</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink-800 sm:col-span-2">
                  Structure
                  <select id="product" className={field} defaultValue="Invoice financing">
                    {products.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-ink-800">
                  Amount (GH₵)
                  <input id="amount" inputMode="numeric" className={`${field} font-mono`} placeholder="400,000" />
                </label>
                <label className="block text-sm font-semibold text-ink-800">
                  Repayment period
                  <input id="tenor" className={field} placeholder="3 months" />
                </label>
                <label className="block text-sm font-semibold text-ink-800 sm:col-span-2">
                  Purpose
                  <textarea id="purpose" rows={3} className={field} placeholder="Advance against an invoice to a supermarket chain, due 28 February" />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-lg font-bold text-aubergine-800">Invoice details</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-ink-800">
                  Invoice value (GH₵)
                  <input id="invoice-value" inputMode="numeric" className={`${field} font-mono`} placeholder="480,000" />
                </label>
                <label className="block text-sm font-semibold text-ink-800">
                  Payment due date
                  <input id="due" type="date" className={field} />
                </label>
                <label className="block text-sm font-semibold text-ink-800 sm:col-span-2">
                  Debtor
                  <input id="debtor" className={field} placeholder="Customer name and registration number" />
                </label>
              </div>
            </fieldset>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled title="Saving is not enabled in the prototype">
                Submit application
              </Button>
              <Button type="button" variant="secondary" disabled title="Saving is not enabled in the prototype">
                Save draft
              </Button>
            </div>
          </form>
        </Card>
        <Card className="h-fit bg-aubergine-50 ring-aubergine-100">
          <Label>Prefilled from your profile</Label>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>Company identity and registration</li>
            <li>Directors, shareholders and owners</li>
            <li>Verified corporate documents</li>
            <li>Audited accounts 2025</li>
          </ul>
          <p className="mt-4 text-sm text-ink-600">You only answer what is specific to this deal.</p>
        </Card>
      </div>
    </>
  );
}
