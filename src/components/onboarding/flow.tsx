"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mark } from "@/components/brand";
import { flows, initialState, investorProfile, stages, type Mode, type OnboardingState, type StepId } from "@/lib/onboarding";
import {
  AccountStep,
  BusinessStep,
  GoalsStep,
  MandateStep,
  ModeStep,
  NeedStep,
  OrganisationStep,
  PeopleStep,
  PreferencesStep,
  ReviewStep,
  RiskStep,
  type StepProps,
} from "./steps";

const STORAGE_KEY = "serwaa-onboarding-v1";

function load(): OnboardingState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

function save(state: OnboardingState | null) {
  try {
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: progress just won't survive a refresh */
  }
}

function StageIndicator({ mode, step }: { mode: Mode; step: StepId }) {
  const list = stages[mode];
  const current = list.findIndex((st) => st.steps.includes(step));
  return (
    <ol className="flex items-start justify-center" aria-label="Progress">
      {list.map((st, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={st.label}>
            <li className="flex w-16 flex-col items-center gap-2 sm:w-20" aria-current={active ? "step" : undefined}>
              <span
                className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-[background-color,box-shadow] duration-300 sm:size-9 ${
                  done
                    ? "bg-aubergine-800 text-white"
                    : active
                      ? "bg-aubergine-800 text-saffron-400 ring-4 ring-aubergine-100"
                      : "bg-white text-ink-400 ring-1 ring-ink-200"
                }`}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className={`text-xs font-semibold ${done || active ? "text-aubergine-800" : "text-ink-400"}`}>{st.label}</span>
            </li>
            {i < list.length - 1 && (
              <li aria-hidden="true" className="mt-4 h-0.5 w-6 overflow-hidden rounded bg-ink-200 sm:mt-[18px] sm:w-14">
                <span className="block h-full bg-aubergine-800 transition-[width] duration-500 ease-out" style={{ width: done ? "100%" : "0%" }} />
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}

function Complete({ s }: { s: OnboardingState }) {
  const name = s.account.firstName || "there";
  const profile = investorProfile(s.investor);
  const content: Record<Mode, { body: string; cta: string; href: string; extra?: React.ReactNode }> = {
    business: {
      body: "Your business account is ready. Next, upload your company documents so we can finish verification and you can apply.",
      cta: "Go to your dashboard",
      href: "/business",
      extra: (
        <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm text-aubergine-100">
          {["Certificate of incorporation", "Director and shareholder IDs", "Last 6 months of bank statements", s.need.product === "Invoice financing" ? "The invoice you want to finance" : "Your latest management accounts"].map((d) => (
            <li key={d} className="flex items-center gap-3 rounded-lg bg-aubergine-700/60 px-3 py-2">
              <span className="size-2 shrink-0 bg-saffron-400" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    investor: {
      body: `Your profile is ${profile?.category.toLowerCase() ?? "ready"}. Verify your identity from your dashboard, then review the opportunities matched to you.`,
      cta: "See your matches",
      href: "/invest/discover",
    },
    institution: {
      body: `Thanks. Our partnerships team will contact you within two working days to verify ${s.institution.orgName || "your organisation"} and set up your mandate.`,
      cta: "Back to Serwaa",
      href: "/",
    },
  };
  const c = content[s.mode];
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-aubergine-800 px-4 py-14 text-center">
      <div className="animate-step-in max-w-lg">
        <Mark reversed className="mx-auto size-14" />
        <h1 className="mt-8 text-3xl leading-tight font-extrabold tracking-[-0.025em] text-white sm:text-4xl">
          You&apos;re all set, <span className="text-saffron-400">{name}</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-aubergine-100 sm:text-lg">{c.body}</p>
        {c.extra}
        <Link
          href={c.href}
          className="mt-10 inline-flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-saffron-500 text-base font-semibold text-aubergine-900 transition-colors hover:bg-saffron-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {c.cta}
        </Link>
        <p className="mt-3 text-xs text-aubergine-300">You can update these details any time from your settings.</p>
      </div>
    </div>
  );
}

const STEP_COMPONENTS: Partial<Record<StepId, (p: StepProps) => React.ReactNode>> = {
  mode: ModeStep,
  account: AccountStep,
  business: BusinessStep,
  people: PeopleStep,
  need: NeedStep,
  goals: GoalsStep,
  risk: RiskStep,
  preferences: PreferencesStep,
  organisation: OrganisationStep,
  mandate: MandateStep,
};

const noopSubscribe = () => () => {};

/** Saved progress lives in the browser, so the flow renders only once it can read it. */
export function OnboardingFlow() {
  const params = useSearchParams();
  const onClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!onClient) return <div className="min-h-svh bg-ink-50" />;

  // Resume saved progress; a ?as= link starts that account type unless a flow is already under way.
  const saved = load();
  const as = params.get("as") as Mode | null;
  const fromLink = as && as in flows ? as : null;
  const start: OnboardingState =
    saved && saved.step !== "done"
      ? saved
      : { ...initialState, mode: fromLink ?? initialState.mode, step: fromLink ? "account" : "mode" };
  return <Flow start={start} />;
}

function Flow({ start }: { start: OnboardingState }) {
  const [s, setS] = useState<OnboardingState>(start);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    save(s.step === "done" ? null : s);
  }, [s]);

  if (s.step === "done") return <Complete s={s} />;

  const flow = flows[s.mode];
  const idx = flow.indexOf(s.step);
  const set: StepProps["set"] = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  const goTo = (step: StepId) => {
    set({ step });
    window.scrollTo({ top: 0 });
  };
  const props: StepProps = {
    s,
    set,
    next: () => goTo(flow[idx + 1]),
    back: idx > 0 ? () => goTo(flow[idx - 1]) : undefined,
  };
  const Step = STEP_COMPONENTS[s.step];

  return (
    <div className="flex min-h-svh flex-col bg-ink-50">
      <header className="px-4 pt-8 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7">
          <Link href="/" className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aubergine-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/serwaa-logo.svg" alt="Serwaa home" className="h-8 w-auto" />
          </Link>
          <StageIndicator mode={s.mode} step={s.step} />
        </div>
      </header>
      <main className="flex flex-1 justify-center px-4 pb-12 sm:px-6">
        <div ref={cardRef} className="w-full max-w-2xl rounded-3xl bg-white/80 p-5 shadow-[0_20px_60px_rgba(58,24,70,0.08)] ring-1 ring-ink-100 sm:p-8">
          <div key={s.step} className="animate-step-in">
            {s.step === "review" ? <ReviewStep {...props} goTo={goTo} /> : Step ? <Step {...props} /> : null}
          </div>
        </div>
      </main>
      <footer className="pb-8 text-center text-xs text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-aubergine-500 hover:underline">
          Sign in
        </Link>
      </footer>
    </div>
  );
}
