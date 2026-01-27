import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fancy-gh-card.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      allow: "/api/og",
      disallow: ["/api/github"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
