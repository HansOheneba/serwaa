import "server-only";

const FROM = process.env.EMAIL_FROM ?? "Serwaa <onboarding@resend.dev>";
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://serwaa-gamma.vercel.app").replace(/\/$/, "");

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** One plain, branded layout for every email Serwaa sends. */
function layout(title: string, body: string, cta?: { label: string; href: string }, footer = "You're receiving this because you have a Serwaa account.") {
  const href = cta ? (cta.href.startsWith("http") ? cta.href : SITE + cta.href) : "";
  return `<!doctype html><html><body style="margin:0;background:#F6F1F8;font-family:Manrope,Segoe UI,Arial,sans-serif;color:#2B2230">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#3A1846;padding:20px 28px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em">serwaa<span style="color:#F2A900">.</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#3A1846">${esc(title)}</h1>
<p style="margin:0;font-size:15px;line-height:1.6;color:#4A4050">${esc(body)}</p>
${cta ? `<p style="margin:28px 0 0"><a href="${esc(href)}" style="display:inline-block;background:#F2A900;color:#2A0F33;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px">${esc(cta.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:0 28px 24px;font-size:12px;line-height:1.5;color:#8A8090">Serwaa is operated by Bomevan Group, Accra. ${esc(footer)}</td></tr>
</table></td></tr></table></body></html>`;
}

export type Mail = { to: string; title: string; body: string; cta?: { label: string; href: string }; footer?: string };

/** Sends through Resend. Up to 100 messages go in a single request. */
export async function sendMail(mails: Mail[]): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !mails.length) return false;
  for (let i = 0; i < mails.length; i += 100) {
    const batch = mails.slice(i, i + 100).map((m) => ({ from: FROM, to: [m.to], subject: m.title, html: layout(m.title, m.body, m.cta, m.footer) }));
    const res = await fetch(mails.length === 1 ? "https://api.resend.com/emails" : "https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(mails.length === 1 ? batch[0] : batch),
    });
    if (!res.ok) {
      console.error("[email] Resend refused the message", res.status, await res.text());
      return false;
    }
  }
  return true;
}
