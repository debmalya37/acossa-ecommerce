import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ✅ ALL BOTS (default)
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/my-account",
          "/cart",
          "/checkout",
          "/admin",
        ],
      },

      // ✅ Explicit AI / LLM Crawlers (optional but recommended)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],

    sitemap: "https://www.acossaenterprise.com/sitemap.xml",
  };
}
