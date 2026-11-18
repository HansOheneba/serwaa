import Link from "next/link";
import { HeroStage } from "@/components/cinematic/hero-stage";
import { Mosaic } from "@/components/cinematic/mosaic";
import { SplitSection } from "@/components/cinematic/split-section";
import { CustodyIllustration, TrackIllustration, VerifyIllustration } from "@/components/illustrations";
import { ButtonLink, Label, MoneyBadge } from "@/components/ui";
import { Weave } from "@/components/weave";
import type { MoneyState } from "@/lib/data";
import { photos } from "@/lib/photos";

const headline = ["Private", "credit,", "verified."];

const audiences = [
  {
    href: "/businesses",
    title: "For businesses",
    body: "Turn the invoices, orders and contracts you already hold into the cash to deliver them, funded by many investors instead of one bank.",
    cta: "Apply for financing",
  },
  {
    href: "/investors",
    title: "For investors",
    body: "Lend to businesses verified down to their owners, from GH₵100, while a licensed custodian holds your money.",
    cta: "Explore opportunities",
  },
  {
    href: "/institutions",
    title: "For institutions",
    body: "Put capital into verified SME credit without building your own origination and due-diligence team.",
    cta: "Partner with Serwaa",
  },
];

const tracks = [
  {
    art: VerifyIllustration,
    step: "01",
    title: "Verify and assess",
    body: "We check the business, the people behind it and the deal itself. Only then does our credit team decide whether to back it.",
  },
  {
    art: CustodyIllustration,
    step: "02",
    title: "Raise capital",
    body: "Approved deals open to investors, who can fund them from their phone with Mobile Money or by bank transfer.",
  },
  {
    art: TrackIllustration,
    step: "03",
    title: "Fund and service",
    body: "The business receives the money and repays on the agreed dates. Investors get their share of every repayment.",
  },
];

const principles = [
  { title: "Your money isn't held by us", body: "Investor money sits with a licensed custodian. Serwaa never holds it, pools it or lends it out." },
  { title: "A deal never looks fuller than it is", body: "Funding totals only count money that has actually arrived, not promises to pay." },
  { title: "Experienced people decide", body: "Every financing decision is made by our credit team, and no one signs off a deal they brought in." },
  { title: "You see why a deal suits you", body: "Each opportunity tells you which of your goals it meets and which it doesn't, so the decision stays yours." },
];

const gaps = [
  {
    who: "Businesses",
    problem: "Lenders want property as collateral, while the orders, invoices and contracts the business already holds count for little.",
    answer: "Borrow against the deal in front of you, and repay when your customer pays you.",
  },
  {
    who: "Investors",
    problem: "Lending to small businesses can pay well, but it's hard to reach them and harder to tell which ones are genuine.",
    answer: "Lend from GH₵100 to businesses checked down to every owner, and get refunded if a deal doesn't fill.",
  },
  {
    who: "Institutions",
    problem: "Building an SME origination and due-diligence team costs more than most mandates can carry.",
    answer: "Deals arrive verified, analysed and structured, filtered to your mandate, with every document in a data room.",
  },
  {
    who: "Everyone",
    problem: "Fees that only appear later, and terms that shift after you've committed.",
    answer: "The price, fees and every repayment date are fixed and shown to both sides before anyone commits.",
  },
];

const products = ["Invoice financing", "Purchase orders", "Contracts", "Working capital", "Inventory", "Equipment", "Supply chain"];

const states: MoneyState[] = ["expected", "pending", "cleared", "received", "overdue"];

export default function HomePage() {
  return (
    <>
      {/* Cinematic hero: headline resolves word by word, then the stage opens. */}
      <section className="bg-white pt-12 pb-3 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Label className="rise-in">Private credit for growing businesses</Label>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
            <h1 className="text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-aubergine-800">
              {headline.map((w, i) => (
                <span key={w}>
                  <span className="word-in" style={{ animationDelay: `${i * 110}ms` }}>
                    {w}
                  </span>{" "}
                </span>
              ))}
            </h1>
            <div className="rise-in pb-2" style={{ animationDelay: "350ms" }}>
              <p className="max-w-md text-lg leading-8 text-ink-600">
                Serwaa bridges the gap between SMEs that need funding to get things done and investors who want their money working in the
                real economy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/onboarding?as=business">Apply for financing</ButtonLink>
                <ButtonLink href="/marketplace" variant="secondary">
                  Explore the marketplace
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 px-2 sm:px-4">
          <HeroStage />
        </div>
      </section>

      <section className="bg-white">
        <div data-reveal-stagger className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-8 md:grid-cols-3">
          {audiences.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 pt-24 ring-1 ring-ink-200 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-aubergine-500"
            >
              <Weave fade="b" className="inset-x-0 top-0 h-24 transition-opacity duration-300 group-hover:opacity-70" />
              <h2 className="relative text-xl font-bold text-aubergine-800">{a.title}</h2>
              <p className="mt-2 flex-1 leading-7 text-ink-600">{a.body}</p>
              <span className="mt-6 text-sm font-semibold text-aubergine-500 group-hover:underline">{a.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-8">
          <div data-reveal className="max-w-3xl">
            <Label>The gap we close</Label>
            <h2 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance">
              Good businesses can&apos;t get funded. Good money can&apos;t find them.
            </h2>
          </div>
          <div data-reveal-stagger className="mt-12 divide-y divide-ink-200 border-y border-ink-200">
            {gaps.map((g) => (
              <div key={g.who} className="grid gap-3 py-7 md:grid-cols-[10rem_1fr_1fr] md:gap-10">
                <p className="font-mono text-xs tracking-[0.1em] text-aubergine-500 uppercase">{g.who}</p>
                <p className="leading-7 text-ink-500">{g.problem}</p>
                <p className="leading-7 font-semibold text-ink-900">
                  <span className="mr-2 text-saffron-600" aria-hidden="true">→</span>
                  {g.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Half and half: full-bleed photo, copy on the content column. */}
      <SplitSection photo={photos.tailor} side="left">
        <Label>Why Serwaa</Label>
        <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance sm:text-5xl">
          Funding for the businesses that get things done
        </h2>
        <p className="mt-5 text-lg leading-8 text-ink-600">
          Workshops, shops, distributors and manufacturers often have the orders and the customers but not the cash to deliver. Serwaa
          finances the deal itself, and times repayment to when the money comes in.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {products.map((p) => (
            <li key={p} className="rounded-full bg-aubergine-50 px-3.5 py-1.5 text-sm font-semibold text-aubergine-700">
              {p}
            </li>
          ))}
        </ul>
        <ButtonLink href="/products" variant="secondary" className="mt-8">
          All twelve financing products
        </ButtonLink>
      </SplitSection>

      <section className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-8">
          <div data-reveal className="max-w-2xl">
            <Label>How a deal moves</Label>
            <h2 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance">
              From application to repayment, in one system
            </h2>
          </div>
          <ol data-reveal-stagger className="mt-16 grid gap-10 md:grid-cols-3">
            {tracks.map((t) => (
              <li key={t.step}>
                <div className="flex h-56 items-center justify-center rounded-3xl bg-ink-50">
                  <t.art className="h-44 w-auto" />
                </div>
                <p className="mt-6 font-mono text-xs tracking-[0.08em] text-saffron-700">{t.step}</p>
                <h3 className="mt-1 text-xl font-bold text-aubergine-800">{t.title}</h3>
                <p className="mt-2 leading-7 text-ink-600">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Full-bleed mosaic */}
      <section className="bg-white">
        <div data-reveal className="mx-auto max-w-7xl px-4 pb-6 sm:px-8">
          <Label>Every sector</Label>
          <h2 className="mt-3 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance">
            If it keeps the economy moving, it belongs on Serwaa
          </h2>
        </div>
        <div data-reveal="fade">
          <Mosaic />
        </div>
      </section>

      <section className="relative overflow-hidden bg-aubergine-800 text-white">
        <Weave tone="dark" fade="l" className="inset-y-0 right-0 w-2/3 lg:w-1/2" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-8">
          <h2 data-reveal className="max-w-2xl text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Why you can trust Serwaa</h2>
          <div data-reveal-stagger className="mt-14 grid gap-x-16 gap-y-12 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="mt-1.5 h-4 w-4 shrink-0 bg-saffron-500" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 leading-7 text-aubergine-100">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <ButtonLink href="/protection" variant="accent" className="mt-12">
            How we protect you
          </ButtonLink>
        </div>
      </section>

      <SplitSection photo={photos.investorPhone} side="right">
        <Label>For investors</Label>
        <h2 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance sm:text-5xl">
          Honest numbers, every time
        </h2>
        <p className="mt-5 text-lg leading-8 text-ink-600">
          Your statement never blends what you&apos;ve been paid with what you&apos;re still owed. Every amount carries its real status, so you always
          know what is actually in your pocket.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {states.map((s) => (
            <MoneyBadge key={s} state={s} />
          ))}
        </div>
        <ButtonLink href="/investors" variant="secondary" className="mt-8">
          Investing on Serwaa
        </ButtonLink>
      </SplitSection>

      <section className="bg-white px-2 pt-6 pb-4 sm:px-4">
        <div data-reveal="clip" className="relative overflow-hidden rounded-[2rem] bg-saffron-500">
          <Weave fade="r" className="inset-y-0 left-0 w-1/2 opacity-40 mix-blend-multiply" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center sm:px-10 lg:py-20">
            <h2 className="max-w-xl text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-900 text-balance sm:text-5xl">
              Ready to get things done?
            </h2>
            <ButtonLink href="/onboarding" className="px-6 py-3 text-base">
              Get started
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
