"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "./ui";

const accountTypes = [
  { value: "/business", label: "Business" },
  { value: "/invest", label: "Investor" },
  { value: "/institution", label: "Corporate" },
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
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1 sm:grid-cols-4">
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
