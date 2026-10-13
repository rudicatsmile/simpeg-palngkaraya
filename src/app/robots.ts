import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simpeg.nusantarajaya.go.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tentang",
          "/fitur",
          "/panduan",
          "/kontak",
          "/kebijakan-privasi",
          "/syarat-ketentuan",
          "/verifikasi/*",
        ],
        disallow: [
          "/dashboard",
          "/pegawai/*",
          "/atasan/*",
          "/kepala-pd/*",
          "/admin/*",
          "/eksekutif/*",
          "/audit/*",
          "/api/*",
          "/login",
          "/aktivasi",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
