import Link from "next/link";
import { Building2, ShieldCheck, Sparkles, Award } from "lucide-react";
import { AuthBrandHeader, AuthCopyrightFooter } from "@/components/auth/AuthBranding";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-muted/30 lg:grid lg:grid-cols-12 lg:gap-0">
      {/* Kolom Kiri: Ilustrasi & Ringkasan Fitur (Desktop) */}
      <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Dekorasi background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Brand */}
        <div className="relative z-10">
          <AuthBrandHeader />
        </div>

        {/* Highlight Value Proposition */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Sistem Informasi Kepegawaian Generasi Baru</span>
          </div>

          <h2 className="font-heading text-3xl font-extrabold leading-tight">
            Tata Kelola Karir ASN Lebih Cepat, Transparan, & Akurat.
          </h2>

          <p className="text-sm text-primary-foreground/85 leading-relaxed">
            Dilengkapi notifikasi otomatis kenaikan pangkat H-180, pengajuan cuti instan mandiri,
            dan rekapitulasi penilaian kinerja SKP terintegrasi.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
              <span>Autentikasi Aman & Row Level Security (RLS) PostgreSQL</span>
            </div>
            <div className="flex items-center gap-3 text-xs bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
              <Award className="h-4 w-4 text-amber-300 shrink-0" />
              <span>Sesuai Standar Kompetensi Nasional & UU No. 20 Tahun 2023</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10">
          <AuthCopyrightFooter className="text-primary-foreground/75" />
        </div>
      </div>


      {/* Kolom Kanan: Konten Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:col-span-7 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
