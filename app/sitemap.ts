import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.acossaenterprise.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wholesaler`,
      lastModified: new Date(),
      priority: 0.7,
    },

    // ✅ Legal pages (trust + SEO)
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/return`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/cancellation`, lastModified: new Date(), priority: 0.4 },
  ];
}
