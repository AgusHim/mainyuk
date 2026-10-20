import type { MetadataRoute } from "next";

const origin = "https://ynsolo.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: origin, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/community`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${origin}/donations`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${origin}/missions`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${origin}/leaderboard`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${origin}/walking-tour`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/speaking-for-life`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
