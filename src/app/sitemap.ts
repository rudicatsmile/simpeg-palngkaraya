import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simpeg.nusantarajaya.go.id";
  const now = new Date();

  const publicRoutes = [
    "",
    "/tentang",
    "/fitur",
    "/panduan",
    "/kontak",
    "/kebijakan-privasi",
    "/syarat-ketentuan",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
