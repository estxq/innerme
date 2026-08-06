/**
 * Helpers for turning a pasted YouTube / TikTok URL into something embeddable.
 *
 * These run on the server (inside the blog post page, which is a React Server
 * Component). The oEmbed lookups give us a real thumbnail + title so the page
 * can show a lightweight preview image instead of loading the full video
 * player on page load.
 */

export type VideoPlatform = "youtube" | "tiktok";

export type ResolvedVideo = {
  platform: VideoPlatform;
  /** The original URL, used as a fallback link if embedding fails. */
  href: string;
  /** URL to load inside the iframe once the reader clicks play. Null = can't embed. */
  embedUrl: string | null;
  thumbnail?: string;
  title?: string;
  author?: string;
};

function detectPlatform(rawUrl: string): VideoPlatform | null {
  let host: string;
  try {
    host = new URL(rawUrl.trim()).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
  if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    return "youtube";
  }
  if (host.endsWith("tiktok.com")) return "tiktok";
  return null;
}

/** Pull the 11-character video ID out of any of YouTube's URL shapes. */
function youTubeId(rawUrl: string): string | null {
  let u: URL;
  try {
    u = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./i, "").toLowerCase();
  const segments = u.pathname.split("/").filter(Boolean);

  // https://youtu.be/VIDEOID
  if (host === "youtu.be") return segments[0] ?? null;

  // https://www.youtube.com/watch?v=VIDEOID
  const queryId = u.searchParams.get("v");
  if (queryId) return queryId;

  // /shorts/ID, /embed/ID, /live/ID, /v/ID
  if (segments.length >= 2 && ["shorts", "embed", "live", "v"].includes(segments[0])) {
    return segments[1];
  }
  return null;
}

/** TikTok video IDs are the long numeric run in /video/1234567890. */
function tikTokId(rawUrl: string): string | null {
  const match = rawUrl.match(/\/(?:video|embed\/v2|embed)\/(\d{6,})/);
  return match ? match[1] : null;
}

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
  author_name?: string;
  embed_product_id?: string;
};

/**
 * Both YouTube and TikTok expose a public oEmbed endpoint with no API key.
 * Cached for a day so we aren't hitting them on every page render.
 */
async function fetchOEmbed(platform: VideoPlatform, rawUrl: string): Promise<OEmbedResponse | null> {
  const endpoint =
    platform === "youtube"
      ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}`
      : `https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return (await res.json()) as OEmbedResponse;
  } catch {
    // Video deleted, made private, or the network hiccuped. Not fatal.
    return null;
  }
}

export async function resolveVideo(rawUrl: string): Promise<ResolvedVideo | null> {
  const platform = detectPlatform(rawUrl);
  if (!platform) return null;

  const oembed = await fetchOEmbed(platform, rawUrl);

  if (platform === "youtube") {
    const id = youTubeId(rawUrl);
    if (!id) return { platform, href: rawUrl, embedUrl: null };

    return {
      platform,
      href: rawUrl,
      // youtube-nocookie means no tracking cookies until the reader hits play.
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      // maxresdefault is the sharpest thumbnail; the component falls back if it 404s.
      thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      title: oembed?.title,
      author: oembed?.author_name,
    };
  }

  // TikTok: short share links (vm.tiktok.com/ZSxxxx) have no ID in the URL,
  // so we lean on oEmbed's embed_product_id to recover it.
  const id = tikTokId(rawUrl) ?? oembed?.embed_product_id ?? null;
  if (!id) return { platform, href: rawUrl, embedUrl: null };

  return {
    platform,
    href: rawUrl,
    embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
    thumbnail: oembed?.thumbnail_url,
    title: oembed?.title,
    author: oembed?.author_name,
  };
}

type VideoBlock = { _key: string; _type: string; url?: string };

function isVideoBlock(block: unknown): block is VideoBlock {
  return (
    typeof block === "object" &&
    block !== null &&
    (block as VideoBlock)._type === "videoEmbed" &&
    typeof (block as VideoBlock).url === "string"
  );
}

/**
 * PortableText renderers can't be async, so we resolve every video in the post
 * up front and hand the results to the renderer as a lookup keyed by _key.
 */
export async function resolveVideosInBody(body: unknown): Promise<Record<string, ResolvedVideo>> {
  if (!Array.isArray(body)) return {};

  const blocks = body.filter(isVideoBlock);
  if (blocks.length === 0) return {};

  const resolved = await Promise.all(
    blocks.map(async (block) => [block._key, await resolveVideo(block.url!)] as const),
  );

  return Object.fromEntries(
    resolved.filter((entry): entry is [string, ResolvedVideo] => entry[1] !== null),
  );
}
