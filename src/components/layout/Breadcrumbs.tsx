"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const segmentLabels: Record<string, string> = {
    dashboard: "Dasbor Pegawai",
    pegawai: "Layanan Pegawai",
    profil: "Profil Saya",
    "riwayat-perubahan": "Riwayat Perubahan",
    cuti: "Cuti & Izin",
    baru: "Formulir Baru",
    kepangkatan: "Kepangkatan & KGB",
    dokumen: "Manajemen Dokumen",
    qr: "Identitas Digital QR",
    absensi: "Presensi & Kehadiran",
    diklat: "Diklat & Kompetensi",
    kinerja: "Penilaian SKP",
    disiplin: "Hukuman Disiplin",
    pensiun: "Pensiun & Purna Tugas",
    notifikasi: "Pusat Notifikasi",
    pengaturan: "Pengaturan Akun",
    atasan: "Area Atasan Langsung",
    persetujuan: "Antrean Persetujuan",
    bawahan: "Daftar Bawahan",
    penilaian: "Penilaian Kinerja",
    "kepala-pd": "Area Kepala Perangkat Daerah",
    monitoring: "Monitoring Pegawai PD",
    formasi: "Kebutuhan Formasi",
    admin: "Administrasi & Pengelolaan",
    "jabatan-mutasi": "Jabatan & Mutasi",
    jabatan: "Master Jabatan",
    lowongan: "Lowongan Internal",
    perangkat: "Perangkat Fingerprint",
    usulan: "Usulan Diklat",
    kompetensi: "Pemetaan Kompetensi",
    "talent-pool": "Talent Pool & Suksesi",
    template: "Template Notifikasi",
    laporan: "Laporan & Statistik",
    "aturan-bisnis": "Pengaturan Aturan Bisnis",
    pengguna: "Manajemen Pengguna & RBAC",
    impor: "Impor Data CSV",
    eksekutif: "Dashboard Eksekutif",
    "early-warning": "Early Warning Pangkat",
    audit: "Inspektorat & Pengawasan",
    trail: "Audit Trail Perubahan",
    log: "Log Aktivitas Login",
    tentang: "Tentang Kami",
    fitur: "Fitur Unggulan",
    panduan: "Panduan Pengguna",
    kontak: "Kontak BKPSDM",
    "kebijakan-privasi": "Kebijakan Privasi",
    "syarat-ketentuan": "Syarat & Ketentuan",
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground pb-4 overflow-x-auto">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label =
          segmentLabels[segment] ||
          (segment.length > 20
            ? "Detail"
            : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));

        return (
          <div key={url} className="flex items-center space-x-1.5 shrink-0">
            <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground">{label}</span>
            ) : (
              <Link href={url} className="hover:text-primary transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
