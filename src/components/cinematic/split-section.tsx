import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/photos";

/**
 * Half-and-half section: the photo bleeds to the edge of the screen on one side,
 * while the copy stays aligned to the page's content column on the other.
 * The only pattern is the woven edge on the photo; the text side stays plain.
 */
export function SplitSection({
  photo,
  side = "left",
  tone = "light",
  children,
}: {
  photo: Photo;
  side?: "left" | "right";
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section className={`relative grid overflow-hidden lg:min-h-[640px] lg:grid-cols-2 ${dark ? "bg-aubergine-800 text-white" : "bg-white"}`}>
      <div className={`relative min-h-[360px] sm:min-h-[460px] ${side === "right" ? "lg:order-2" : ""}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} hidden w-3 lg:block ${dark ? "weave-dark" : "weave"}`} aria-hidden="true" />
      </div>
      <div className="relative flex items-center">
        <div
          className={`relative w-full px-4 py-16 sm:px-8 lg:py-24 ${
            side === "left" ? "lg:pr-8 lg:pl-16" : "lg:pr-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          }`}
        >
          <div className="max-w-xl">{children}</div>
        </div>
      </div>
    </section>
  );
}
