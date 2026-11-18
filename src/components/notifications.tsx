"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { markAllRead, useWorkspace, type Audience } from "@/lib/store";

const when = (iso: string) => {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** Bell with an unread count; opens a panel of this portal's notifications. */
export function NotificationBell({ audience }: { audience: Audience }) {
  const { notes } = useWorkspace();
  const mine = notes.filter((n) => n.audience === audience).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="state-layer relative flex size-10 items-center justify-center rounded-full bg-aubergine-900 text-aubergine-100"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-saffron-400 px-1 font-mono text-[10px] leading-4 font-bold text-aubergine-950">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute top-12 right-0 z-40 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl bg-white p-2 text-ink-900 elev-3"
          style={{ animation: "pop-in 160ms var(--ease-out)" }}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-bold">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={() => markAllRead()} className="text-xs font-semibold text-aubergine-500 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {mine.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-500">You&apos;re all caught up.</li>}
            {mine.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href ?? "#"}
                  onClick={() => setOpen(false)}
                  className="state-layer flex gap-3 rounded-xl px-3 py-3 text-left"
                >
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-saffron-500"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className={`block text-sm ${n.read ? "font-medium text-ink-700" : "font-bold text-ink-900"}`}>{n.title}</span>
                    <span className="block text-xs leading-5 text-ink-600">{n.body}</span>
                    <span className="mt-1 block font-mono text-[11px] text-ink-400">{when(n.at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Inline feedback after an action: green for done, red for blocked. */
export function ActionResult({ result }: { result: { ok: boolean; message: string } | null }) {
  if (!result) return null;
  return (
    <p role="status" className={`mt-3 rounded-xl px-4 py-3 text-sm font-semibold ${result.ok ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600"}`}>
      {result.message}
    </p>
  );
}
