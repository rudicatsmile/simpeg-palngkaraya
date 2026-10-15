"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, Shield, Briefcase, HelpCircle, CheckCircle2 } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function PanduanPage() {
  const { settings } = useAppSettings();
  const namaPemda = settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah";

  const roleGuides = [
    {
      role: "Pegawai ASN",
      icon: User,
      desc: "Layanan Mandiri Kepegawaian",
      steps: [
        "Lakukan aktivasi akun menggunakan NIP 18 digit dan email resmi pada halaman /aktivasi.",
        "Periksa profil pribadi dan pastikan riwayat kepangkatan serta jabatan telah sesuai.",
        "Pantau countdown kenaikan pangkat pada menu Kepangkatan dan penuhi checklist dokumen digital.",
        "Ajukan cuti tahunan minimal 3 hari sebelum tanggal mulai agar dapat diproses tepat waktu.",
        "Perbarui target SKP tahunan dan laporkan realisasi berkala.",
      ],
    },
    {
      role: "Atasan Langsung",
      icon: Users,
      desc: "Verifikasi Usulan & Penilaian Bawahan",
      steps: [
        "Buka menu 'Antrean Persetujuan' untuk meninjau usulan cuti, izin, atau mutasi dari bawahan langsung.",
        "Berikan persetujuan atau penolakan dengan menyertakan catatan tertulis yang jelas.",
        "Lakukan evaluasi kinerja bawahan pada menu Penilaian SKP di akhir periode tahunan.",
        "Pantau rekap presensi dan deteksi keterlambatan bawahan secara harian.",
      ],
    },
    {
      role: "Kepala Perangkat Daerah",
      icon: Briefcase,
      desc: "Persetujuan Tingkat Kedua & Pengawasan PD",
      steps: [
        "Tinjau usulan yang telah disetujui Atasan Langsung pada menu 'Persetujuan Tingkat Kedua'.",
        "Pantau peta sebaran pegawai, distribusi golongan, dan kebutuhan formasi jabatan dinas.",
        "Periksa daftar pegawai yang akan memasuki batas usia pensiun dalam kurun waktu 12 bulan.",
      ],
    },
    {
      role: "Operator & Super Admin",
      icon: Shield,
      desc: "Pengelolaan Data Induk & Pengaturan Sistem",
      steps: [
        "Tambah atau impor pegawai baru dari file CSV serta kirim tautan aktivasi akun resmi.",
        "Kelola berkas digital, checklist usulan kenaikan pangkat, dan usulan mutasi antar dinas.",
        "Konfigurasi aturan bisnis seperti masa kerja kenaikan pangkat, toleransi jam keterlambatan, dan jatah cuti tahunan.",
        "Atur hak akses pengguna dan lingkup perangkat daerah pada menu Manajemen Pengguna.",
      ],
    },
  ];

  const faqs = [
    {
      q: "Bagaimana jika saya belum menerima email aktivasi akun?",
      a: "Pastikan Anda menggunakan email resmi yang terdaftar pada BKPSDM. Jika belum menerima tautan atau kode aktivasi, silakan hubungi Operator Kepegawaian di instansi Anda atau datang ke loket bantuan BKPSDM.",
    },
    {
      q: "Mengapa usulan kenaikan pangkat saya berstatus 'Tertunda'?",
      a: "Sistem otomatis menunda usulan kenaikan pangkat jika pegawai sedang menjalani hukuman disiplin aktif tingkat sedang atau berat, atau dokumen wajib (seperti SKP 2 tahun terakhir dengan predikat minimal Baik) belum terpenuhi.",
    },
    {
      q: "Apakah hari Sabtu dan Minggu mengurangi saldo cuti tahunan?",
      a: "Tidak. SIMPEG Daerah menerapkan perhitungan hari kerja murni. Hari Sabtu, Minggu, serta hari libur nasional dan cuti bersama yang ditetapkan pemerintah otomatis dikecualikan dari pemotongan kuota cuti tahunan.",
    },
    {
      q: "Berapa lama batas waktu penyelesaian persetujuan cuti?",
      a: "Atasan Langsung dan Kepala Perangkat Daerah diharapkan memberikan persetujuan maksimal dalam 2 hari kerja sejak permohonan diajukan oleh pegawai agar tidak mengganggu operasional layanan.",
    },
    {
      q: "Bagaimana cara memverifikasi keabsahan kartu identitas ASN?",
      a: "Masyarakat atau instansi lain dapat memindai QR Code pada kartu identitas fisik maupun digital pegawai. Tautan akan mengarah ke halaman verifikasi resmi /verifikasi/[token] yang menampilkan status aktif kepegawaian tanpa membocorkan data sensitif.",
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="h-4 w-4" />
            <span>Pusat Bantuan & Petunjuk Operasional</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            Panduan Pengguna SIMPEG Daerah
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Ikuti petunjuk langkah demi langkah sesuai peran Anda di lingkungan {namaPemda}.
          </p>

        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roleGuides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <Card key={idx} className="p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-border/80 pb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {guide.role}
                    </h3>
                    <p className="text-xs text-muted-foreground">{guide.desc}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {guide.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Jawaban seputar aktivasi, alur persetujuan, dan kebijakan kepegawaian digital.
            </p>
          </div>

          <Accordion className="border border-border">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} defaultOpen={i === 0}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
