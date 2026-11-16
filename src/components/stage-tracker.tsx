export function StageTracker({ stages, current }: { stages: string[]; current: number }) {
  return (
    <ol className="space-y-0">
      {stages.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
            {i < stages.length - 1 && (
              <span className={`absolute top-5 left-[9px] h-full w-0.5 ${i < current ? "bg-aubergine-800" : "bg-ink-200"}`} aria-hidden="true" />
            )}
            <span
              className={`relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                state === "done"
                  ? "bg-aubergine-800 text-white"
                  : state === "current"
                    ? "bg-saffron-500 text-aubergine-900 ring-4 ring-saffron-100"
                    : "bg-white text-ink-400 ring-1 ring-ink-300"
              }`}
              aria-hidden="true"
            >
              {state === "done" ? "✓" : ""}
            </span>
            <span className={`text-sm ${state === "current" ? "font-bold text-aubergine-800" : state === "done" ? "text-ink-700" : "text-ink-500"}`}>
              {s}
              {state === "current" && <span className="sr-only"> (current stage)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
