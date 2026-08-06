"use client";

import { useState } from "react";
import type { ResolvedVideo } from "@/lib/video";

type Props = {
  video: ResolvedVideo;
  caption?: string;
};

/**
 * Click-to-play video embed.
 *
 * On first render this is just an <img> and a play button — no third-party
 * scripts, no cookies, roughly 30KB. The real iframe (which pulls in ~1MB of
 * player JS) is only mounted once the reader actually clicks. That keeps
 * Largest Contentful Paint fast, which is a ranking signal.
 */
export default function VideoEmbed({ video, caption }: Props) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  const isTikTok = video.platform === "tiktok";
  const label = video.title ?? (isTikTok ? "TikTok video" : "YouTube video");

  // If we couldn't work out an embeddable ID, degrade to a plain link rather
  // than silently dropping the content out of the article.
  if (!video.embedUrl) {
    return (
      <figure className="my-8">
        <a
          href={video.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-[#e5e0d8] bg-white px-5 py-4 text-[15px] font-light text-[#4a4540] transition-colors hover:border-[#c8a96e]"
        >
          <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-[#9a9490]">
            {isTikTok ? "TikTok" : "YouTube"}
          </span>
          {label} →
        </a>
        {caption ? <Caption>{caption}</Caption> : null}
      </figure>
    );
  }

  const thumbnail =
    thumbFailed && video.platform === "youtube"
      ? // maxresdefault doesn't exist for every video; hqdefault always does.
        video.thumbnail?.replace("maxresdefault", "hqdefault")
      : video.thumbnail;

  return (
    <figure className="my-8">
      <div
        className={
          isTikTok
            ? "relative mx-auto w-full max-w-[325px] overflow-hidden bg-[#0f172a]"
            : "relative w-full overflow-hidden bg-[#0f172a]"
        }
        style={{ aspectRatio: isTikTok ? "325 / 750" : "16 / 9" }}
      >
        {playing ? (
          <iframe
            src={video.embedUrl}
            title={label}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${label}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt=""
                loading="lazy"
                onError={() => setThumbFailed(true)}
                onLoad={(e) => {
                  // When maxresdefault doesn't exist, YouTube returns a real
                  // (non-erroring) 120x90 grey placeholder instead of a 404 —
                  // catch that case and fall back to hqdefault, which is
                  // generated for virtually every video.
                  const img = e.currentTarget;
                  if (img.naturalWidth <= 120 && img.naturalHeight <= 90) {
                    setThumbFailed(true);
                  }
                }}
                className="h-full w-full object-cover"
              />
            ) : null}

            <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />

            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-[#0f172a]" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {caption ? <Caption>{caption}</Caption> : null}
    </figure>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-center text-[13px] font-light text-[#9a9490]">
      {children}
    </figcaption>
  );
}
