import {
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Users,
  Building2,
  Sparkles,
  QrCode,
  GraduationCap,
  Layers,
  HeartHandshake,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Fitur Unggulan | SIMPEG Daerah",
  description: "Daftar modul fungsional lengkap SIMPEG Daerah dari kepangkatan H-180 hingga perencanaan formasi dan suksesi.",
};


export default function FiturPage() {
  const modules = [
    {
      title: "Prediksi Kepangkatan & Early Warning Bertingkat",
      badge: "Inovasi Unggulan",
      icon: Award,
      desc: "Menghitung TMT kenaikan pangkat berikutnya secara otomatis berdasarkan masa kerja golongan. Mengirim notifikasi H-180, H-90, dan H-30 melalui In-app, Email, dan WhatsApp agar syarat berkas tidak terlambat.",
      points: [
        "Checklist syarat digital (SKP 2 tahun, bebas disiplin, berkas SK)",
        "Workflow persetujuan berjenjang Operator - Kepala PD - BKPSDM",
        "Penandaan status tertunda otomatis jika terkena disiplin aktif",
      ],
    },
    {
      title: "Portal Self-Service Pegawai ASN",
      badge: "Layanan Mandiri",
      icon: Users,
      desc: "Akses data pribadi, riwayat golongan, dokumen kepegawaian, pengajuan cuti, serta pencetakan kartu identitas digital dengan QR Code verifikasi kapan saja tanpa harus antre di kantor dinas.",
      points: [
        "Perubahan data mandiri dengan persetujuan atasan langsung",
        "Penyimpanan berkas digital di Supabase Storage aman",
        "Unduh kartu ASN digital berbasis QR Code dinamis",
      ],
    },
    {
      title: "Manajemen Cuti & Kalkulator Hari Kerja",
      badge: "Paperless",
      icon: Calendar,
      desc: "Pengajuan cuti tahunan, sakit, melahirkan, dan alasan penting dengan kalkulasi hari kerja otomatis (mengecualikan akhir pekan & hari libur nasional) serta pemotongan saldo real-time.",
      points: [
        "Sisa cuti tampil transparan secara real-time",
        "Pencegahan pengajuan tumpang tindih (overlap validation)",
        "Alur persetujuan berjenjang Atasan Langsung lalu Kepala Perangkat Daerah",
      ],
    },
    {
      title: "Penilaian Kinerja (SKP) Digital",
      badge: "Sesuai PermenPANRB",
      icon: TrendingUp,
      desc: "Penetapan target kuantitas, kualitas, waktu, dan biaya di awal periode, disusul pemantauan realisasi bulanan dan evaluasi akhir atasan dengan konversi nilai predikat kerja.",
      points: [
        "Validasi bobot target wajib 100% sebelum penetapan",
        "Predikat kinerja otomatis: Sangat Baik, Baik, Cukup, Kurang",
        "Pencatatan rekam jejak untuk syarat kenaikan pangkat & promosi",
      ],
    },
    {
      title: "Presensi Real-time & Ingest API",
      badge: "Terintegrasi Perangkat",
      icon: Clock,
      desc: "Penerimaan log absensi dari mesin fingerprint atau aplikasi presensi melalui endpoint REST API terproteksi HMAC signature, lengkap dengan deteksi keterlambatan.",
      points: [
        "Ambang batas keterlambatan terkonfigurasi (default 07.30 WIB)",
        "Sinkronisasi otomatis dengan status cuti dan dinas luar",
        "Rekap kehadiran bulanan akurat untuk bahan evaluasi",
      ],
    },
    {
      title: "Pengembangan Kompetensi & Katalog Diklat",
      badge: "Pengembangan Karir",
      icon: GraduationCap,
      desc: "Analisis kesenjangan (gap) kompetensi antara standar jabatan dan profil pegawai. Memberikan rekomendasi pelatihan dan pencatatan sertifikat digital.",
      points: [
        "Katalog pelatihan terintegrasi jam pelajaran (JP)",
        "Peningkatan level kompetensi otomatis setelah sertifikat disetujui",
        "Usulan diklat mandiri maupun rekomendasi atasan",
      ],
    },
    {
      title: "Purna Tugas & Countdown Pensiun",
      badge: "Perencanaan SDM",
      icon: HeartHandshake,
      desc: "Prediksi tanggal pensiun tepat pada tanggal 1 bulan berikutnya setelah batas usia pensiun tercapai (BUP 58 / 60 tahun). Notifikasi checklist berkas H-365, H-180, dan H-30.",
      points: [
        "Checklist kelengkapan berkas pensiun tanpa kertas",
        "Integrasi otomatis dengan proyeksi penggantian suksesi formasi",
        "Dashboard eksekutif proyeksi pensiun tahunan per PD",
      ],
    },
    {
      title: "Analisis Formasi & Talent Pool",
      badge: "Manajemen Talenta",
      icon: Layers,
      desc: "Pemetaan kebutuhan vs ketersediaan pegawai per jabatan di seluruh perangkat daerah, serta identifikasi kader suksesi siap pakai untuk posisi strategis.",
      points: [
        "Tingkat kesiapan talenta: Siap Sekarang, Siap 1-2 Tahun, Siap 3-5 Tahun",
        "Validasi formasi otomatis saat permohonan mutasi atau promosi",
        "Pencegahan penempatan pegawai pada jabatan dengan formasi nihil",
      ],
    },
    {
      title: "Jejak Audit Trail & Log Keamanan",
      badge: "Kepatuhan UU PDP",
      icon: ShieldCheck,
      desc: "Tabel jejak audit berprinsip append-only yang merekam setiap modifikasi data (nilai sebelum dan sesudah), IP address aktor, dan riwayat otentikasi login.",
      points: [
        "Penyamaran NIK untuk menjaga kerahasiaan data pribadi",
        "Proteksi Row Level Security (RLS) pada seluruh tabel database",
        "Akses pengawasan khusus inspektorat / auditor daerah",
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Katalog Lengkap Fitur</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            Fitur Unggulan SIMPEG Daerah
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Seluruh fungsionalitas dirancang untuk meningkatkan kepuasan aparatur, menjamin
            ketepatan waktu hak kepegawaian, dan mempermudah pengawasan pimpinan.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Card key={i} interactive className="flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {mod.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-foreground leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[11px] font-semibold text-foreground mb-2">
                      Keunggulan Modul:
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                      {mod.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
