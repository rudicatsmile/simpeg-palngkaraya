"use client";

import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function KebijakanPrivasiPage() {
  const { settings } = useAppSettings();
  const namaPemda = settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah";
  const namaBkd = settings.nama_bkd || "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)";

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Kepatuhan UU No. 27 Tahun 2022 (UU PDP)</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Kebijakan Privasi & Perlindungan Data Pribadi
          </h1>
          <p className="text-sm text-muted-foreground">
            Terakhir diperbarui: 15 Januari 2025 • Berlaku untuk seluruh pengguna aplikasi SIMPEG Daerah.
          </p>
        </div>

        {/* Ringkasan Komitmen */}
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            Prinsip Pemrosesan Data Pribadi
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {namaPemda} melalui {namaBkd} berkomitmen melindungi seluruh data pribadi Aparatur Sipil Negara
            (PNS dan PPPK). Pemrosesan data dilakukan berdasarkan prinsip tujuan yang jelas,
            minimisasi data, pembatasan akses, dan akuntabilitas keamanan sistem.
          </p>
        </Card>


        {/* Konten Regulasi */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              1. Jenis Data Pribadi yang Dikelola
            </h3>
            <p>
              Data yang dikumpulkan semata-mata untuk kepentingan tata kelola kepegawaian negara mencakup:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Data Induk:</strong> Nama lengkap dengan gelar, NIP 18 digit, tanggal dan tempat lahir, jenis kelamin, serta status kepegawaian.</li>
              <li><strong>Data Sensitif Terproteksi:</strong> Nomor Induk Kependudukan (NIK) yang disimpan dalam bentuk terenkripsi dan ditampilkan secara tersamar (contoh: <code>3201********0001</code>).</li>
              <li><strong>Data Karir & Riwayat:</strong> Golongan, pangkat, riwayat jabatan, riwayat pendidikan, riwayat diklat, dan rekam jejak penilaian kinerja (SKP).</li>
              <li><strong>Data Kehadiran & Kontak:</strong> Jam masuk/pulang presensi, koordinat atau ID perangkat fingerprint, nomor ponsel/WhatsApp, dan alamat surel resmi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              2. Tujuan Pemrosesan Data
            </h3>
            <p>Data kepegawaian diproses semata-mata untuk:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Penetapan hak berkala kenaikan pangkat dan kenaikan gaji berkala secara tepat waktu.</li>
              <li>Pemrosesan cuti, izin dinas, rotasi, mutasi, dan perencanaan suksesi jabatan.</li>
              <li>Evaluasi kinerja aparatur dan pemenuhan standar kompetensi nasional.</li>
              <li>Pelaporan statistik agregat kepada pimpinan daerah dan Badan Kepegawaian Negara (BKN).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              3. Mekanisme Keamanan Teknis (Row Level Security & Signed URL)
            </h3>
            <p>
              Setiap tabel database menerapkan <strong>Row Level Security (RLS)</strong> di tingkat PostgreSQL,
              sehingga pegawai hanya memiliki izin membaca dan mengubah data miliknya sendiri. Dokumen digital
              disimpan pada bucket privat dan hanya dapat diunduh melalui tautan bertanda tangan digital
              (signed URL) dengan masa aktif maksimal 300 detik.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              4. Jejak Audit & Hak Pemilik Data
            </h3>
            <p>
              Sesuai amanat UU PDP, setiap pegawai berhak:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Mengakses data pribadi lengkap miliknya melalui portal mandiri kapan saja.</li>
              <li>Mengajukan koreksi atau pembaharuan data melalui fitur update mandiri.</li>
              <li>Mengetahui riwayat perubahan data melalui pencatatan jejak audit (Audit Trail) yang transparan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              5. Pejabat Perlindungan Data (Data Protection Officer)
            </h3>
            <p>
              Untuk pertanyaan, permohonan hak pemilik data, atau pengaduan insiden keamanan data,
              Anda dapat menghubungi Unit Kepatuhan Data BKPSDM melalui email: <code>{settings.email_sekretariat || "bkpsdm@palangkaraya.go.id"}</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
