"use client";

import { MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { requestVerifyAccess } from "@/lib/waitlist";
import { Button, FilterChip } from "./ui";

const field =
  "mt-1.5 w-full rounded-lg bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";
const needs = ["Individual checks", "Business checks", "Ongoing monitoring", "API access"];
const volumes = ["Under 50", "50 to 500", "500 to 5,000", "Over 5,000"];
const sectors = ["Bank or savings and loans", "Microfinance or lender", "Fintech or payments", "Corporate or supplier vetting", "Property or rentals", "Other"];

export function VerifyAccessForm() {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", sector: "", monthlyChecks: "", note: "", website: "" });
  const [picked, setPicked] = useState<string[]>(["Business checks"]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await requestVerifyAccess({ ...form, needs: picked });
      if (r.ok) setDone(r.message);
      else setError(r.message);
    } catch {
      setError("We couldn't reach Serwaa. Check your connection and try again.");
    }
    setBusy(false);
  }

  if (done)
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-ink-200" role="status">
        <MailCheck className="mx-auto size-10 text-aubergine-800" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-aubergine-800">You&apos;re on the list</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-700">{done}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-ink-200 sm:grid-cols-2 sm:p-8">
      <label className="block text-sm font-semibold text-ink-800">
        Your name
        <input required autoComplete="name" value={form.name} onChange={set("name")} className={field} />
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        Work email
        <input type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={field} placeholder="you@company.com" />
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        Organisation
        <input required autoComplete="organization" value={form.organisation} onChange={set("organisation")} className={field} />
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        What you do
        <select value={form.sector} onChange={set("sector")} className={field}>
          <option value="">Choose one</option>
          {sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold text-ink-800">What you&apos;d use</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {needs.map((n) => (
            <FilterChip key={n} selected={picked.includes(n)} onClick={() => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))}>
              {n}
            </FilterChip>
          ))}
        </div>
      </fieldset>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold text-ink-800">Checks a month, roughly</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {volumes.map((v) => (
            <FilterChip key={v} selected={form.monthlyChecks === v} onClick={() => setForm((f) => ({ ...f, monthlyChecks: f.monthlyChecks === v ? "" : v }))}>
              {v}
            </FilterChip>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-semibold text-ink-800 sm:col-span-2">
        Anything we should know <span className="font-normal text-ink-500">(optional)</span>
        <textarea rows={3} value={form.note} onChange={set("note")} className={field} placeholder="Who you need to check, and how you do it today" />
      </label>
      {/* Hidden from people; bots fill it in and get quietly ignored. */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")} className="hidden" name="website" />
      {error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm font-semibold text-danger-600 sm:col-span-2" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Request early access"}
        </Button>
        <p className="text-xs leading-5 text-ink-500">No charge and no commitment. We&apos;ll contact you before anything is set up.</p>
      </div>
    </form>
  );
}
