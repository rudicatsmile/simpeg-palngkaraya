import Link from "next/link";
import {
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  BellRing,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeHero } from "@/components/home/HomeHero";

export const metadata = {
  title: "Beranda | SIMPEG Daerah",
  description:
    "Sistem Informasi Manajemen Kepegawaian terpadu dengan sistem peringatan dini H-180 kepangkatan dan portal mandiri ASN.",
};

export default function HomePage() {
  const stats = [
    { label: "Pegawai ASN Aktif", value: "4.820", sub: "PNS & PPPK Daerah" },
    { label: "Perangkat Daerah", value: "34", sub: "Dinas, Badan, & Sekretariat" },
    { label: "Kenaikan Pangkat Tepat Waktu", value: "98.4%", sub: "Peningkatan dari 64%" },
    { label: "Adopsi Self-Service", value: "89.2%", sub: "Layanan paperless digital" },
  ];

  const features = [
    {
      icon: BellRing,
      title: "Peringatan Dini Kenaikan Pangkat",
      desc: "Notifikasi berjenjang otomatis pada H-180, H-90, dan H-30 melalui Email, In-app, dan WhatsApp sebelum TMT tiba.",
      tag: "Proaktif H-180",
    },
    {
      icon: Calendar,
      title: "Pengajuan Cuti Mandiri Real-time",
      desc: "Kalkulasi otomatis hari kerja dengan kalender libur nasional. Persetujuan berjenjang Atasan Langsung dan Kepala PD.",
      tag: "Self-Service",
    },
    {
      icon: QrCode,
      title: "Kartu Identitas Digital & Validasi QR",
      desc: "Kartu identitas ASN dinamis dengan verifikasi keabsahan instan untuk masyarakat dan instansi tanpa membuka data sensitif.",
      tag: "Keamanan ASN",
    },
    {
      icon: TrendingUp,
      title: "Evaluasi Kinerja SKP Terpadu",
      desc: "Penetapan target kuantitas, kualitas, waktu, serta penilaian otomatis predikat kerja Sangat Baik hingga Kurang.",
      tag: "Kinerja ASN",
    },
    {
      icon: Clock,
      title: "Presensi Terintegrasi & Ingest API",
      desc: "Rekap absensi harian dan bulanan dengan verifikasi HMAC dari perangkat fingerprint atau aplikasi presensi lapangan.",
      tag: "Multi-device",
    },
    {
      icon: ShieldCheck,
      title: "Jejak Audit & Kepatuhan UU PDP",
      desc: "Setiap aksi tercatat lengkap (before/after), NIK tersamar, dan seluruh tabel terlindungi Row Level Security Supabase.",
      tag: "Audit Trail",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Hero Section */}
      <HomeHero />


      {/* Statistik Section */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((st, i) => (
              <div key={i} className="text-center sm:text-left border-l-2 border-primary/40 pl-4 space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold font-heading text-primary tabular-nums">
                  {st.value}
                </p>
                <p className="text-xs font-bold text-foreground">{st.label}</p>
                <p className="text-[11px] text-muted-foreground">{st.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Inti Section */}
      <section className="py-20 lg:py-28 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Modul Terintegrasi
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
              Semua Kebutuhan Kepegawaian dalam Satu Platform
            </h2>
            <p className="text-sm text-muted-foreground">
              Dirancang khusus untuk memangkas birokrasi, menghilangkan keterlambatan berkas fisik,
              dan memberikan visibilitas penuh bagi pimpinan daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} interactive className="group flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-[10px] font-semibold">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/fitur">
              <Button size="lg" variant="outline" className="gap-2 font-semibold">
                Lihat Seluruh Fitur Detail
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Akhir */}
      <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold">
            Mulai Pengelolaan ASN yang Efisien & Modern Hari Ini
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-2xl mx-auto">
            Akses portal mandiri Anda sekarang dengan email resmi instansi atau hubungi operator
            kepegawaian di Badan Kepegawaian dan Pengembangan SDM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="font-bold text-primary">
                Masuk ke SIMPEG
              </Button>
            </Link>
            <Link href="/panduan">
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                Panduan Penggunaan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
