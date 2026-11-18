"use client";

import { Check, Copy, Landmark, Loader2, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui";
import { cedis } from "@/lib/format";
import { confirmMomo, invest, paymentFee, reinvestCash, useWorkspace, type Campaign, type Investor } from "@/lib/store";

const methods = ["MTN MoMo", "Telecel Cash", "AT Money", "Bank transfer"];

function CopyField({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-aubergine-700/60 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-aubergine-200">{label}</p>
        <p className="truncate font-mono text-sm">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={() =>
          navigator.clipboard?.writeText(value).then(
            () => (setDone(true), setTimeout(() => setDone(false), 1500)),
            () => undefined,
          )
        }
        className="state-layer flex size-9 shrink-0 items-center justify-center rounded-full text-saffron-300"
      >
        {done ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

/** Choose an amount, see the charges, pay by Mobile Money, bank transfer or available balance. */
export function InvestPanel({ c, investor = "individual", afterHref }: { c: Campaign; investor?: Investor; afterHref: string }) {
  const ws = useWorkspace();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(methods[0]);
  const [number, setNumber] = useState(ws.payout.number);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"form" | "momo" | "bank">("form");
  const [pending, setPending] = useState<{ id: string; payRef: string; total: number } | null>(null);
  const value = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const useBalance = method === "Available balance";
  const fee = useBalance ? 0 : paymentFee(ws.fees, method, value);
  const canUseBalance = investor === "individual" && ws.cash.available >= c.minTicket;

  // The Mobile Money provider calls back once the payer approves on their phone.
  useEffect(() => {
    if (stage !== "momo" || !pending) return;
    const t = setTimeout(() => {
      confirmMomo(pending.id);
      router.push(afterHref);
    }, 3500);
    return () => clearTimeout(t);
  }, [stage, pending, router, afterHref]);

  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    setBusy(true);
    const done = (message: string) => (setBusy(false), setError(message));
    if (useBalance) {
      const r = await reinvestCash(c.id, value);
      if (!r.ok) return done(r.message);
      return router.push(afterHref);
    }
    const r = await invest(c.id, value, method, number);
    setBusy(false);
    if (!r.ok || !r.id) return done(r.message);
    setPending({ id: r.id, payRef: r.payRef!, total: value + fee });
    setStage(method === "Bank transfer" ? "bank" : "momo");
  }

  if (stage === "momo" && pending)
    return (
      <div className="text-center" role="status">
        <Smartphone className="mx-auto size-10 text-saffron-300" aria-hidden="true" />
        <p className="mt-4 text-xl font-bold">Approve the payment on your phone</p>
        <p className="mt-2 text-sm leading-6 text-aubergine-100">
          We&apos;ve sent a {method} prompt for {cedis(pending.total, true)} to {number}. Enter your PIN on your phone, never on this page.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-aubergine-200">
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Waiting for your approval…
        </p>
      </div>
    );

  if (stage === "bank" && pending)
    return (
      <div>
        <Landmark className="size-9 text-saffron-300" aria-hidden="true" />
        <p className="mt-4 text-xl font-bold">Transfer {cedis(pending.total, true)}</p>
        <p className="mt-2 text-sm leading-6 text-aubergine-100">Pay into the custodian account below. Use the reference exactly, so we can match your money to you.</p>
        <div className="mt-5 space-y-2">
          <CopyField label="Account name" value="Serwaa Investor Trust" />
          <CopyField label="Reference" value={pending.payRef} />
          <CopyField label="Amount" value={pending.total.toFixed(2)} />
        </div>
        <p className="mt-4 text-xs text-aubergine-200">Pay within 48 hours. The custodian&apos;s account number is shown here once the custody agreement is signed.</p>
        <Button variant="accent" className="mt-6 w-full" onClick={() => router.push(afterHref)}>
          I&apos;ve made the transfer
        </Button>
      </div>
    );

  return (
    <div>
      <label className="block text-sm font-semibold">
        How much do you want to invest? (GH₵)
        <input
          className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 font-mono text-ink-900 focus:ring-2 focus:ring-saffron-400 focus:outline-none"
          inputMode="numeric"
          value={amount}
          onChange={(e) => (setAmount(e.target.value), setError(""))}
          placeholder={`From ${c.minTicket.toLocaleString()}`}
        />
      </label>
      <p className="mt-5 text-sm font-semibold">Pay with</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[...methods, ...(canUseBalance ? ["Available balance"] : [])].map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={method === m}
            onClick={() => setMethod(m)}
            className={`state-layer h-9 rounded-lg px-3.5 text-sm font-semibold ${method === m ? "bg-saffron-400 text-aubergine-950" : "text-aubergine-100 ring-1 ring-inset ring-white/25"}`}
          >
            {m}
          </button>
        ))}
      </div>
      {!useBalance && method !== "Bank transfer" && (
        <label className="mt-5 block text-sm font-semibold">
          Mobile Money number
          <input
            className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3 font-mono text-ink-900 focus:ring-2 focus:ring-saffron-400 focus:outline-none"
            inputMode="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="024 123 4567"
          />
        </label>
      )}
      {useBalance && <p className="mt-4 text-sm text-aubergine-100">You have {cedis(ws.cash.available, true)} from repayments, held by the custodian. No new payment needed.</p>}
      {value > 0 && (
        <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-aubergine-200">Investment</dt>
            <dd className="font-mono">{cedis(value, true)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-aubergine-200">{useBalance ? "Charges" : `${method} charge`}</dt>
            <dd className="font-mono">{cedis(fee, true)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>You pay</dt>
            <dd className="font-mono">{cedis(value + fee, true)}</dd>
          </div>
        </dl>
      )}
      {error && <p className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-saffron-200">{error}</p>}
      <Button variant="accent" className="mt-6 w-full" onClick={submit} disabled={busy}>
        {useBalance ? "Reinvest" : "Invest"} {value ? cedis(value + fee) : ""}
      </Button>
      <p className="mt-3 text-center text-xs text-aubergine-200">Your money goes to a licensed custodian, never to Serwaa.</p>
    </div>
  );
}
