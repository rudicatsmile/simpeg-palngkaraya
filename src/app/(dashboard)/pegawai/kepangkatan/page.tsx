"use client";

import { usePegawaiList, useUsulanPangkatList, useRiwayatPangkatList } from "@/services";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function KepangkatanPegawaiPage() {
  const { data: pegawaiList } = usePegawaiList();
  const { data: usulanList } = useUsulanPangkatList();
  const { data: riwayatList } = useRiwayatPangkatList();

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
    tmt_golongan: "2022-04-01",
  };

  const usulan = usulanList[0] || {
    golongan_tujuan: "IV/b",
    tmt_usulan: "2026-04-01",
    status: "verifikasi",
    catatan: "Berkas lengkap sesuai kriteria H-180 merit system",
  };

  const riwayatPangkat = riwayatList.length > 0 ? riwayatList.map((r) => ({
    golongan: r.golongan,
    pangkat: r.pangkat,
    tmt: r.tmt,
    no_sk: r.nomor_sk || "-",
    tgl_sk: r.tanggal_sk || "-",
  })) : [
    {
      golongan: "III/c",
      pangkat: "Penata",
      tmt: "1 April 2022",
      no_sk: "823.3/045/BKPSDM/2022",
      tgl_sk: "25 Maret 2022",
    },
    {
      golongan: "III/b",
      pangkat: "Penata Muda Tingkat I",
      tmt: "1 April 2018",
      no_sk: "823.3/089/BKPSDM/2018",
      tgl_sk: "20 Maret 2018",
    },
    {
      golongan: "III/a",
      pangkat: "Penata Muda",
      tmt: "1 Maret 2011",
      no_sk: "821.1/012/BKPSDM/2011",
      tgl_sk: "15 Februari 2011",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Kepangkatan & Kenaikan Gaji Berkala (KGB)
        </h1>
        <p className="text-xs text-muted-foreground">
          Prediksi otomatis TMT kenaikan pangkat berikutnya, checklist pemenuhan berkas, dan riwayat golongan.
        </p>
      </div>

      {/* Banner Prediksi Kenaikan Pangkat Berikutnya (Early Warning) */}
      <Card className="border-2 border-primary/40 bg-gradient-to-r from-primary/5 via-background to-secondary/30 shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5" />
                <span>Status Early Warning: H-180 Kenaikan Pangkat</span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-foreground">
                Prediksi TMT Kenaikan Pangkat: 1 April 2026
              </h2>
              <p className="text-xs text-muted-foreground">
                Menuju Golongan: <strong>Penata Tingkat I (III/d)</strong> • Jenis Usulan: <strong>Reguler</strong>
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-extrabold font-heading text-primary tabular-nums">
                180 Hari Lagi
              </p>
              <p className="text-[11px] text-muted-foreground">
                TMT Terhitung Mulai Tanggal
              </p>
            </div>
          </div>

          {/* Checklist Syarat Berkas Digital */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
              Checklist Kelengkapan Syarat Berkas Administrasi:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>SKP 2 Tahun Terakhir minimal Baik (Tercapai: 94.50 & 93.80)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Sertifikat Pelatihan Kepemimpinan Pengawas (PKP) Terverifikasi</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Bebas Hukuman Disiplin Tingkat Sedang/Berat (Aktif: Nihil)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>SK Pangkat Terakhir (III/c) Lengkap Tersimpan di Storage</span>
              </div>
            </div>
          </div>

          {/* Workflow Status Timeline */}
          <div className="pt-2 border-t border-border/80">
            <p className="text-xs font-semibold text-foreground mb-3">
              Alur Verifikasi Usulan Berjenjang:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 border border-emerald-200 dark:border-emerald-900">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">1. Operator PD</span>
                <span className="text-[11px] text-muted-foreground">Data & berkas lengkap terverifikasi</span>
              </div>
              <div className="rounded-lg bg-primary/10 p-3 border border-primary/30">
                <span className="font-bold text-primary block mb-0.5">2. Verifikasi BKPSDM</span>
                <span className="text-[11px] text-muted-foreground">Sedang ditelaah Tim Kepangkatan</span>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border">
                <span className="font-medium text-muted-foreground block mb-0.5">3. Kepala PD</span>
                <span className="text-[11px] text-muted-foreground">Menunggu persetujuan tingkat 2</span>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border">
                <span className="font-medium text-muted-foreground block mb-0.5">4. Penetapan SK</span>
                <span className="text-[11px] text-muted-foreground">Penerbitan SK Bupati / BKN</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Riwayat Kepangkatan Lengkap */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Riwayat Golongan & Kepangkatan ASN
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar seluruh Surat Keputusan (SK) kenaikan pangkat yang tercatat di database BKPSDM.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Golongan / Ruang</TableHead>
                <TableHead>Pangkat</TableHead>
                <TableHead>TMT Golongan</TableHead>
                <TableHead>Nomor Surat Keputusan (SK)</TableHead>
                <TableHead>Tanggal SK</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riwayatPangkat.map((rw, i) => (
                <TableRow key={i}>
                  <TableCell className="font-bold text-xs text-primary">{rw.golongan}</TableCell>
                  <TableCell className="font-medium text-xs text-foreground">{rw.pangkat}</TableCell>
                  <TableCell className="text-xs font-mono">{rw.tmt}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{rw.no_sk}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{rw.tgl_sk}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Unduh Salinan SK
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
