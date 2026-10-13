"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import {
  Building2,
  LayoutDashboard,
  User,
  Calendar,
  Award,
  FileText,
  QrCode,
  Clock,
  GraduationCap,
  Target,
  AlertTriangle,
  HeartHandshake,
  Settings,
  Bell,
  Users,
  CheckCircle,
  FileCheck,
  TrendingUp,
  Briefcase,
  Layers,
  Search,
  Sparkles,
  Sliders,
  ShieldAlert,
  Send,
  Download,
  Fingerprint,
} from "lucide-react";

interface SidebarProps {
  onItemClick?: () => void;
}

export function DashboardSidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole } = useRole();

  // Kelompok menu navigasi
  const getNavSections = () => {
    switch (currentRole) {
      case "atasan":
        return [
          {
            title: "Pengawasan Atasan",
            items: [
              { href: "/atasan/dashboard", label: "Dasbor Atasan", icon: LayoutDashboard },
              { href: "/atasan/persetujuan", label: "Antrean Persetujuan", icon: CheckCircle },
              { href: "/atasan/bawahan", label: "Daftar Bawahan", icon: Users },
              { href: "/atasan/penilaian", label: "Penilaian SKP", icon: Target },
            ],
          },
          {
            title: "Layanan Mandiri",
            items: [
              { href: "/dashboard", label: "Dasbor Pribadi", icon: User },
              { href: "/pegawai/cuti", label: "Cuti Saya", icon: Calendar },
            ],
          },
        ];

      case "kepala_pd":
        return [
          {
            title: "Pimpinan Perangkat Daerah",
            items: [
              { href: "/kepala-pd/dashboard", label: "Dasbor Kepala PD", icon: LayoutDashboard },
              { href: "/kepala-pd/persetujuan", label: "Persetujuan Tk. 2", icon: CheckCircle },
              { href: "/kepala-pd/monitoring", label: "Monitoring Pegawai", icon: Users },
              { href: "/kepala-pd/formasi", label: "Kebutuhan Formasi", icon: Layers },
            ],
          },
          {
            title: "Layanan Mandiri",
            items: [
              { href: "/dashboard", label: "Dasbor Pribadi", icon: User },
              { href: "/pegawai/profil", label: "Profil Saya", icon: FileText },
            ],
          },
        ];

      case "super_admin":
      case "operator":
        return [
          {
            title: "Manajemen Utama",
            items: [
              { href: "/admin/dashboard", label: "Dasbor Admin", icon: LayoutDashboard },
              { href: "/admin/pegawai", label: "Data Induk Pegawai", icon: Users },
              { href: "/admin/perubahan-data", label: "Verifikasi Data", icon: FileCheck },
              { href: "/admin/kepangkatan", label: "Kenaikan Pangkat", icon: Award },
              { href: "/admin/jabatan-mutasi", label: "Jabatan & Mutasi", icon: Briefcase },
            ],
          },
          {
            title: "Kinerja & Kehadiran",
            items: [
              { href: "/admin/kinerja", label: "Monitoring SKP", icon: Target },
              { href: "/admin/absensi", label: "Kehadiran & Absensi", icon: Clock },
              { href: "/admin/cuti", label: "Manajemen Cuti", icon: Calendar },
              { href: "/admin/diklat", label: "Katalog & Usulan Diklat", icon: GraduationCap },
              { href: "/admin/kompetensi", label: "Kompetensi & Gap", icon: Sparkles },
            ],
          },
          {
            title: "Status & Perencanaan",
            items: [
              { href: "/admin/disiplin", label: "Hukuman Disiplin", icon: AlertTriangle },
              { href: "/admin/pensiun", label: "Pensiun & Purna", icon: HeartHandshake },
              { href: "/admin/dokumen", label: "Dokumen Digital", icon: FileText },
              { href: "/admin/formasi", label: "Analisis Formasi", icon: Layers },
              { href: "/admin/talent-pool", label: "Talent Pool & Suksesi", icon: TrendingUp },
            ],
          },
          {
            title: "Sistem & Konfigurasi",
            items: [
              { href: "/admin/notifikasi", label: "Pusat Notifikasi", icon: Bell },
              { href: "/admin/laporan", label: "Laporan & Statistik", icon: Download },
              { href: "/admin/aturan-bisnis", label: "Aturan Bisnis", icon: Sliders },
              { href: "/admin/pengguna", label: "Pengguna & Peran", icon: ShieldAlert },
              { href: "/admin/pengaturan", label: "Pengaturan Umum", icon: Settings },
            ],
          },
        ];

      case "pimpinan":
        return [
          {
            title: "Eksekutif & Kebijakan",
            items: [
              { href: "/eksekutif/dashboard", label: "Dasbor Eksekutif", icon: LayoutDashboard },
              { href: "/eksekutif/pensiun", label: "Prediksi Pensiun", icon: HeartHandshake },
              { href: "/eksekutif/early-warning", label: "Early Warning Pangkat", icon: AlertTriangle },
              { href: "/eksekutif/formasi", label: "Analisis Formasi", icon: Layers },
              { href: "/eksekutif/laporan", label: "Laporan Strategis", icon: Download },
            ],
          },
        ];

      case "auditor":
        return [
          {
            title: "Pengawasan & Audit",
            items: [
              { href: "/audit/dashboard", label: "Dasbor Audit", icon: LayoutDashboard },
              { href: "/audit/trail", label: "Audit Trail Perubahan", icon: FileCheck },
              { href: "/audit/log", label: "Log Aktivitas Login", icon: Fingerprint },
              { href: "/audit/laporan", label: "Laporan Audit", icon: Download },
            ],
          },
        ];

      case "pegawai":
      default:
        return [
          {
            title: "Portal Pegawai",
            items: [
              { href: "/dashboard", label: "Dasbor Saya", icon: LayoutDashboard },
              { href: "/pegawai/profil", label: "Profil Pegawai", icon: User },
              { href: "/pegawai/cuti", label: "Cuti & Izin", icon: Calendar },
              { href: "/pegawai/kepangkatan", label: "Kepangkatan & KGB", icon: Award },
              { href: "/pegawai/dokumen", label: "Dokumen Digital", icon: FileText },
              { href: "/pegawai/qr", label: "Kartu Identitas QR", icon: QrCode },
              { href: "/pegawai/absensi", label: "Riwayat Presensi", icon: Clock },
            ],
          },
          {
            title: "Pengembangan & Karir",
            items: [
              { href: "/pegawai/diklat", label: "Diklat & Pelatihan", icon: GraduationCap },
              { href: "/pegawai/kinerja", label: "Penilaian SKP", icon: Target },
              { href: "/pegawai/disiplin", label: "Riwayat Disiplin", icon: AlertTriangle },
              { href: "/pegawai/pensiun", label: "Persiapan Pensiun", icon: HeartHandshake },
            ],
          },
          {
            title: "Akun",
            items: [
              { href: "/pegawai/notifikasi", label: "Notifikasi", icon: Bell },
              { href: "/pegawai/pengaturan", label: "Pengaturan Akun", icon: Settings },
            ],
          },
        ];
    }
  };

  const sections = getNavSections();

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border bg-card text-card-foreground select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-border/80">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground flex items-center gap-1">
              SIMPEG Daerah
            </span>
            <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">
              Kab. Nusantara Jaya
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List with Scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {section.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/admin/dashboard" &&
                    item.href !== "/atasan/dashboard" &&
                    item.href !== "/kepala-pd/dashboard" &&
                    item.href !== "/eksekutif/dashboard" &&
                    item.href !== "/audit/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-border">
        <div className="rounded-xl bg-secondary/50 p-3 border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
              Layanan ASN
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
            SIMPEG Daerah v1.0.0 Real-time Self-service.
          </p>
        </div>
      </div>
    </aside>
  );
}
