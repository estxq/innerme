import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { postsListQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://innerme.sg";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/financial-persona`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/couple-compatibility`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/local-food`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/lucky-draw`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/giveaway`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
  ];

  let posts: { slug: string; publishedAt?: string }[] = [];
  try {
    posts = await client.fetch(postsListQuery);
  } catch {
    posts = [];
  }

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
