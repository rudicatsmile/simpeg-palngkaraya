"use client";

import { usePegawaiList } from "@/services";
import { HeartHandshake, Hourglass, CheckCircle2, FileText, Download, HelpCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PensiunPegawaiPage() {
  const { data: pegawaiList, loading: isLoading } = usePegawaiList();
  const pegawai = pegawaiList[0];

  const birthDate = pegawai?.tanggal_lahir ? new Date(pegawai.tanggal_lahir) : new Date(1985, 5, 12);
  const birthYear = birthDate.getFullYear();
  const bupAge = 58;
  const pensionYear = birthYear + bupAge;
  const currentYear = new Date().getFullYear();
  const remainingYears = Math.max(0, pensionYear - currentYear);

  const checklistPensiun = [
    { item: "Salinan Sah SK CPNS & SK PNS", status: "lengkap" },
    { item: "Salinan Sah SK Kenaikan Pangkat Terakhir", status: "lengkap" },
    { item: "Salinan Sah SK Jabatan Terakhir", status: "lengkap" },
    { item: "Penilaian Prestasi Kerja (SKP) 2 Tahun Terakhir", status: "lengkap" },
    { item: "Surat Keterangan Bebas Temuan Inspektorat", status: "proses" },
    { item: "Surat Keterangan Bebas Pinjaman / Bebas Hutang Bank Daerah", status: "belum" },
    { item: "Pasfoto Formal Pensiun Latar Merah (Ukuran 3x4)", status: "belum" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Persiapan Purna Tugas (Pensiun)
        </h1>
        <p className="text-xs text-muted-foreground">
          Hitung mundur Batas Usia Pensiun (BUP), checklist berkas pensiun, dan layanan Taspen.
        </p>
      </div>

      {/* Banner Countdown BUP */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-background to-orange-500/5">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Hourglass className="h-3.5 w-3.5" />
                <span>Batas Usia Pensiun (BUP {bupAge} Tahun)</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Tanggal Pensiun Diproyeksikan: 1 Juli {pensionYear}
              </h2>
              <p className="text-xs text-muted-foreground">
                Dihitung pada tanggal 1 bulan berikutnya setelah tanggal lahir{" "}
                {birthDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} ({pegawai?.nama_lengkap || "Pegawai"}).
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-extrabold font-heading text-amber-600 tabular-nums">
                ~{remainingYears} Tahun Lagi
              </p>
              <p className="text-[11px] text-muted-foreground">Masa Pengabdian ASN Berjalan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Berkas Pensiun */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Checklist Persyaratan Berkas Pensiun Digital
              </CardTitle>
              <CardDescription className="text-xs">
                Dokumen wajib yang diverifikasi BKPSDM dan BKN menjelang masa purna tugas.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Checklist formulir Taspen dibuka.")}
              className="text-xs"
            >
              Unduh Format Berkas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {checklistPensiun.map((chk, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      chk.status === "lengkap"
                        ? "bg-emerald-100 text-emerald-700"
                        : chk.status === "proses"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{chk.item}</span>
                </div>
                <Badge
                  variant={
                    chk.status === "lengkap"
                      ? "disetujui"
                      : chk.status === "proses"
                      ? "warning"
                      : "draf"
                  }
                >
                  {chk.status === "lengkap"
                    ? "Lengkap di Storage"
                    : chk.status === "proses"
                    ? "Dalam Pengurusan"
                    : "Belum Diunggah"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
