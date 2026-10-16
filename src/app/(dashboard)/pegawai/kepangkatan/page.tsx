"use client";

import { usePegawaiList, useUsulanPangkatList, useRiwayatPangkatList, useAturanKepangkatanList } from "@/services";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  hitungPrediksiKenaikanPangkat,
  getNextGolongan,
  DAFTAR_GOLONGAN_PANGKAT,
  formatTanggalIndo,
} from "@/lib/kepangkatan-engine";
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
  FileText,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function KepangkatanPegawaiPage() {
  const { settings } = useAppSettings();
  const { data: pegawaiList } = usePegawaiList();
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

  const { data: usulanList } = useUsulanPangkatList(pegawai.id);
  const { data: riwayatList, loading: loadingRiwayat } = useRiwayatPangkatList(pegawai.id);
  const { data: aturanList } = useAturanKepangkatanList();

  const usulan = usulanList[0] || {
    golongan_tujuan: "IV/b",
    tmt_usulan: "2026-04-01",
    status: "verifikasi",
    catatan: "Berkas lengkap sesuai kriteria H-180 merit system",
  };

  // Riwayat pangkat murni dari database Supabase dengan tanggal terformat rapi
  const riwayatPangkat = riwayatList.map((r) => ({
    id: r.id,
    golongan: r.golongan,
    pangkat: r.pangkat,
    tmt: formatTanggalIndo(r.tmt),
    no_sk: r.nomor_sk || "-",
    tgl_sk: r.tanggal_sk ? formatTanggalIndo(r.tanggal_sk) : "-",
  }));

  // Kalkulasi mesin prediksi kepangkatan berdasarkan TMT golongan pegawai
  const prediksi = hitungPrediksiKenaikanPangkat(pegawai.tmt_golongan || "2022-04-01");

  // Penentuan golongan dan pangkat tujuan
  const targetGolongan = usulan?.golongan_tujuan || getNextGolongan(pegawai.golongan || "IV/a");
  const targetPangkat = DAFTAR_GOLONGAN_PANGKAT[targetGolongan] || "Pangkat Tujuan";
  const targetPangkatDanGolongan = `${targetPangkat} (${targetGolongan})`;

  // Penentuan jenis usulan (Reguler, Pilihan, atau KGB)
  const jenisUsulanLabel = usulan?.jenis
    ? usulan.jenis.charAt(0).toUpperCase() + usulan.jenis.slice(1)
    : "Reguler";

  // Tanggal TMT prediksi resmi format Indonesia
  const tmtPrediksiStr = usulan?.tmt_usulan || prediksi.tmtPrediksi;
  const tmtPrediksiFormatted = formatTanggalIndo(tmtPrediksiStr);

  // Template badge early warning dari app_settings
  const earlyWarningTemplate =
    settings.label_early_warning_kp || "Status Early Warning: {fase} Kenaikan Pangkat";
  const badgeEarlyWarningText = earlyWarningTemplate.replace("{fase}", prediksi.faseNotifikasi);

  // Template judul prediksi TMT dari app_settings
  const titlePrediksiTemplate =
    settings.template_prediksi_tmt || "Prediksi TMT Kenaikan Pangkat: {tmt}";
  const titlePrediksiText = titlePrediksiTemplate.replace("{tmt}", tmtPrediksiFormatted);

  // Template countdown sisa hari dari app_settings
  const countdownTemplate = settings.label_countdown_kp || "{hari} Hari Lagi";
  let countdownText = "";
  if (prediksi.sisaHari < 0) {
    countdownText = `Terlewat ${Math.abs(prediksi.sisaHari)} Hari`;
  } else if (prediksi.sisaHari === 0) {
    countdownText = "Hari Ini";
  } else {
    countdownText = countdownTemplate.replace("{hari}", String(prediksi.sisaHari));
  }

  // Label subteks dari app_settings
  const labelMenujuGolongan = settings.label_menuju_golongan || "Menuju Golongan";
  const labelJenisUsulan = settings.label_jenis_usulan || "Jenis Usulan";
  const labelSubteksTmt = settings.label_subteks_tmt || "TMT Terhitung Mulai Tanggal";
  const labelJudulChecklist =
    settings.label_judul_checklist_kp || "Checklist Kelengkapan Syarat Berkas Administrasi:";

  // Ambil checklist syarat dinamis dari tabel aturan_kepangkatan berdasarkan golongan pegawai
  const aturanAktif = aturanList.find(
    (a) =>
      (a.golongan_dari === pegawai.golongan && a.golongan_ke === targetGolongan) ||
      a.golongan_dari === pegawai.golongan ||
      a.golongan_ke === targetGolongan
  );

  const fallbackChecklist = [
    `SK Pangkat Terakhir (${pegawai.golongan || "IV/a"}) Lengkap Tersimpan di Storage`,
    "Penilaian Kinerja (SKP) 2 Tahun Terakhir minimal Baik",
    "Sertifikat Pelatihan Kepemimpinan Pengawas (PKP) Terverifikasi",
    "Surat Keterangan Bebas Hukuman Disiplin Tingkat Sedang/Berat (Aktif: Nihil)",
  ];

  const itemsChecklist = (aturanAktif?.checklist && aturanAktif.checklist.length > 0)
    ? aturanAktif.checklist
    : fallbackChecklist;

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
                <span>{badgeEarlyWarningText}</span>
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-foreground">
                {titlePrediksiText}
              </h2>
              <p className="text-xs text-muted-foreground">
                {labelMenujuGolongan}: <strong>{targetPangkatDanGolongan}</strong> • {labelJenisUsulan}: <strong>{jenisUsulanLabel}</strong>
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-extrabold font-heading text-primary tabular-nums">
                {countdownText}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {labelSubteksTmt}
              </p>
            </div>
          </div>

          {/* Checklist Syarat Berkas Digital */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
              {labelJudulChecklist}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {itemsChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
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
              {loadingRiwayat ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat riwayat kenaikan pangkat dari database...
                  </TableCell>
                </TableRow>
              ) : riwayatPangkat.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">Belum Ada Riwayat Kenaikan Pangkat</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Surat Keputusan (SK) kenaikan pangkat resmi yang tercatat di database akan otomatis tampil di sini.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                riwayatPangkat.map((rw, i) => (
                  <TableRow key={rw.id || i}>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
