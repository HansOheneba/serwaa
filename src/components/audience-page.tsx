import type { ReactNode } from "react";
import type { Photo } from "@/lib/photos";
import { Mark } from "./brand";
import { FramedPhoto } from "./framed-photo";
import { ButtonLink, Label } from "./ui";
import { Weave } from "./weave";

export function AudiencePage({
  eyebrow,
  title,
  intro,
  primary,
  secondary,
  features,
  steps,
  note,
  aside,
  photo,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  features: { title: string; body: string }[];
  steps: string[];
  note?: string;
  aside?: ReactNode;
  photo?: Photo;
  /** Extra sections rendered after "Getting started". */
  children?: ReactNode;
}) {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div>
            <Label>{eyebrow}</Label>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-[-0.025em] text-aubergine-800 text-balance sm:text-5xl">{title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
          {photo ? (
            <FramedPhoto photo={photo} priority overlay={aside} className="mb-6 lg:mb-0" />
          ) : aside ? (
            <div>{aside}</div>
          ) : (
            <div className="relative hidden min-h-72 items-center justify-center overflow-hidden rounded-3xl bg-aubergine-50 lg:flex" aria-hidden="true">
              <Weave className="inset-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-aubergine-50)_0%,var(--color-aubergine-50)_22%,transparent_60%)]" />
              <Mark className="relative size-24" />
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-ink-100 bg-ink-50">
        <Weave fade="b" className="inset-x-0 top-0 h-16" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <h2 data-reveal className="text-2xl font-bold tracking-tight text-aubergine-800">What you get</h2>
          <div data-reveal-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
                <h3 className="font-bold text-aubergine-800">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <h2 data-reveal className="text-2xl font-bold tracking-tight text-aubergine-800">Getting started</h2>
          <ol data-reveal-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-aubergine-800 font-mono text-sm text-white">{i + 1}</span>
                <p className="pt-1 leading-6 text-ink-700">{s}</p>
              </li>
            ))}
          </ol>
          {note && <p className="mt-12 max-w-3xl rounded-xl bg-aubergine-50 p-4 text-sm leading-6 text-aubergine-800">{note}</p>}
        </div>
      </section>
      {children}
    </>
  );
}
