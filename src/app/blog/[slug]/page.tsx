import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, allSlugsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import VideoEmbed from "@/components/VideoEmbed";
import { resolveVideosInBody, type ResolvedVideo } from "@/lib/video";

export const revalidate = 60;

type Post = {
  title: string;
  slug: string;
  coverImage?: unknown;
  seoDescription?: string;
  publishedAt?: string;
  body?: unknown;
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(allSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post: Post | null = await client.fetch(postBySlugQuery, { slug });
  if (!post) return {};

  const ogImage = post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : undefined;

  return {
    title: post.title,
    description: post.seoDescription,
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      images: ogImage ? [ogImage] : undefined,
      type: "article",
    },
  };
}

// Videos are resolved (thumbnail, title) on the server before rendering, then
// passed in here as a lookup — PortableText renderers can't be async.
const buildPortableTextComponents = (
  videos: Record<string, ResolvedVideo>,
): PortableTextComponents => ({
  types: {
    image: ({ value }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(value).width(1200).url()}
        alt=""
        className="w-full h-auto my-8"
      />
    ),
    videoEmbed: ({ value }) => {
      const video = videos[value?._key];
      if (!video) return null;
      return <VideoEmbed video={video} caption={value?.caption} />;
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0f172a] underline underline-offset-2 hover:text-[#c8a96e] transition-colors"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] text-[#4a4540] font-light leading-relaxed mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="serif text-xl text-[#0f172a] mt-10 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-medium text-[#0f172a] mt-8 mb-2">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#c8a96e] pl-4 italic text-[#4a4540] my-6">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 mb-5 space-y-1.5 text-[15px] text-[#4a4540] font-light">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 mb-5 space-y-1.5 text-[15px] text-[#4a4540] font-light">{children}</ol>,
  },
});

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post: Post | null = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  const videos = await resolveVideosInBody(post.body);
  const portableTextComponents = buildPortableTextComponents(videos);

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {post.publishedAt ? (
          <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-3">
            {new Date(post.publishedAt).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        ) : null}

        <h1 className="serif text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2] text-[#0f172a] mb-8">
          {post.title}
        </h1>

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(post.coverImage).width(1200).url()}
            alt={post.title}
            className="w-full h-auto mb-10"
          />
        ) : null}

        {post.body ? (
          <div>
            <PortableText value={post.body as never} components={portableTextComponents} />
          </div>
        ) : null}

        <div className="mt-16 bg-[#0f172a] px-8 py-10 text-center">
          <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-3">Before you go</p>
          <h2 className="serif text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-white mb-8">
            What&apos;s your financial personality?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/financial-persona"
              className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-6 py-3 text-xs tracking-[0.12em] uppercase hover:bg-[#f0ece8] transition-colors duration-300">
              Take the Quiz
            </Link>
            <Link href="/giveaway"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-xs tracking-[0.12em] uppercase hover:border-white transition-colors duration-300">
              Win Sporting Sunglasses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
