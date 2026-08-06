import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { postsListQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | InnerMe",
  description: "Financial personality insights, money tips, and guides from InnerMe.",
};

type PostListItem = {
  title: string;
  slug: string;
  coverImage?: unknown;
  seoDescription?: string;
  publishedAt?: string;
};

export default async function BlogIndexPage() {
  const posts: PostListItem[] = await client.fetch(postsListQuery);

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-4">InnerMe Blog</p>
        <h1 className="serif text-[clamp(2rem,5vw,3rem)] leading-[1.15] text-[#0f172a] mb-12">
          Money, made <em>clearer.</em>
        </h1>

        {posts.length === 0 ? (
          <p className="text-sm text-[#9a9490] font-light">No articles yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ece8] mb-4">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlFor(post.coverImage).width(600).height(450).url()}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                {post.publishedAt ? (
                  <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-1.5">
                    {new Date(post.publishedAt).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                ) : null}
                <h2 className="text-base font-medium text-[#0f172a] leading-snug mb-1.5 group-hover:underline">
                  {post.title}
                </h2>
                {post.seoDescription ? (
                  <p className="text-sm text-[#9a9490] font-light leading-relaxed line-clamp-2">
                    {post.seoDescription}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
