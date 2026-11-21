// The contact page's form endpoint: a JSON request from one of the site's pages, checked, and mailed to the founders
// through Resend with the sender as Reply-To, so answering the email answers them. Nothing is stored.

interface Env {
  RESEND_API_KEY: string;
  /** who gets the requests, comma-separated (a secret: no addresses in the repo) */
  MAIL_TO: string;
  MAIL_FROM: string;
  ALLOWED_ORIGINS: string;
  LIMITER: RateLimit;
}

/** what the form sends; everything but the name and the email may be empty */
interface ContactRequest {
  name: string;
  email: string;
  company: string;
  role: string;
  size: string;
  message: string;
  page: string;
  /** the form's hidden trap: a person leaves it empty */
  website: string;
}

/** bytes */
const MAX_BODY = 20_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** the longest each field may be */
const LIMITS: Record<keyof ContactRequest, number> = {
  name: 200,
  email: 320,
  company: 200,
  role: 200,
  size: 20,
  message: 5000,
  page: 200,
  website: 200,
};

const json = (body: unknown, status: number, headers: HeadersInit) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

export default {
  async fetch(request, env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    if (!env.ALLOWED_ORIGINS.split(",").includes(origin)) return new Response("Forbidden", { status: 403 });
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "method" }, 405, { ...cors, Allow: "POST, OPTIONS" });

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (!(await env.LIMITER.limit({ key: ip })).success) return json({ error: "rate" }, 429, cors);

    if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY) return json({ error: "size" }, 413, cors);
    const text = await readText(request, MAX_BODY);
    if (text === null) return json({ error: "size" }, 413, cors);
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return json({ error: "json" }, 400, cors);
    }
    const data = parse(raw);
    if (!data) return json({ error: "invalid" }, 400, cors);
    // a bot filled the trap: thank it, send nothing
    if (data.website) return json({ ok: true }, 200, cors);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: env.MAIL_TO.split(",").map((a) => a.trim()),
        reply_to: data.email,
        subject: `Запит із сайту: ${[data.name, data.company].filter(Boolean).join(", ")}`,
        text: plain(data),
        html: html(data),
      }),
    });
    if (!response.ok) {
      console.error("Resend", response.status, await response.text());
      return json({ error: "send" }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
} satisfies ExportedHandler<Env>;

/** the body as text, read as it arrives and given up past `max` bytes (null), so a large one is never buffered */
async function readText(request: Request, max: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    body.set(chunk, at);
    at += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

/** the request's fields as trimmed strings within their limits, or null if the name or the email is missing */
function parse(raw: unknown): ContactRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  const data = {} as ContactRequest;
  for (const key of Object.keys(LIMITS) as (keyof ContactRequest)[]) {
    const value = typeof source[key] === "string" ? (source[key] as string).trim() : "";
    if (value.length > LIMITS[key]) return null;
    data[key] = value;
  }
  return data.name && EMAIL.test(data.email) ? data : null;
}

/** the email's lines: the label and the value, the empty ones left out */
const rows = (d: ContactRequest): [string, string][] =>
  (
    [
      ["Ім’я", d.name],
      ["Email", d.email],
      ["Компанія", d.company],
      ["Посада", d.role],
      ["Людей у компанії", d.size],
      ["Що хочуть обговорити", d.message],
      ["Сторінка", d.page],
    ] as [string, string][]
  ).filter(([, value]) => value);

const plain = (d: ContactRequest) =>
  rows(d)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n\n");

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const html = (d: ContactRequest) =>
  `<table cellpadding="6" style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows(d)
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="color:#56606c;font-weight:500">${escape(label)}</th><td style="white-space:pre-wrap">${escape(value)}</td></tr>`,
    )
    .join("")}</table>`;
