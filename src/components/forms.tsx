"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./ui";

/** New application form. Persists once the applications API is connected. */
export function ApplicationForm({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push("/business/applications");
  }

  return (
    <form className="space-y-8" onSubmit={submit}>
      {children}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit">Submit application</Button>
        <Button type="button" variant="secondary" onClick={() => setSaved(true)}>
          Save draft
        </Button>
        <p role="status" className="text-sm text-success-600">
          {saved ? "Draft saved" : ""}
        </p>
      </div>
    </form>
  );
}

/** Upload and reply to an information request. */
export function RespondButton() {
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p role="status" className="mt-4 rounded-xl bg-success-50 p-4 text-sm font-semibold text-success-600">
        Response sent. Your analyst will review it.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-ink-200 p-6 text-center text-sm text-ink-600 hover:border-aubergine-300 hover:bg-aubergine-50">
        <input
          id="statements"
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
        />
        {files.length ? files.join(", ") : "Choose PDF statements to upload"}
      </label>
      <Button onClick={() => setSent(true)} disabled={files.length === 0}>
        Send response
      </Button>
    </div>
  );
}

const accountTypes = [
  { value: "/business", label: "Business" },
  { value: "/invest", label: "Investor" },
  { value: "/ops", label: "Serwaa team" },
];

const field =
  "mt-1.5 w-full rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-aubergine-500 focus:outline-none";

export function SignInForm() {
  const router = useRouter();
  const [type, setType] = useState(accountTypes[0].value);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push(type);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-ink-800">Account type</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-ink-100 p-1">
          {accountTypes.map((a) => (
            <label
              key={a.value}
              className={`cursor-pointer rounded-lg px-2 py-2 text-center text-sm font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-aubergine-500 ${
                type === a.value ? "bg-white text-aubergine-800 shadow-sm" : "text-ink-600 hover:text-aubergine-800"
              }`}
            >
              <input
                type="radio"
                name="account-type"
                value={a.value}
                checked={type === a.value}
                onChange={() => setType(a.value)}
                className="sr-only"
              />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-semibold text-ink-800">
        Email
        <input id="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
      </label>
      <label className="block text-sm font-semibold text-ink-800">
        Password
        <input id="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
