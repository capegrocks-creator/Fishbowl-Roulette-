import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual } from "node:crypto";
import { db, subscribersTable, insertSubscriberSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/* ── POST /api/subscribe ─────────────────────────────────────────
   Public endpoint. Validates the email, dedupes, and stores it.
   Returns { ok: true } on both fresh inserts and duplicates so
   the public form never leaks whether an email is already on the
   list (basic enumeration protection). */
/* Defense-in-depth: clamp client-supplied `source` to a known
   allowlist before it ever reaches the database. Anything else
   (including odd strings that could be useful for spreadsheet
   abuse on CSV export) collapses to "website". */
const ALLOWED_SOURCES = new Set(["website", "landing-page", "footer", "hero"]);

router.post("/subscribe", async (req: Request, res: Response) => {
  const rawSource = typeof req.body?.source === "string" ? req.body.source : "";
  const safeSource = ALLOWED_SOURCES.has(rawSource) ? rawSource : "website";

  const parsed = insertSubscriberSchema.safeParse({
    email: req.body?.email,
    source: safeSource,
  });

  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    return;
  }

  try {
    await db
      .insert(subscribersTable)
      .values(parsed.data)
      .onConflictDoNothing({ target: subscribersTable.email });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to insert subscriber");
    res.status(500).json({ ok: false, error: "Something went wrong on our end." });
  }
});

/* ── HTTP Basic Auth for /admin ──────────────────────────────────
   Single shared password set via the ADMIN_PASSWORD env var.
   Username is ignored. Uses constant-time comparison. */
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    logger.error("ADMIN_PASSWORD env var is not set; refusing /admin access");
    res.status(503).type("text/plain").send(
      "Admin is not configured. Set the ADMIN_PASSWORD secret in Replit and reload.",
    );
    return;
  }

  const header = req.headers.authorization ?? "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const idx = decoded.indexOf(":");
      const provided = idx === -1 ? decoded : decoded.slice(idx + 1);

      const a = Buffer.from(provided);
      const b = Buffer.from(expected);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        next();
        return;
      }
    } catch {
      /* fall through to 401 */
    }
  }

  res
    .status(401)
    .set("WWW-Authenticate", 'Basic realm="Fishbowl Admin", charset="UTF-8"')
    .type("text/plain")
    .send("Authentication required.");
};

/* ── tiny HTML escape ─────────────────────────────────────────── */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* ── GET /api/admin ──────────────────────────────────────────────
   Server-rendered subscriber list. Tavern-styled to match the
   public site so it doesn't feel like a different app. */
router.get("/admin", requireAdminAuth, async (_req: Request, res: Response) => {
  let rows;
  try {
    rows = await db
      .select()
      .from(subscribersTable)
      .orderBy(desc(subscribersTable.createdAt));
  } catch (err) {
    logger.error({ err }, "Failed to load subscribers for /admin");
    res.status(500).type("text/plain").send("Failed to load subscribers.");
    return;
  }

  const fmt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  const tableRows = rows
    .map(
      (r, i) => `
        <tr>
          <td class="num">${rows.length - i}</td>
          <td class="email">${esc(r.email)}</td>
          <td class="src">${esc(r.source ?? "")}</td>
          <td class="when">${esc(fmt.format(r.createdAt))}</td>
        </tr>`,
    )
    .join("");

  const csvHref = "/api/admin/subscribers.csv";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Fishbowl Admin · Subscribers</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #f5ead8;
      background:
        repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,200,100,0.014) 2px, rgba(255,200,100,0.014) 4px),
        repeating-linear-gradient(92deg, transparent, transparent 60px, rgba(0,0,0,0.06) 60px, rgba(0,0,0,0.06) 62px),
        linear-gradient(180deg, #2c1a08 0%, #3d2510 40%, #2c1a08 100%);
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 48px 24px 64px; }
    header { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; }
    h1 { font-family: "Playfair Display", Georgia, serif; font-weight: 700; font-size: clamp(1.6rem, 4vw, 2.2rem); margin: 0; color: #f5ead8; }
    .count { color: #d9c2ad; font-size: 0.95rem; }
    .actions a {
      display: inline-block; padding: 9px 16px; border-radius: 999px;
      background: rgba(245,234,216,0.08); color: #f5ead8;
      text-decoration: none; font-size: 0.85rem; font-weight: 600;
      border: 1px solid rgba(245,234,216,0.25); letter-spacing: 0.02em;
    }
    .actions a:hover { background: rgba(245,234,216,0.16); }
    table { width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.22); border: 1px solid rgba(255,200,100,0.10); border-radius: 12px; overflow: hidden; }
    th, td { padding: 12px 16px; text-align: left; font-size: 0.92rem; }
    th { background: rgba(0,0,0,0.35); color: #c49a6c; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.72rem; border-bottom: 1px solid rgba(255,200,100,0.12); }
    tr + tr td { border-top: 1px solid rgba(255,255,255,0.04); }
    td.num { color: #8a7560; width: 50px; }
    td.email { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #f5ead8; }
    td.src { color: #d9c2ad; }
    td.when { color: #a8957d; white-space: nowrap; font-size: 0.85rem; }
    .empty { padding: 48px 24px; text-align: center; color: #a8957d; font-style: italic; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h1>🐠 Fishbowl Subscribers</h1>
        <div class="count">${rows.length} ${rows.length === 1 ? "person" : "people"} on the list</div>
      </div>
      <div class="actions">
        <a href="${csvHref}">Download CSV</a>
      </div>
    </header>

    ${
      rows.length === 0
        ? `<div class="empty">No signups yet — share the site and they'll appear here.</div>`
        : `<table>
            <thead>
              <tr><th>#</th><th>Email</th><th>Source</th><th>Joined (PT)</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>`
    }
  </div>
</body>
</html>`;

  res.type("text/html").send(html);
});

/* ── GET /api/admin/subscribers.csv ─────────────────────────────
   Same auth gate; returns a download for backup / import elsewhere. */
router.get(
  "/admin/subscribers.csv",
  requireAdminAuth,
  async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select()
        .from(subscribersTable)
        .orderBy(desc(subscribersTable.createdAt));

      /* Defend against CSV formula injection: if a cell starts with
         a character a spreadsheet would interpret as a formula
         (`=`, `+`, `-`, `@`, tab, CR), prepend a single quote so
         Excel/Sheets render it as literal text instead of executing
         it. `source` is user-supplied so this is required. */
      const csvCell = (v: string) => {
        const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
        return `"${safe.replace(/"/g, '""')}"`;
      };
      const lines = ["email,source,created_at"];
      for (const r of rows) {
        lines.push(
          [
            csvCell(r.email),
            csvCell(r.source ?? ""),
            csvCell(r.createdAt.toISOString()),
          ].join(","),
        );
      }

      res
        .type("text/csv")
        .set("Content-Disposition", 'attachment; filename="fishbowl-subscribers.csv"')
        .send(lines.join("\n"));
    } catch (err) {
      logger.error({ err }, "Failed to export subscribers CSV");
      res.status(500).type("text/plain").send("Failed to export.");
    }
  },
);

export default router;
