"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

/**
 * Komponen Brand Header untuk Halaman Autentikasi (Login, Aktivasi, Reset Password)
 */
export function AuthBrandHeader() {
  const { settings } = useAppSettings();

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {settings.logo_url ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
          <img
            src={settings.logo_url}
            alt={settings.nama_aplikasi}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-lg group-hover:scale-105 transition-transform">
          <Building2 className="h-6 w-6" />
        </div>
      )}
      <div>
        <h1 className="font-heading text-xl font-bold tracking-tight text-white">
          {settings.nama_aplikasi}
        </h1>
        <p className="text-xs text-primary-foreground/80 font-medium">
          {settings.nama_sub_aplikasi}
        </p>
      </div>
    </Link>
  );
}

/**
 * Komponen Copyright Footer untuk Halaman Autentikasi
 */
export function AuthCopyrightFooter({ className = "" }: { className?: string }) {
  const { settings } = useAppSettings();

  return (
    <div className={`text-xs ${className}`}>
      {settings.nama_hak_cipta ||
        `© ${new Date().getFullYear()} ${settings.nama_sub_aplikasi}. Hak Cipta Dilindungi Undang-Undang.`}
    </div>
  );
}
