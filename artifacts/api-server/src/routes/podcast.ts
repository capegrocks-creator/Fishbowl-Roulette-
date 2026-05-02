import { Router, type IRouter } from "express";

const router: IRouter = Router();

const RSS_URL = "https://feed.podbean.com/fishbowlroulettepodcast/feed.xml";
const FALLBACK_PLAYER_ID = "bgrsm-1aade04";
const SHOW_FALLBACK_URL = "https://fishbowlroulettepodcast.podbean.com/";
const UA = "Mozilla/5.0 (compatible; FishbowlRouletteSite/1.0)";

const CACHE_TTL_MS = 30 * 60 * 1000;

const buildPlayerSrc = (playerId: string) =>
  `https://www.podbean.com/player-v2/?i=${playerId}&playlist=true&square=1&share=1&download=1&skin=1`;

/* ── helpers ────────────────────────────────────────────── */

const stripCdata = (s: string) =>
  s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();

const stripTags = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const pick = (item: string, tag: string): string | undefined => {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = item.match(re);
  if (!m) return undefined;
  return stripCdata(m[1]).trim();
};

const pickAttr = (item: string, tag: string, attr: string): string | undefined => {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["']`, "i");
  return item.match(re)?.[1];
};

/* Allow only safe https URLs from known Podbean hosts. Anything else
   (javascript:, data:, http:, foreign domains) is dropped to an empty
   string so the frontend never renders an unsafe link or audio src. */
const ALLOWED_HOST_SUFFIXES = [
  "podbean.com",
  "podbean.cloud",
  "pbcdn1.podbean.com",
  "mcdn.podbean.com",
];
const safeUrl = (raw: string | undefined): string => {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return "";
    const host = u.hostname.toLowerCase();
    const ok = ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
    return ok ? u.toString() : "";
  } catch {
    return "";
  }
};

/* ── /api/podcast/episodes — full list ──────────────────── */

interface Episode {
  guid: string;
  title: string;
  pubDate: string;
  pubDateMs: number;
  description: string;
  durationSeconds: number | null;
  audioUrl: string;
  episodeUrl: string;
  episodeNumber: number | null;
}

interface CachedEpisodes {
  episodes: Episode[];
  fetchedAt: number;
}

let episodesCache: CachedEpisodes | null = null;

async function fetchEpisodes(): Promise<Episode[]> {
  const res = await fetch(RSS_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const xml = await res.text();

  const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  return items.map((item, idx) => {
    const title = pick(item, "title") ?? `Episode ${idx + 1}`;
    const pubDateRaw = pick(item, "pubDate") ?? "";
    const pubDateMs = pubDateRaw ? Date.parse(pubDateRaw) || 0 : 0;
    const link = pick(item, "link") ?? SHOW_FALLBACK_URL;
    const guid = pick(item, "guid") ?? link;
    const descRaw = pick(item, "description") ?? "";
    const audioUrl = pickAttr(item, "enclosure", "url") ?? "";
    const durationRaw = pick(item, "itunes:duration");
    let durationSeconds: number | null = null;
    if (durationRaw) {
      if (/^\d+$/.test(durationRaw)) {
        durationSeconds = Number(durationRaw);
      } else {
        const parts = durationRaw.split(":").map(Number);
        if (parts.every((n) => !Number.isNaN(n))) {
          durationSeconds = parts.reduce((acc, n) => acc * 60 + n, 0);
        }
      }
    }
    const epNumRaw = pick(item, "itunes:episode");
    const episodeNumber = epNumRaw && /^\d+$/.test(epNumRaw) ? Number(epNumRaw) : null;
    return {
      guid,
      title: stripTags(title),
      pubDate: pubDateRaw,
      pubDateMs,
      description: stripTags(descRaw),
      durationSeconds,
      audioUrl: safeUrl(audioUrl),
      episodeUrl: safeUrl(link) || SHOW_FALLBACK_URL,
      episodeNumber,
    };
  });
}

router.get("/podcast/episodes", async (_req, res) => {
  try {
    if (!episodesCache || Date.now() - episodesCache.fetchedAt > CACHE_TTL_MS) {
      episodesCache = { episodes: await fetchEpisodes(), fetchedAt: Date.now() };
    }
    res.set("Cache-Control", "public, max-age=600");
    res.json({ episodes: episodesCache.episodes, count: episodesCache.episodes.length });
  } catch (err) {
    res.status(502).json({
      episodes: [],
      count: 0,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
});

/* ── /api/podcast/latest-player — kept for backward compat ── */

interface CachedPlayer {
  playerId: string;
  episodeUrl: string;
  episodeTitle: string;
  fetchedAt: number;
}

let cache: CachedPlayer | null = null;

async function resolveLatestPlayer(): Promise<CachedPlayer> {
  const rssRes = await fetch(RSS_URL, { headers: { "User-Agent": UA } });
  if (!rssRes.ok) throw new Error(`RSS ${rssRes.status}`);
  const xml = await rssRes.text();

  const itemMatch = xml.match(/<item[\s\S]*?<\/item>/);
  if (!itemMatch) throw new Error("no <item> in feed");
  const item = itemMatch[0];

  const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)/);
  const linkMatch = item.match(/<link>([^<]+)<\/link>/);
  const episodeUrl = linkMatch?.[1]?.trim() ?? SHOW_FALLBACK_URL;
  const episodeTitle = titleMatch?.[1]?.trim() ?? "Latest Episode";

  const pageRes = await fetch(episodeUrl, { headers: { "User-Agent": UA } });
  if (!pageRes.ok) throw new Error(`episode page ${pageRes.status}`);
  const html = await pageRes.text();

  const idMatch = html.match(/player-v2\/\?i=([a-z0-9-]+)/i);
  if (!idMatch) throw new Error("no player-v2 id on episode page");

  return {
    playerId: idMatch[1],
    episodeUrl,
    episodeTitle,
    fetchedAt: Date.now(),
  };
}

router.get("/podcast/latest-player", async (_req, res) => {
  try {
    if (!cache || Date.now() - cache.fetchedAt > CACHE_TTL_MS) {
      cache = await resolveLatestPlayer();
    }
    res.json({
      playerSrc: buildPlayerSrc(cache.playerId),
      playerId: cache.playerId,
      episodeUrl: cache.episodeUrl,
      episodeTitle: cache.episodeTitle,
      cached: true,
    });
  } catch (err) {
    res.json({
      playerSrc: buildPlayerSrc(FALLBACK_PLAYER_ID),
      playerId: FALLBACK_PLAYER_ID,
      episodeUrl: SHOW_FALLBACK_URL,
      episodeTitle: "Latest Episode",
      cached: false,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
});

export default router;
