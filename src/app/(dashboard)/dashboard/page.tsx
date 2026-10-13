"use client";

import Link from "next/link";
import { useState } from "react";
import { usePegawaiList, useCutiList, useUsulanPangkatList, useNotifikasiList } from "@/services";
import {
  Award,
  Calendar,
  Clock,
  FileText,
  QrCode,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Plus,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PegawaiDashboardPage() {
  const { data: pegawaiList } = usePegawaiList();
  const { data: cutiList } = useCutiList();
  const { data: pangkatList } = useUsulanPangkatList();
  const { data: notifList } = useNotifikasiList();

  const pegawai = pegawaiList[0] || {
    id: "e1a1b1c1-0001-4000-8000-000000000001",
    nama_lengkap: "Budi Santoso",
    gelar_depan: "Dr.",
    gelar_belakang: "M.Si.",
    nip: "197805122002121003",
    pangkat: "Pembina",
    golongan: "IV/a",
    jabatan_nama: "Kepala Bidang Mutasi dan Kepangkatan",
    pd_nama: "Badan Kepegawaian dan Pengembangan SDM (BKPSDM)",
  };
  const cutiAktif = cutiList.filter((c) => c.pegawai_id === pegawai.id);
  const pangkatTerbaru = pangkatList.find((p) => p.pegawai_id === pegawai.id);

  // Countdown ke 1 April 2026
  const targetDate = new Date("2026-04-01").getTime();
  const now = new Date("2025-10-01").getTime(); // Simulasi titik waktu PRD H-180
  const daysRemaining = Math.max(0, Math.floor((targetDate - now) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Banner Sambutan Pegawai */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-indigo-800 p-6 sm:p-8 text-primary-foreground shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <Building2 className="h-3.5 w-3.5" />
              <span>{pegawai.pd_nama}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {pegawai.gelar_depan} {pegawai.nama_lengkap}, {pegawai.gelar_belakang}
            </h1>
            <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-2xl">
              NIP: {pegawai.nip} • {pegawai.pangkat} ({pegawai.golongan}) • {pegawai.jabatan_nama}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link href="/pegawai/cuti/baru">
              <Button variant="secondary" size="sm" className="font-bold text-primary gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                Ajukan Cuti
              </Button>
            </Link>
            <Link href="/pegawai/qr">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/25 text-white hover:bg-white/20 gap-1.5"
              >
                <QrCode className="h-4 w-4" />
                ID Digital
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Kartu KPI Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Early Warning Kenaikan Pangkat */}
        <Card interactive className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Kenaikan Pangkat</span>
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                <Award className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold font-heading text-foreground tabular-nums">
                {daysRemaining} Hari
              </p>
              <p className="text-[11px] text-muted-foreground">
                TMT Prediksi: 1 April 2026 (Gol. III/d)
              </p>
            </div>
            <div className="pt-2">
              <Link href="/pegawai/kepangkatan" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Cek Syarat Berkas →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sisa Cuti */}
        <Card interactive className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Sisa Cuti Tahunan</span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 p-2 text-emerald-600">
                <Calendar className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold font-heading text-foreground tabular-nums">
                9 Hari Kerja
              </p>
              <p className="text-[11px] text-muted-foreground">
                Jatah 12 Hari • Terpakai 3 Hari
              </p>
            </div>
            <div className="pt-2">
              <Link href="/pegawai/cuti" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                Kelola Cuti Saya →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Nilai SKP Kinerja */}
        <Card interactive className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Kinerja SKP 2024</span>
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 p-2 text-indigo-600">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold font-heading text-indigo-600 tabular-nums">
                94.50
              </p>
              <p className="text-[11px] text-muted-foreground">
                Predikat: <strong>Sangat Baik</strong>
              </p>
            </div>
            <div className="pt-2">
              <Link href="/pegawai/kinerja" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                Lihat Detail Target →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Pensiun */}
        <Card interactive className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Persiapan Pensiun</span>
              <span className="rounded-full bg-amber-100 dark:bg-amber-950 p-2 text-amber-600">
                <Hourglass className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold font-heading text-foreground tabular-nums">
                17 Tahun
              </p>
              <p className="text-[11px] text-muted-foreground">
                BUP: 1 Juli 2043 (Usia 58 Thn)
              </p>
            </div>
            <div className="pt-2">
              <Link href="/pegawai/pensiun" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
                Panduan Purna Tugas →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Bagian Tengah: Early Warning Proaktif & Status Usulan Aktif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Notifikasi Proaktif Early Warning Kenaikan Pangkat H-180 */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-primary/30">
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Peringatan Dini Kenaikan Pangkat (H-180)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sistem mendeteksi masa kerja golongan Anda akan genap 4 tahun pada periode April 2026.
                  </CardDescription>
                </div>
                <Badge variant="diajukan">Dalam Proses</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-xl bg-secondary/60 p-4 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Progres Kelengkapan Syarat:</span>
                  <span className="font-bold text-primary tabular-nums">100% Siap</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full w-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>SKP 2 Thn Sangat Baik</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Diklat PKP Terpenuhi</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Bebas Hukuman Disiplin</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>SK Gol. Terakhir Terunggah</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Status Usulan: <strong>Verifikasi Operator BKPSDM</strong>
                </span>
                <Link href="/pegawai/kepangkatan">
                  <Button size="sm" className="font-semibold text-xs">
                    Lihat Timeline Usulan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Usulan Aktif Cuti */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Pengajuan Cuti Terakhir</CardTitle>
                  <CardDescription className="text-xs">
                    Pantau status verifikasi dari Atasan Langsung dan Kepala PD.
                  </CardDescription>
                </div>
                <Link href="/pegawai/cuti">
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {cutiAktif.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground capitalize">
                          Cuti {c.jenis} ({c.jumlah_hari} Hari Kerja)
                        </span>
                        <Badge
                          variant={
                            c.status === "disetujui_kepala_pd"
                              ? "disetujui"
                              : c.status === "diajukan"
                              ? "diajukan"
                              : "menunggu"
                          }
                        >
                          {c.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {c.tanggal_mulai} s.d. {c.tanggal_selesai} • {c.alasan}
                      </p>
                    </div>
                    <Link href="/pegawai/cuti">
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        Rincian
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Notifikasi Terkini & Aksi Cepat */}
        <div className="lg:col-span-5 space-y-6">
          {/* Lonceng Pemberitahuan Penting */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Pemberitahuan Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {(notifList || []).map((item) => (
                  <div key={item.id} className="p-4 space-y-1 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-[10px]">
                        {item.kategori}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">Baru saja</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{item.judul}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {item.pesan}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Kartu Akses Cepat */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base">Layanan Cepat Mandiri</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/pegawai/profil"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 text-center space-y-2 transition-all"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Update Profil</span>
              </Link>

              <Link
                href="/pegawai/absensi"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 text-center space-y-2 transition-all"
              >
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Rekap Presensi</span>
              </Link>

              <Link
                href="/pegawai/dokumen"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 text-center space-y-2 transition-all"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Dokumen SK</span>
              </Link>

              <Link
                href="/pegawai/qr"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 text-center space-y-2 transition-all"
              >
                <QrCode className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Cetak Kartu QR</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
