/**
 * Thin wrapper around the Meta Pixel's global `fbq`.
 *
 * The pixel script loads with strategy="afterInteractive", so on a fast
 * interaction it may not exist yet. Every call is guarded rather than
 * assuming it's there — a missing pixel should never break a form submit.
 */

type Fbq = (
  command: "track" | "trackCustom",
  event: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, params);
}
