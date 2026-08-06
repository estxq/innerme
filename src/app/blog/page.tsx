import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { postsListQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Financial personality insights, money tips, and guides from InnerMe.",
};

const PAGE_SIZE = 4;

type PostListItem = {
  title: string;
  slug: string;
  coverImage?: unknown;
  seoDescription?: string;
  publishedAt?: string;
};

export default async function BlogIndexPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await props.searchParams;
  const allPosts: PostListItem[] = await client.fetch(postsListQuery);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.seoDescription?.toLowerCase().includes(query)
      )
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const posts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-4">InnerMe Blog</p>
        <h1 className="serif text-[clamp(2rem,5vw,3rem)] leading-[1.15] text-[#0f172a] mb-10">
          What do you want to <em>know?</em>
        </h1>

        <form action="/blog" method="get" className="relative max-w-lg mx-auto">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9490]" fill="none" viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            className="w-full bg-white border border-[#e8e4df] rounded-full pl-12 pr-5 py-3.5 text-sm text-[#0f172a] placeholder:text-[#c0bbb5] focus:outline-none focus:border-[#c8a96e] transition-colors duration-200"
          />
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-sm text-[#9a9490] font-light text-center py-16">
            {query ? `No articles found for "${q}".` : "No articles yet — check back soon."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ece8] mb-4">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={urlFor(post.coverImage).width(700).height(525).url()}
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
                  <h2 className="text-lg font-medium text-[#0f172a] leading-snug mb-1.5 group-hover:underline">
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

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-6 mt-16">
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)}
                    className="text-xs tracking-[0.15em] uppercase text-[#9a9490] hover:text-[#0f172a] transition-colors duration-200">
                    ← Previous
                  </Link>
                ) : (
                  <span className="text-xs tracking-[0.15em] uppercase text-[#d8d3cd]">← Previous</span>
                )}

                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={pageHref(p)}
                      className={`w-7 h-7 flex items-center justify-center text-xs transition-colors duration-200 ${
                        p === currentPage ? "bg-[#0f172a] text-white" : "text-[#9a9490] hover:text-[#0f172a]"
                      }`}>
                      {p}
                    </Link>
                  ))}
                </div>

                {currentPage < totalPages ? (
                  <Link href={pageHref(currentPage + 1)}
                    className="text-xs tracking-[0.15em] uppercase text-[#9a9490] hover:text-[#0f172a] transition-colors duration-200">
                    Next →
                  </Link>
                ) : (
                  <span className="text-xs tracking-[0.15em] uppercase text-[#d8d3cd]">Next →</span>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
