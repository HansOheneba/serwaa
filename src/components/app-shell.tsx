"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "./brand";
import { Weave } from "./weave";

export type NavItem = { href: string; label: string };

export function AppShell({
  portal,
  user,
  nav,
  children,
}: {
  portal: string;
  user: { name: string; detail: string };
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== nav[0].href && pathname.startsWith(`${href}/`));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ink-50">
      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="relative border-b border-aubergine-900 bg-aubergine-800 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0">
          <Weave tone="dark" fade="t" className="inset-x-0 bottom-0 hidden h-56 lg:block" />
          <div className="relative flex items-center justify-between gap-4 px-5 py-4 lg:py-6">
            <Logo reversed className="h-6" />
            <span className="rounded-full bg-aubergine-700 px-2.5 py-0.5 text-xs font-semibold text-aubergine-100">
              {portal}
            </span>
          </div>
          <nav aria-label={`${portal} navigation`} className="relative overflow-x-auto px-3 pb-3 lg:flex-1 lg:pb-0">
            <ul className="flex gap-1 lg:flex-col">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        active ? "bg-aubergine-700 text-white" : "text-aubergine-200 hover:bg-aubergine-700/60 hover:text-white"
                      }`}
                    >
                      {active && <span className="mr-2 inline-block h-3 w-1 rounded-sm bg-saffron-500 align-middle" aria-hidden="true" />}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="relative hidden border-t border-aubergine-700 px-5 py-4 lg:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-aubergine-200">{user.detail}</p>
            <Link href="/login" className="mt-3 inline-block text-xs font-semibold text-saffron-300 hover:underline">
              Switch account
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
