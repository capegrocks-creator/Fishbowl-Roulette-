import { Router, type IRouter } from "express";

const router: IRouter = Router();

const RSS_URL = "https://feed.podbean.com/fishbowlroulettepodcast/feed.xml";
const FALLBACK_PLAYER_ID = "bgrsm-1aade04";
const SHOW_FALLBACK_URL = "https://fishbowlroulettepodcast.podbean.com/";
const UA = "Mozilla/5.0 (compatible; FishbowlRouletteSite/1.0)";

interface CachedPlayer {
  playerId: string;
  episodeUrl: string;
  episodeTitle: string;
  fetchedAt: number;
}

let cache: CachedPlayer | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

const buildPlayerSrc = (playerId: string) =>
  `https://www.podbean.com/player-v2/?i=${playerId}&playlist=true&square=1&share=1&download=1&skin=1`;

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
