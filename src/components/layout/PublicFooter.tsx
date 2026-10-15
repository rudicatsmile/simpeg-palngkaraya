"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Shield } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";


export function PublicFooter() {
  const { settings } = useAppSettings();

  return (
    <footer className="border-t border-border bg-card text-muted-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Kolom 1: Profil */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {settings.logo_url ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border/60 p-1">
                  <img
                    src={settings.logo_url}
                    alt={settings.nama_aplikasi}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
              )}
              <span className="font-heading font-bold text-foreground text-base">
                {settings.nama_aplikasi}
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Platform Manajemen Kepegawaian ASN Terpadu {settings.nama_sub_aplikasi}.
              Mendukung tata kelola SDM aparatur yang transparan, profesional, dan akuntabel.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Sesuai Regulasi UU No. 20 Tahun 2023 tentang ASN</span>
            </div>
          </div>

          {/* Kolom 2: Menu Utama */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground font-heading">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/fitur" className="hover:text-primary transition-colors">
                  Prediksi Kenaikan Pangkat (Early Warning)
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-primary transition-colors">
                  Pengajuan & Kalkulasi Cuti Real-time
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-primary transition-colors">
                  Penilaian Kinerja SKP Digital
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-primary transition-colors">
                  Kartu Identitas Digital & QR ASN
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-primary transition-colors">
                  Perencanaan Formasi & Talent Pool
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Regulasi & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground font-heading">
              Regulasi & Informasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/panduan" className="hover:text-primary transition-colors">
                  Panduan Penggunaan Portal
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
                  Kebijakan Privasi (UU PDP)
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
                  Syarat dan Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/verifikasi/d9e8f7a6-b5c4-4d3e-2f1a-0b9c8d7e6f5a" className="hover:text-primary transition-colors">
                  Validasi Keaslian QR Code SK
                </Link>
              </li>
              <li>
                <Link href="/aktivasi" className="hover:text-primary transition-colors">
                  Aktivasi Akun Pegawai Baru
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak BKPSDM */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground font-heading">
              {settings.nama_sekretariat || "Sekretariat BKPSDM"}
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>
                  {settings.alamat_sekretariat ||
                    "Jl. Praja Prajamukti No. 1, Kompleks Perkantoran Pemkab Nusantara Jaya"}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  {settings.telepon_sekretariat || "(021) 8765-4321 / 0812-3456-7890"}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  {settings.email_sekretariat || "bkpsdm@nusantarajaya.go.id"}
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground pt-1">
                {settings.jam_operasional_sekretariat || "Senin - Jumat: 07.30 - 16.00 WIB"}
              </p>
            </div>
          </div>
        </div>


        {/* Hak cipta */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            {settings.nama_hak_cipta ||
              `© ${new Date().getFullYear()} ${settings.nama_sub_aplikasi}. Hak Cipta Dilindungi Undang-Undang.`}
          </p>
          <div className="flex gap-4">
            <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
              Syarat & Ketentuan
            </Link>
            <span>•</span>
            <Link href="/kontak" className="hover:text-primary transition-colors">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
