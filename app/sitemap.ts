import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://gametracker-chi.vercel.app";
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now },
    { url: `${siteUrl}/login`, lastModified: now },
    { url: `${siteUrl}/signup`, lastModified: now },
  ];
}