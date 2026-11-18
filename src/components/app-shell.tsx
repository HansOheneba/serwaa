"use client";

import {
  BookOpen,
  ChevronsUpDown,
  Compass,
  FileText,
  HelpCircle,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Mark } from "./brand";
import { NotificationBell } from "./notifications";
import type { Audience } from "@/lib/store";
import { ButtonLink } from "./ui";

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
  accounts: Users,
  ledger: BookOpen,
  team: UserCog,
  fees: Percent,
};
export type IconName = keyof typeof icons;

export type NavItem = { href: string; label: string; icon: IconName; count?: number };

/**
 * The Serwaa workspace. A dark aubergine frame holds the navigation and the
 * command bar; the work itself sits on a white panel. The woven pattern lives
 * only in the frame's top band, where nothing has to be read over it.
 */
export function AppShell({
  portal,
  user,
  nav,
  action,
  search,
  metric,
  audience,
  children,
}: {
  portal: string;
  user: { name: string; detail: string };
  nav: NavItem[];
  action: { href: string; label: string; icon: IconName };
  search: { href: string; placeholder: string };
  /** One live figure shown in the command bar, e.g. verification progress. */
  metric?: { label: string; value: string };
  /** Which portal this is, for notifications. */
  audience: Audience;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
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

  // ⌘K / Ctrl+K or "/" focuses the command search, wherever you are.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `${search.href}?q=${encodeURIComponent(q)}` : search.href);
  }

  // One drawer for both states. Icons never move; labels, counts and the account
  // card fade and clip while the column width eases, so collapsing is a glide.
  const fade = (compact: boolean) =>
    `whitespace-nowrap transition-opacity duration-200 ${compact ? "pointer-events-none opacity-0" : "opacity-100 delay-100"}`;

  const drawer = (compact: boolean) => (
    <nav aria-label={`${portal} navigation`} className="flex h-full flex-col overflow-hidden">
      <div className="px-3">
        <ButtonLink
          href={action.href}
          variant="accent"
          onClick={() => setMobileOpen(false)}
          aria-label={action.label}
          title={compact ? action.label : undefined}
          className="w-full justify-start! overflow-hidden has-[>svg:first-child]:pl-[15px]!"
        >
          <ActionIcon aria-hidden="true" />
          <span className={fade(compact)}>{action.label}</span>
        </ButtonLink>
      </div>

      <ul className="mt-6 flex flex-col gap-0.5 px-3">
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
                className={`state-layer relative flex h-10 items-center gap-3 overflow-hidden rounded-xl px-[15px] text-sm tracking-[0.1px] transition-colors ${
                  active ? "bg-white/10 font-bold text-white" : "font-medium text-aubergine-200 hover:text-white"
                }`}
              >
                {/* The saffron thread marks where you are, echoing the mark. */}
                <span
                  className={`absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-saffron-400 transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className={`flex-1 truncate ${fade(compact)}`}>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`rounded-md px-1.5 font-mono text-[11px] ${fade(compact)} ${
                      active ? "bg-saffron-400 text-aubergine-950" : "bg-white/10 text-aubergine-100"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={`mx-3 mt-auto mb-4 w-[13.5rem] rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 ${fade(compact)}`} aria-hidden={compact}>
        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-aubergine-200">{user.detail}</p>
        <Link href="/login" tabIndex={compact ? -1 : undefined} className="mt-3 inline-block text-xs font-semibold text-saffron-300 hover:underline">
          Switch account
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-aubergine-900">
      {/* Pattern only in the header strip beside the navigation; every control on it has a solid fill. */}
      <div className="weave-dark fade-x pointer-events-none absolute top-0 right-0 left-0 h-16 opacity-70 lg:left-60" aria-hidden="true" />

      <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 px-3 sm:px-4">
        {/* Sits directly above the navigation it controls: collapses it on desktop, opens it on phones. */}
        <button
          type="button"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
          onClick={() => (window.matchMedia("(min-width: 1024px)").matches ? setCollapsed((c) => !c) : setMobileOpen(true))}
          className="state-layer flex size-10 shrink-0 items-center justify-center rounded-full text-aubergine-100"
        >
          <Menu className="size-5 lg:hidden" aria-hidden="true" />
          {collapsed ? (
            <PanelLeftOpen className="hidden size-5 lg:block" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="hidden size-5 lg:block" aria-hidden="true" />
          )}
        </button>
        <Link href="/" className="flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-saffron-400 lg:w-[11.5rem]">
          <Mark reversed className="size-7 lg:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-logo-reversed.svg" alt="Serwaa home" className="hidden h-7 w-auto lg:block" />
        </Link>

        <Link
          href="/login"
          className="state-layer hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-aubergine-800 px-3 text-sm text-white ring-1 ring-white/10 md:inline-flex"
          title="Switch account"
        >
          <span className="size-2 rounded-full bg-saffron-400" aria-hidden="true" />
          <span className="font-semibold">{portal}</span>
          <span className="max-w-40 truncate text-aubergine-200">{user.name}</span>
          <ChevronsUpDown className="size-4 text-aubergine-200" aria-hidden="true" />
        </Link>

        <form
          onSubmit={onSearch}
          role="search"
          className="group flex h-10 max-w-xl min-w-0 flex-1 items-center gap-2 rounded-xl bg-aubergine-800 pr-1.5 pl-3 ring-1 ring-white/10 transition-colors focus-within:bg-white focus-within:ring-white"
        >
          <Search className="size-[18px] shrink-0 text-aubergine-200 group-focus-within:text-aubergine-700" aria-hidden="true" />
          <input
            ref={searchRef}
            name="q"
            type="search"
            placeholder={search.placeholder}
            aria-label={search.placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-aubergine-300 focus:outline-none group-focus-within:text-ink-900 group-focus-within:placeholder:text-ink-400"
          />
          <kbd className="hidden shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-aubergine-200 group-focus-within:hidden sm:block">
            ⌘K
          </kbd>
        </form>

        <div className="ml-auto flex items-center gap-1">
          {metric && (
            <div className="mr-2 hidden items-baseline gap-2 rounded-xl bg-aubergine-800 px-3 py-2 ring-1 ring-white/10 xl:flex">
              <span className="font-mono text-[11px] tracking-[0.08em] text-aubergine-200 uppercase">{metric.label}</span>
              <span className="font-mono text-sm font-medium text-saffron-300">{metric.value}</span>
            </div>
          )}
          <a
            href="/faq"
            aria-label="Help"
            className="state-layer hidden size-10 items-center justify-center rounded-full bg-aubergine-900 text-aubergine-100 sm:flex"
          >
            <HelpCircle className="size-5" aria-hidden="true" />
          </a>
          <NotificationBell audience={audience} />
          <span className="ml-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-saffron-400 text-sm font-bold text-aubergine-950" aria-label={user.name} title={`${user.name} · ${user.detail}`}>
            {initials}
          </span>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        <aside className={`hidden shrink-0 overflow-hidden pt-3 transition-[width] duration-300 ease-[var(--ease-in-out)] motion-reduce:transition-none lg:block ${collapsed ? "w-[4.5rem]" : "w-60"}`}>
          <div className="h-full pb-1">{drawer(collapsed)}</div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-aubergine-950/60" onClick={() => setMobileOpen(false)} />
            <aside className="rise-in absolute inset-y-0 left-0 flex w-72 flex-col bg-aubergine-900 pt-5">
              <div className="mb-5 px-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/serwaa-logo-reversed.svg" alt="Serwaa" className="h-7 w-auto" />
              </div>
              <div className="flex-1">{drawer(false)}</div>
            </aside>
          </div>
        )}

        {/* Only the work panel scrolls; the frame, command bar and navigation stay fixed. */}
        <main className="flex min-w-0 flex-1 flex-col sm:pr-3 sm:pb-3 lg:pl-0">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 py-8 [scrollbar-gutter:stable] sm:rounded-[1.25rem] sm:px-10 sm:py-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
