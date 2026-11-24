"use server";

// Early access to Serwaa Verify. Anyone can ask, signed in or not. One row per email,
// so asking twice just updates the request. Emails go out after the response.

import { after } from "next/server";
import { validEmail, type Result } from "./domain";
import { sendMail } from "./server/email";
import { db } from "./server/supabase";

export type VerifyRequest = {
  name: string;
  email: string;
  organisation: string;
  sector: string;
  monthlyChecks: string;
  needs: string[];
  note: string;
  /** Hidden field people never see. Bots fill it in. */
  website?: string;
};

const NEEDS = ["Individual checks", "Business checks", "Ongoing monitoring", "API access"];
const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

export async function requestVerifyAccess(input: VerifyRequest): Promise<Result> {
  if (input.website) return { ok: true, message: "Thanks. We'll be in touch." };

  const name = clip(input.name, 120);
  const email = clip(input.email, 200).toLowerCase();
  const organisation = clip(input.organisation, 160);
  if (!name || !organisation) return { ok: false, message: "Tell us your name and your organisation." };
  if (!validEmail(email)) return { ok: false, message: "Enter a valid work email." };

  const row = {
    product: "verify",
    name,
    email,
    organisation,
    sector: clip(input.sector, 80) || null,
    monthly_checks: clip(input.monthlyChecks, 40) || null,
    needs: (Array.isArray(input.needs) ? input.needs : []).filter((n) => NEEDS.includes(n)),
    note: clip(input.note, 1000) || null,
  };

  const { error } = await db().from("waitlist").upsert(row, { onConflict: "product,email" });
  if (error) {
    console.error("[waitlist]", error.message);
    return { ok: false, message: "We couldn't save that just now. Please try again." };
  }

  const admins = (process.env.SERWAA_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  after(() =>
    sendMail([
      {
        to: email,
        title: "You're on the list for Serwaa Verify",
        body: `Thanks, ${name.split(" ")[0]}. We've noted ${organisation}'s interest in Serwaa Verify. We're opening it to a small group of pilot clients first, and we'll contact you before anything is set up or charged.`,
        cta: { label: "See what a report looks like", href: "/verify#report" },
        footer: "You're receiving this because you asked for early access to Serwaa Verify.",
      },
      ...admins.map((to) => ({
        to,
        title: `Verify early access: ${organisation}`,
        body: [
          `${name} <${email}> at ${organisation}`,
          row.sector && `Sector: ${row.sector}`,
          row.monthly_checks && `Checks a month: ${row.monthly_checks}`,
          row.needs.length ? `Needs: ${row.needs.join(", ")}` : null,
          row.note && `Note: ${row.note}`,
        ]
          .filter(Boolean)
          .join(" · "),
        footer: "You're receiving this because you're a Serwaa administrator.",
      })),
    ]).catch((e) => console.error("[waitlist email]", e)),
  );

  return { ok: true, message: `Thanks, ${name.split(" ")[0]}. You're on the list, and we've sent a confirmation to ${email}.` };
}
