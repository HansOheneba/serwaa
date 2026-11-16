import Link from "next/link";

const bars = (bar: string, thread: string) => (
  <>
    <rect x="18" y="14" width="64" height="16" fill={bar} />
    <rect x="18" y="30" width="16" height="14" fill={thread} />
    <rect x="18" y="44" width="64" height="12" fill={bar} />
    <rect x="66" y="56" width="16" height="14" fill={thread} />
    <rect x="18" y="70" width="64" height="16" fill={bar} />
  </>
);

export function Mark({ className = "size-8", reversed = false }: { className?: string; reversed?: boolean }) {
  return (
    <svg viewBox="14 10 72 80" className={className} aria-hidden="true">
      {bars(reversed ? "#FFFFFF" : "#3A1846", "#F2A900")}
    </svg>
  );
}

/** Full logo lockup, linking home. Uses the outlined wordmark file so it never depends on a loaded font. */
export function Logo({ reversed = false, href = "/", className = "h-7" }: { reversed?: boolean; href?: string; className?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aubergine-500">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reversed ? "/brand/serwaa-logo-reversed.svg" : "/brand/serwaa-logo.svg"}
        alt="Serwaa home"
        className={`${className} w-auto`}
      />
    </Link>
  );
}

export function PrototypeBanner() {
  return (
    <div className="bg-aubergine-900 px-4 py-2 text-center text-xs font-medium text-aubergine-100">
      Prototype with sample data. No real businesses, investments or payments.
    </div>
  );
}
