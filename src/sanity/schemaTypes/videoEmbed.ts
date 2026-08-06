import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoEmbed",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description:
        "Paste a YouTube or TikTok link. Works with youtube.com/watch, youtu.be, YouTube Shorts, tiktok.com/@user/video/... and vm.tiktok.com share links.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return "A video URL is required";
          return /(?:youtube\.com|youtu\.be|tiktok\.com)/i.test(value)
            ? true
            : "Must be a YouTube or TikTok URL";
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional line of text shown under the video.",
    }),
  ],
  preview: {
    select: { url: "url", caption: "caption" },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      const platform = /tiktok\.com/i.test(url ?? "") ? "TikTok" : "YouTube";
      return {
        title: caption || `${platform} video`,
        subtitle: url || "No URL set",
      };
    },
  },
});
