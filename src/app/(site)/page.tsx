import Link from "next/link";
import Image from "next/image";
import { FramedPhoto } from "@/components/framed-photo";
import { CustodyIllustration, TrackIllustration, VerifyIllustration } from "@/components/illustrations";
import { OpportunityCard } from "@/components/opportunity-card";
import { photos } from "@/lib/photos";
import { ButtonLink, Label } from "@/components/ui";
import { Weave } from "@/components/weave";
import { opportunities } from "@/lib/data";

const audiences = [
  {
    href: "/businesses",
    title: "For businesses",
    body: "Finance invoices, purchase orders, contracts and working capital. Register once and track every step.",
    cta: "Apply for financing",
  },
  {
    href: "/investors",
    title: "For investors",
    body: "Start from GH₵100. See opportunities matched to your goals, with the reason each one appears.",
    cta: "Explore opportunities",
  },
  {
    href: "/institutions",
    title: "For institutions",
    body: "A verified pipeline matched to your mandate, with data rooms, allocations and consolidated reporting.",
    cta: "Partner with Serwaa",
  },
];

const tracks = [
  {
    art: VerifyIllustration,
    step: "1",
    title: "Verify and assess",
    body: "The business completes a five-stage verification. Our credit team analyses its finances and the deal, and people make the decision.",
  },
  {
    art: CustodyIllustration,
    step: "2",
    title: "Raise capital",
    body: "Approved deals open as campaigns. Investors subscribe and pay by Mobile Money or bank transfer, straight to a licensed custodian.",
  },
  {
    art: TrackIllustration,
    step: "3",
    title: "Fund and service",
    body: "Once enough money has cleared, funds go to the business. Repayments flow back to investors on the agreed schedule.",
  },
];

const principles = [
  { title: "Custodians hold the money", body: "Investor funds go to a licensed escrow or trust account. Serwaa tracks and reconciles; it never runs a wallet." },
  { title: "Only cleared money counts", body: "Pending payments and interest shown are kept apart. Funding progress counts cleared funds only." },
  { title: "People decide", body: "Software reads documents and drafts analysis. Credit approvals, fund releases and defaults stay with authorised staff." },
  { title: "Every match explained", body: "Each opportunity shows why it appears for you. Matching is factual, never advice." },
];

const products = [
  "Invoice financing",
  "Purchase order financing",
  "Contract financing",
  "Working capital",
  "Inventory financing",
  "Equipment financing",
  "Receivables financing",
  "Revenue-based financing",
  "Asset-backed financing",
  "Structured SME debt",
  "Supply chain financing",
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <Label>Private credit platform</Label>
            <h1 className="mt-4 text-5xl leading-[1.05] font-extrabold tracking-[-0.03em] text-aubergine-800 text-balance sm:text-6xl">
              Private credit, verified.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">
              Serwaa connects growing businesses that need financing with investors who want access to private credit. Every business is
              verified, every deal is assessed by people, and investor money stays with licensed custodians.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/onboarding?as=business">Apply for financing</ButtonLink>
              <ButtonLink href="/investors" variant="secondary">
                Explore opportunities
              </ButtonLink>
            </div>
          </div>
          <FramedPhoto
            photo={photos.shopkeeper}
            priority
            overlay={
              <div className="shadow-xl shadow-aubergine-900/10">
                <OpportunityCard o={opportunities[0]} anonymous />
                <p className="mt-2 text-center text-xs text-ink-500">Illustrative opportunity</p>
              </div>
            }
          />
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-8 md:grid-cols-3">
          {audiences.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 pt-24 ring-1 ring-ink-200 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-aubergine-500"
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
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-20 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Label>Why Serwaa</Label>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-aubergine-800 text-balance">
              Funding for the businesses that get things done
            </h2>
            <p className="mt-4 max-w-md leading-7 text-ink-600">
              Workshops, shops, distributors and manufacturers often have orders, contracts and customers but not the cash to deliver.
              Serwaa connects them with investors who want their money working in the real economy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Image src={photos.tailor.src} alt={photos.tailor.alt} width={600} height={760} sizes="(min-width: 1024px) 300px, 50vw" className="row-span-2 h-full w-full rounded-2xl object-cover" />
            <Image src={photos.carpenter.src} alt={photos.carpenter.alt} width={600} height={400} sizes="(min-width: 1024px) 300px, 50vw" className="aspect-[3/2] w-full rounded-2xl object-cover" />
            <Image src={photos.workshop.src} alt={photos.workshop.alt} width={600} height={400} sizes="(min-width: 1024px) 300px, 50vw" className="aspect-[3/2] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <Weave fade="t" className="inset-x-0 bottom-0 h-20" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <div className="max-w-2xl">
            <Label>How a deal moves</Label>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-aubergine-800 text-balance">From application to repayment, in one system</h2>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {tracks.map((t) => (
              <li key={t.step} className="border-t-2 border-aubergine-800 pt-5">
                <div className="mb-5 flex h-44 items-center justify-center rounded-2xl bg-ink-50">
                  <t.art className="h-36 w-auto" />
                </div>
                <span className="font-mono text-sm text-saffron-700">{t.step}</span>
                <h3 className="mt-2 text-xl font-bold text-aubergine-800">{t.title}</h3>
                <p className="mt-2 leading-7 text-ink-600">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aubergine-800 text-white">
        <Weave tone="dark" fade="l" className="inset-y-0 right-0 w-2/3 lg:w-1/2" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance">Built on controls, not promises</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
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
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <Label>Financing that fits the trade</Label>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-aubergine-800 text-balance">
            Structures for how businesses actually earn
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {products.map((p) => (
              <li key={p} className="rounded-full bg-aubergine-50 px-4 py-2 text-sm font-semibold text-aubergine-700">
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-saffron-500 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-aubergine-900">Ready to start?</h2>
              <p className="mt-1 text-aubergine-900/80">Create an account to apply for financing or to start investing.</p>
            </div>
            <ButtonLink href="/onboarding">Get started</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
