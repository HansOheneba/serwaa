"use client";

import { ArrowRight, Check, ChevronDown, ChevronLeft } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

export function StepHeader({ title, sub, note }: { title: string; sub?: string; note?: string }) {
  return (
    <div>
      <h1 className="text-2xl leading-tight font-extrabold tracking-[-0.02em] text-aubergine-800 text-balance sm:text-3xl">{title}</h1>
      {sub && <p className="mt-2 text-sm leading-6 text-ink-600 sm:text-base">{sub}</p>}
      {note && <p className="mt-1 text-xs text-ink-400">{note}</p>}
    </div>
  );
}

/** A white panel with a small uppercase label, used to group fields within a step. */
export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-5 rounded-2xl bg-white p-5 ring-1 ring-ink-100 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.08em] text-ink-400 uppercase">{label}</p>
      {children}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl bg-white px-3.5 text-sm text-ink-900 ring-1 ring-ink-200 transition-shadow placeholder:text-ink-400 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  error,
  hint,
  inputMode,
  autoComplete,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  error?: string;
  hint?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url";
  autoComplete?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
        {label}
      </label>
      <div className="relative">
        {prefix && <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-ink-500">{prefix}</span>}
        <input
          id={id}
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          className={`${inputCls} ${prefix ? "pl-14" : ""} ${error ? "ring-danger-600" : ""}`}
        />
      </div>
      {error ? <p className="text-xs text-danger-600">{error}</p> : hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

/** Large tappable cards for a single choice, with icon, title, description and a radio dot. */
export function OptionCards({
  value,
  onChange,
  options,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label?: string; body?: string; icon?: ReactNode }[];
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="space-y-3">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl p-4 text-left transition-[background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 sm:p-5 ${
              selected ? "bg-aubergine-50 ring-2 ring-aubergine-800" : "bg-white ring-1 ring-ink-200 hover:ring-aubergine-300"
            }`}
          >
            {o.icon && (
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  selected ? "bg-aubergine-800 text-saffron-400" : "bg-ink-100 text-ink-500"
                }`}
              >
                {o.icon}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink-900">{o.label ?? o.value}</span>
              {o.body && <span className="mt-0.5 block text-sm text-ink-600">{o.body}</span>}
            </span>
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selected ? "border-aubergine-800 bg-aubergine-800" : "border-ink-300"
              }`}
              aria-hidden="true"
            >
              {selected && <span className="size-2 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Pill chips. Single choice by default; pass `multiple` to allow several. */
export function Chips({
  label,
  options,
  value,
  onChange,
  multiple = false,
}: {
  label?: string;
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  const selected = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o);
  function toggle(o: string) {
    if (multiple && Array.isArray(value)) onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
    else onChange(o);
  }
  return (
    <fieldset className="space-y-2">
      {label && <legend className="mb-2 text-sm font-semibold text-ink-800">{label}</legend>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={selected(o)}
            onClick={() => toggle(o)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 ${
              selected(o)
                ? "bg-aubergine-800 text-white"
                : "bg-white text-ink-700 ring-1 ring-ink-200 hover:text-aubergine-800 hover:ring-aubergine-300"
            }`}
          >
            {multiple && selected(o) && <Check className="size-3.5" aria-hidden="true" />}
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function OptionalDetails({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-aubergine-800"
      >
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        {open ? "Hide" : "Add"} {label} (optional)
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function StepNav({
  onBack,
  onNext,
  canNext,
  nextLabel = "Continue",
  missingHint = "Fill in the required fields to continue.",
}: {
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
  missingHint?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1 rounded-xl bg-white text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-aubergine-800 text-sm font-semibold text-white transition-colors hover:bg-aubergine-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aubergine-500 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
        >
          {nextLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      {!canNext && <p className="text-center text-xs text-ink-500">{missingHint}</p>}
    </div>
  );
}
