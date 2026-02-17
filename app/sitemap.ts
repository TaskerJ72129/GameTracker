export default function sitemap() {
  const base = "https://gametracker-chi.vercel.app";

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/login`, lastModified: new Date() },
    { url: `${base}/signup`, lastModified: new Date() },
  ];
}
