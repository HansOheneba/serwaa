"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals elements marked with `data-reveal` as they scroll into view.
 *   data-reveal="up"     rise and fade (default)
 *   data-reveal="clip"   mask wipe open, for photos and media
 *   data-reveal="fade"   opacity only
 *   data-reveal-stagger  on a parent: its direct children reveal one after another
 * Content is only hidden once this has run, so nothing is lost without JavaScript.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger] > *"));
    targets.forEach((el) => {
      const parent = el.parentElement;
      if (parent?.hasAttribute("data-reveal-stagger") && !el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "up");
        const i = Array.from(parent.children).indexOf(el);
        el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 70}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.target.hasAttribute("data-revealed")) {
            const el = entry.target as HTMLElement;
            el.setAttribute("data-revealed", "");
            observer.unobserve(el);
            // Once settled, hand the element back to its own styles (hover etc.).
            const delay = parseInt(el.style.getPropertyValue("--reveal-delay") || "0", 10);
            window.setTimeout(() => {
              el.removeAttribute("data-reveal");
              el.removeAttribute("data-revealed");
              el.style.removeProperty("--reveal-delay");
            }, 1200 + delay);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    root.classList.add("reveal-ready");
    // Whatever is already on screen reveals at once (as an entrance); the rest waits for scroll.
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        if (el.hasAttribute("data-revealed")) return;
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.92) el.setAttribute("data-revealed", "");
        observer.observe(el);
      });
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
