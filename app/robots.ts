export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://gametracker-chi.vercel.app/sitemap.xml",
  };
}
