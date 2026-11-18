"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Small screens: one menu button that opens the site links as a panel under the header. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(usePathname());
  const path = usePathname();
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="state-layer flex size-10 items-center justify-center rounded-full text-aubergine-800"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full grid border-b border-ink-100 bg-white transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav aria-label="Main, small screens" className="overflow-hidden">
          <ul className="space-y-1 px-4 pt-3 pb-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={path === l.href ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold ${path === l.href ? "bg-aubergine-50 text-aubergine-800" : "text-ink-700 hover:bg-ink-50"}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-ink-100 pt-3">
              <Link href="/login" className="block rounded-xl px-4 py-3 text-base font-semibold text-aubergine-500 hover:bg-ink-50">
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
