"use client";

import {
  Bell,
  Compass,
  FileText,
  HelpCircle,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Menu,
  Plus,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Fab } from "./ui";

const icons = {
  overview: LayoutDashboard,
  verify: ShieldCheck,
  applications: FileText,
  facilities: Landmark,
  portfolio: Wallet,
  discover: Compass,
  profile: UserRound,
  queue: ListChecks,
  campaigns: Megaphone,
  reconcile: Scale,
  plus: Plus,
};
export type IconName = keyof typeof icons;

export type NavItem = { href: string; label: string; icon: IconName; count?: number };

/**
 * Gmail-style workspace: a top bar with search, a navigation drawer led by an
 * extended FAB, and the page on a white panel floating over the woven background.
 */
export function AppShell({
  portal,
  user,
  nav,
  action,
  search,
  children,
}: {
  portal: string;
  user: { name: string; detail: string };
  nav: NavItem[];
  action: { href: string; label: string; icon: IconName };
  search: { href: string; placeholder: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || (href !== nav[0].href && pathname.startsWith(`${href}/`));
  const ActionIcon = icons[action.icon];
  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `${search.href}?q=${encodeURIComponent(q)}` : search.href);
  }

  const drawer = (compact: boolean) => (
    <nav aria-label={`${portal} navigation`} className="flex flex-col gap-4">
      <div className="px-2">
        <Fab href={action.href} className={compact ? "w-14 justify-center px-0" : ""} aria-label={compact ? action.label : undefined}>
          <ActionIcon aria-hidden="true" />
          {!compact && action.label}
        </Fab>
      </div>
      <ul className="flex flex-col">
        {nav.map((item) => {
          const Icon = icons[item.icon];
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                title={compact ? item.label : undefined}
                className={`state-layer flex h-8 items-center gap-4 text-sm tracking-[0.1px] ${
                  compact ? "mx-2 w-14 justify-center rounded-full" : "mr-2 rounded-r-full pr-4 pl-6"
                } ${active ? "bg-aubergine-100 font-bold text-aubergine-900" : "font-medium text-ink-800"}`}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {!compact && <span className="flex-1 truncate">{item.label}</span>}
                {!compact && item.count !== undefined && <span className="font-mono text-xs">{item.count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="relative flex min-h-svh flex-col bg-ink-50">
      {/* The woven background, like a Gmail theme behind the workspace. */}
      <div className="weave pointer-events-none fixed inset-0 opacity-70" aria-hidden="true" />

      <header className="relative z-20 flex h-16 items-center gap-2 px-2 sm:px-4">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => (window.innerWidth >= 1024 ? setCollapsed((c) => !c) : setMobileOpen((o) => !o))}
          className="state-layer flex size-12 shrink-0 items-center justify-center rounded-full text-ink-700"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <Link href="/" className="mr-4 hidden shrink-0 items-center gap-2 rounded sm:flex lg:w-[184px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-logo.svg" alt="Serwaa home" className="h-7 w-auto" />
        </Link>
        <form
          onSubmit={onSearch}
          role="search"
          className="flex h-12 max-w-3xl min-w-0 flex-1 items-center gap-1 rounded-full bg-white/90 px-1 ring-1 ring-ink-100 backdrop-blur focus-within:bg-white focus-within:elev-1"
        >
          <button type="submit" aria-label="Search" className="state-layer flex size-10 shrink-0 items-center justify-center rounded-full text-ink-700">
            <Search className="size-5" aria-hidden="true" />
          </button>
          <input
            name="q"
            type="search"
            placeholder={search.placeholder}
            aria-label={search.placeholder}
            className="h-full min-w-0 flex-1 bg-transparent pr-3 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none"
          />
        </form>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-2 hidden h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-ink-800 ring-1 ring-ink-100 xl:inline-flex">
            <span className="size-2.5 rounded-full bg-success-600" aria-hidden="true" />
            {portal}
          </span>
          {[
            { label: "Help", Icon: HelpCircle },
            { label: "Notifications", Icon: Bell },
            { label: "Settings", Icon: Settings },
          ].map(({ label, Icon }) => (
            <button key={label} type="button" aria-label={label} className="state-layer hidden size-12 items-center justify-center rounded-full text-ink-700 md:flex">
              <Icon className="size-6" aria-hidden="true" />
            </button>
          ))}
          <Link
            href="/login"
            title={`${user.name} · ${user.detail}. Switch account`}
            aria-label={`${user.name}, switch account`}
            className="ml-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-aubergine-800 text-sm font-bold text-saffron-300 ring-2 ring-white"
          >
            {initials}
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1">
        <aside className={`hidden shrink-0 pt-2 lg:block ${collapsed ? "w-20" : "w-64"}`}>
          <div className="sticky top-2">{drawer(collapsed)}</div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-aubergine-950/40" onClick={() => setMobileOpen(false)} />
            <aside className="rise-in elev-3 absolute inset-y-0 left-0 w-72 rounded-r-2xl bg-ink-50 pt-4">
              <div className="mb-4 px-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/serwaa-logo.svg" alt="Serwaa" className="h-7 w-auto" />
              </div>
              {drawer(false)}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 pb-4 sm:pr-4 sm:pl-2 lg:pl-0">
          <div className="min-h-[calc(100svh-5rem)] bg-white px-4 py-6 sm:rounded-2xl sm:px-8 sm:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
