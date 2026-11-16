import type { Metadata } from "next";
import Image from "next/image";
import { BridgeIllustration, CustodyIllustration, TrackIllustration, VerifyIllustration } from "@/components/illustrations";
import { photos } from "@/lib/photos";

export const metadata: Metadata = { title: "Brand" };

const core = [
  { name: "Aubergine", hex: "#3A1846", use: "Primary. Logo, headings, primary buttons.", cls: "bg-aubergine-800 text-white" },
  { name: "Plum", hex: "#6B3A7D", use: "Secondary. Links, charts, hover states.", cls: "bg-aubergine-500 text-white" },
  { name: "Saffron", hex: "#F2A900", use: "Accent. The weave thread, highlights. Never text on white.", cls: "bg-saffron-500 text-aubergine-900" },
  { name: "Lilac", hex: "#F6F1F8", use: "Tint. Section and card backgrounds.", cls: "bg-aubergine-50 text-aubergine-800 ring-1 ring-inset ring-aubergine-100" },
];

const ramps = [
  { name: "aubergine", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] },
  { name: "saffron", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "ink", stops: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
];

// Tailwind needs literal class names to generate them.
const rampClass: Record<string, string> = {
  "aubergine-50": "bg-aubergine-50", "aubergine-100": "bg-aubergine-100", "aubergine-200": "bg-aubergine-200",
  "aubergine-300": "bg-aubergine-300", "aubergine-400": "bg-aubergine-400", "aubergine-500": "bg-aubergine-500",
  "aubergine-600": "bg-aubergine-600", "aubergine-700": "bg-aubergine-700", "aubergine-800": "bg-aubergine-800",
  "aubergine-900": "bg-aubergine-900", "aubergine-950": "bg-aubergine-950",
  "saffron-50": "bg-saffron-50", "saffron-100": "bg-saffron-100", "saffron-200": "bg-saffron-200",
  "saffron-300": "bg-saffron-300", "saffron-400": "bg-saffron-400", "saffron-500": "bg-saffron-500",
  "saffron-600": "bg-saffron-600", "saffron-700": "bg-saffron-700", "saffron-800": "bg-saffron-800",
  "saffron-900": "bg-saffron-900",
  "ink-50": "bg-ink-50", "ink-100": "bg-ink-100", "ink-200": "bg-ink-200", "ink-300": "bg-ink-300",
  "ink-400": "bg-ink-400", "ink-500": "bg-ink-500", "ink-600": "bg-ink-600", "ink-700": "bg-ink-700",
  "ink-800": "bg-ink-800", "ink-900": "bg-ink-900",
};

const money = [
  { label: "Expected", cls: "bg-money-expected" },
  { label: "Pending", cls: "bg-money-pending" },
  { label: "Confirmed", cls: "bg-money-confirmed" },
  { label: "Cleared", cls: "bg-money-cleared" },
  { label: "Received", cls: "bg-money-received" },
  { label: "Overdue", cls: "bg-money-overdue" },
];

const downloads = [
  ["serwaa-logo.svg", "Logo, on light"],
  ["serwaa-logo-reversed.svg", "Logo, on dark"],
  ["serwaa-logo-mono.svg", "Logo, one colour"],
  ["serwaa-logo-mono-white.svg", "Logo, white"],
  ["serwaa-mark.svg", "Mark only"],
  ["serwaa-wordmark.svg", "Wordmark only"],
  ["serwaa-app-icon.svg", "App icon"],
  ["serwaa-pattern-light.svg", "Pattern tile, light"],
  ["serwaa-pattern-dark.svg", "Pattern tile, dark"],
  ["serwaa-logo.png", "Logo, PNG 1200px"],
];

export default function BrandPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-8">
      <header className="mb-12">
        <p className="text-sm font-semibold tracking-wide text-aubergine-500">Brand</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-aubergine-800">Serwaa identity</h1>
        <p className="mt-3 max-w-2xl text-ink-600">
          The mark is a woven S. Saffron threads run between aubergine bars, after kente cloth, and the bars read as the
          lines of a credit ledger.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex min-h-48 items-center justify-center rounded-2xl bg-white p-10 ring-1 ring-ink-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-logo.svg" alt="Serwaa" className="h-14 w-auto" />
        </div>
        <div className="flex min-h-48 items-center justify-center rounded-2xl bg-aubergine-800 p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-logo-reversed.svg" alt="Serwaa" className="h-14 w-auto" />
        </div>
        <div className="flex min-h-40 items-center justify-center gap-6 rounded-2xl bg-aubergine-50 p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-app-icon.svg" alt="Serwaa app icon" className="size-20" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-app-icon.svg" alt="" className="size-12" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="size-8" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="size-4" />
        </div>
        <div className="flex min-h-40 items-center justify-center rounded-2xl bg-saffron-500 p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/serwaa-logo-mono.svg" alt="Serwaa" className="h-12 w-auto" />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Core colours</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {core.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl ring-1 ring-ink-200">
              <div className={`flex h-28 items-end p-4 font-mono text-sm ${c.cls}`}>{c.hex}</div>
              <div className="p-4">
                <p className="font-semibold text-ink-900">{c.name}</p>
                <p className="mt-1 text-sm text-ink-600">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Scales</h2>
        <div className="mt-6 space-y-4">
          {ramps.map((r) => (
            <div key={r.name}>
              <p className="mb-2 text-sm font-semibold capitalize text-ink-700">{r.name}</p>
              <div className="flex overflow-hidden rounded-xl ring-1 ring-ink-200">
                {r.stops.map((s) => (
                  <div key={s} className={`flex h-14 flex-1 items-end p-1.5 ${rampClass[`${r.name}-${s}`]}`}>
                    <span className={`text-[11px] font-mono ${Number(s) >= 500 ? "text-white" : "text-ink-800"}`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Pattern</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          A quiet basket weave: blocks of three bars in two close shades of aubergine, turning at right angles, with a small saffron
          knot where they meet. Use it in bands and fading edges, never as a full background behind text.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="weave-dark h-48 rounded-2xl bg-aubergine-800" />
          <div className="weave h-48 rounded-2xl bg-white ring-1 ring-ink-200" />
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl bg-white p-5 pt-20 ring-1 ring-ink-200">
            <div className="weave fade-to-b absolute inset-x-0 top-0 h-20" />
            <p className="font-semibold text-aubergine-800">Card header</p>
            <p className="mt-1 text-sm text-ink-600">A band across the top of a card, fading into the content.</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-aubergine-800 p-5 text-white">
            <div className="weave-dark fade-to-l absolute inset-y-0 right-0 w-2/3" />
            <p className="relative font-semibold">Section edge</p>
            <p className="relative mt-1 text-sm text-aubergine-100">Dissolving in from one side of a dark section or footer.</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-ink-50 p-5 pb-16 ring-1 ring-ink-200">
            <div className="weave fade-to-t absolute inset-x-0 bottom-0 h-16" />
            <p className="font-semibold text-aubergine-800">Divider</p>
            <p className="mt-1 text-sm text-ink-600">A strip at a section&apos;s edge that leads into the next one.</p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Illustrations</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Flat, geometric scenes in aubergine and saffron that explain an idea at a glance: connecting businesses and investors,
          verification, custody and tracking.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[BridgeIllustration, VerifyIllustration, CustodyIllustration, TrackIllustration].map((Ill, i) => (
            <div key={i} className="flex items-center justify-center rounded-2xl bg-white p-6 ring-1 ring-ink-200">
              <Ill className="h-auto w-full max-w-sm" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Photography</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Real business owners and teams at work, warm and natural. Photos are from Unsplash and free to use under the Unsplash License.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.values(photos).map((ph) => (
            <figure key={ph.src} className="overflow-hidden rounded-xl ring-1 ring-ink-200">
              <Image src={ph.src} alt={ph.alt} width={400} height={300} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="px-3 py-2 text-xs text-ink-600">
                <a href={ph.page} className="hover:underline">Photo</a> by{" "}
                <a href={ph.profile} className="font-semibold hover:underline">{ph.credit}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Money states</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Every amount on Serwaa carries one of these labels, always in the same colour, so expected returns are never
          mistaken for money received.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {money.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-800 ring-1 ring-ink-200"
            >
              <span className={`size-2.5 rounded-full ${m.cls}`} />
              {m.label}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Typography</h2>
        <div className="mt-6 rounded-2xl bg-aubergine-50 p-8">
          <p className="text-5xl font-extrabold tracking-tight text-aubergine-800">Private credit, verified.</p>
          <p className="mt-4 max-w-xl text-lg text-ink-700">
            Manrope for everything: bold for headings, regular for body text. The wordmark is Manrope Bold with tight
            tracking, outlined in the logo files.
          </p>
          <button className="mt-6 rounded-lg bg-aubergine-800 px-5 py-2.5 font-semibold text-white hover:bg-aubergine-700">
            Start investing
          </button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-aubergine-800">Files</h2>
        <ul className="mt-4 divide-y divide-ink-200 rounded-2xl ring-1 ring-ink-200">
          {downloads.map(([file, label]) => (
            <li key={file} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-ink-800">{label}</span>
              <a href={`/brand/${file}`} download className="font-mono text-sm text-aubergine-500 hover:underline">
                {file}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
