type Fade = "b" | "t" | "l" | "r" | "x";

/**
 * Decorative brand pattern layer. Place inside a `relative overflow-hidden`
 * parent and size it with position classes (e.g. "inset-x-0 top-0 h-24").
 */
export function Weave({ tone = "light", fade, className = "" }: { tone?: "light" | "dark"; fade?: Fade; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${tone === "dark" ? "weave-dark" : "weave"} ${fade ? `${fade === "x" ? "fade-x" : `fade-to-${fade}`}` : ""} ${className}`}
    />
  );
}
