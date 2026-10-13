import type { Metadata } from "next";
import { Toaster } from "sonner";
import { RoleProvider } from "@/context/RoleContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | SIMPEG Daerah - Kabupaten Nusantara Jaya",
    default: "SIMPEG Daerah - Sistem Kepegawaian ASN Terintegrasi",
  },
  description:
    "Sistem Informasi Manajemen Kepegawaian Pemerintah Daerah Kabupaten Nusantara Jaya. Layanan mandiri ASN, prediksi kenaikan pangkat, mutasi, cuti, kinerja, dan pensiun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <RoleProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "0.75rem",
              },
            }}
          />
        </RoleProvider>
      </body>
    </html>
  );
}
