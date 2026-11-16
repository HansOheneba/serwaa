import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import { Weave } from "./weave";

/** A photo sitting on an offset block of the brand weave, with an optional card overlapping its corner. */
export function FramedPhoto({ photo, overlay, priority = false, className = "" }: { photo: Photo; overlay?: ReactNode; priority?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -right-3 -bottom-3 left-8 top-8 overflow-hidden rounded-3xl bg-aubergine-50 sm:-right-5 sm:-bottom-5" aria-hidden="true">
        <Weave className="inset-0" />
      </div>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={900}
        height={720}
        priority={priority}
        sizes="(min-width: 1024px) 480px, 100vw"
        className="relative aspect-[5/4] w-full rounded-3xl object-cover"
      />
      {overlay && <div className="relative -mt-24 ml-4 w-[min(92%,22rem)] sm:-mt-28 sm:-ml-6">{overlay}</div>}
    </div>
  );
}
