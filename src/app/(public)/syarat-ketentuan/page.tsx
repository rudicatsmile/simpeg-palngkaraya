import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Syarat & Ketentuan | SIMPEG Daerah Kabupaten Nusantara Jaya",
  description: "Ketentuan operasional dan kewajiban pengguna Sistem Informasi Manajemen Kepegawaian Daerah.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <FileText className="h-4 w-4" />
            <span>Ketentuan Penggunaan Layanan</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Syarat & Ketentuan Layanan SIMPEG Daerah
          </h1>
          <p className="text-sm text-muted-foreground">
            Berlaku bagi seluruh ASN di lingkungan Pemerintah Kabupaten Nusantara Jaya.
          </p>
        </div>

        {/* Aturan Pokok */}
        <div className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              1. Ketentuan Umum Akun & Akses
            </h3>
            <p>
              Setiap pengguna akun SIMPEG Daerah wajib merupakan Aparatur Sipil Negara (PNS/PPPK)
              atau tenaga pengelola resmi yang terdaftar di BKPSDM Kabupaten Nusantara Jaya.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Akun bersifat pribadi, tidak dapat dipindahtangankan atau digunakan secara bersama.</li>
              <li>Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi (password).</li>
              <li>Aktivitas login, kegagalan otentikasi, dan alamat IP dicatat secara otomatis pada log audit sistem.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              2. Keabsahan & Validitas Dokumen Digital
            </h3>
            <p>
              Seluruh berkas dokumen kepegawaian (SK, ijazah, sertifikat pelatihan) yang diunggah
              ke portal SIMPEG Daerah memiliki kekuatan hukum administratif internal Pemerintah Daerah.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pengguna dilarang mengunggah dokumen palsu, hasil rekayasa, atau dokumen yang tidak sah.</li>
              <li>Tindakan pemalsuan dokumen kepegawaian akan dikenai sanksi hukuman disiplin berat sesuai PP Nomor 94 Tahun 2021 serta ketentuan hukum pidana yang berlaku.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              3. Tanggung Jawab Pengajuan Layanan Mandiri
            </h3>
            <p>
              Dalam pengajuan layanan mandiri (seperti cuti, mutasi, dan perbaikan data induk):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pengajuan cuti tahunan wajib disampaikan selambat-lambatnya 3 (tiga) hari kerja sebelum tanggal mulai cuti.</li>
              <li>Cuti sakit lebih dari 2 hari kerja wajib melampirkan surat keterangan dokter yang sah.</li>
              <li>Pengajuan pembatalan cuti hanya dapat dilakukan sebelum usulan memperoleh status persetujuan penuh.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              4. Larangan Penggunaan Sistem
            </h3>
            <p>Pengguna dilarang melakukan tindakan:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Mencoba mengeksploitasi kerentanan keamanan atau memintas mekanisme otorisasi (RLS).</li>
              <li>Menggunakan skrip otomatisasi atau *bot scraping* tanpa izin tertulis dari Super Admin BKPSDM.</li>
              <li>Memasukkan data presensi fiktif atau merusak perangkat fingerprint absensi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              5. Perubahan Ketentuan
            </h3>
            <p>
              BKPSDM Kabupaten Nusantara Jaya berhak memperbarui syarat dan ketentuan ini sewaktu-waktu
              mengikuti perkembangan regulasi kepegawaian nasional dan peraturan daerah yang berlaku.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
