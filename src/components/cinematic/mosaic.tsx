import Image from "next/image";
import type { ReactNode } from "react";
import { BridgeIllustration, CustodyIllustration, TrackIllustration, VerifyIllustration } from "@/components/illustrations";
import { photos } from "@/lib/photos";

type Tile = { kind: "photo"; key: keyof typeof photos; h: string } | { kind: "card"; node: ReactNode; h: string; tone: string };

const sector = (name: string, line: string, tone: string): Tile => ({
  kind: "card",
  h: "h-44",
  tone,
  node: (
    <div className="flex h-full flex-col justify-between p-5">
      <span className="font-mono text-[11px] tracking-[0.08em] uppercase opacity-70">Sector</span>
      <div>
        <p className="text-xl font-extrabold tracking-tight">{name}</p>
        <p className="mt-1 text-sm opacity-80">{line}</p>
      </div>
    </div>
  ),
});

const art = (node: ReactNode): Tile => ({ kind: "card", h: "h-52", tone: "bg-aubergine-50", node: <div className="flex h-full items-center justify-center p-4">{node}</div> });

const columns: Tile[][] = [
  [
    { kind: "photo", key: "tailor", h: "h-80" },
    sector("Manufacturing", "Fund the inputs for a confirmed order.", "bg-aubergine-800 text-white"),
    { kind: "photo", key: "investorPhone", h: "h-64" },
    art(<VerifyIllustration className="h-full w-auto" />),
  ],
  [
    sector("Trade", "Stock up against invoices you've issued.", "bg-saffron-500 text-aubergine-900"),
    { kind: "photo", key: "shopkeeper", h: "h-96" },
    art(<TrackIllustration className="h-full w-auto" />),
    { kind: "photo", key: "boardroom", h: "h-56" },
  ],
  [
    { kind: "photo", key: "carpenter", h: "h-72" },
    art(<BridgeIllustration className="h-full w-auto" />),
    { kind: "photo", key: "workshop", h: "h-64" },
    sector("Services", "Working capital between contract payments.", "bg-aubergine-500 text-white"),
  ],
  [
    sector("Construction", "Buy materials for a signed contract.", "bg-ink-900 text-white"),
    { kind: "photo", key: "vendorPhone", h: "h-80" },
    art(<CustodyIllustration className="h-full w-auto" />),
    { kind: "photo", key: "investorLaptop", h: "h-64" },
  ],
  [
    { kind: "photo", key: "workshop", h: "h-64" },
    sector("Logistics", "Keep vehicles moving while clients pay.", "bg-aubergine-800 text-white"),
    { kind: "photo", key: "tailor", h: "h-80" },
    sector("Healthcare", "Restock pharmacies ahead of demand.", "bg-saffron-300 text-aubergine-900"),
  ],
];

function TileView({ t }: { t: Tile }) {
  if (t.kind === "photo") {
    const p = photos[t.key];
    return (
      <div className={`relative ${t.h} overflow-hidden rounded-2xl`}>
        <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
      </div>
    );
  }
  return <div className={`${t.h} overflow-hidden rounded-2xl ${t.tone}`}>{t.node}</div>;
}

/** Full-bleed, Pinterest-style wall of columns drifting slowly in opposite directions. */
export function Mosaic() {
  return (
    <div className="mosaic relative h-[720px] overflow-hidden" aria-label="Businesses and investors on Serwaa">
      <div className="grid h-full grid-cols-2 gap-3 px-3 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((col, ci) => (
          <div key={ci} className={`${ci >= 3 ? "hidden lg:block" : ci === 2 ? "hidden sm:block" : ""}`}>
            <div className={ci % 2 === 0 ? "drift-up" : "drift-down"} style={{ ["--drift" as string]: `${54 + ci * 9}s` }}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex flex-col gap-3 pb-3" aria-hidden={copy === 1}>
                  {col.map((t, ti) => (
                    <TileView key={ti} t={t} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
