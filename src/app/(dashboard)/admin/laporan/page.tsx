"use client";

import { useState } from "react";
import { usePerangkatDaerahList } from "@/services";
import { Download, FileText, Filter, CheckCircle2, FileSpreadsheet, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GeneratorLaporanPage() {
  const [jenisLaporan, setJenisLaporan] = useState("kepegawaian");
  const [pdFilter, setPdFilter] = useState("all");
  const [tahun, setTahun] = useState("2026");
  const [loading, setLoading] = useState(false);

  const { data: pdList, loading: loadingPd } = usePerangkatDaerahList();

  const handleEksporCsv = () => {
    setLoading(true);
    // Download via official API route from Supabase
    const url = `/api/v1/laporan/export?jenis=${encodeURIComponent(jenisLaporan)}&pd_id=${encodeURIComponent(pdFilter)}&tahun=${encodeURIComponent(tahun)}`;
    
    // Trigger direct download
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_${jenisLaporan.toUpperCase()}_${tahun}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setLoading(false);
      toast.success("Ekspor CSV Berhasil!", {
        description: `Berkas 'Laporan_${jenisLaporan.toUpperCase()}_${tahun}.csv' diunduh langsung dari database Supabase.`,
      });
    }, 500);
  };

  const handleEksporPdf = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Fitur Ekspor PDF Resmi", {
        description: `Dokumen resmi PDF 'Laporan_${jenisLaporan.toUpperCase()}_${tahun}.pdf' sedang diproses via Print Generator.`,
      });
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Pusat Generator Laporan & Statistik Daerah
        </h1>
        <p className="text-xs text-muted-foreground">
          Ekspor komprehensif data kepegawaian, kepangkatan, kehadiran, kinerja, dan pensiun langsung dari pangkalan data Supabase.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Parameter Pembuatan Laporan
          </CardTitle>
          <CardDescription className="text-xs">
            Tentukan kriteria modul, cakupan perangkat daerah, dan format keluaran berkas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Kategori Modul Laporan</label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={jenisLaporan}
                onChange={(e) => setJenisLaporan(e.target.value)}
              >
                <option value="kepegawaian">Data Induk Pegawai & Profil</option>
                <option value="kepangkatan">Kenaikan Pangkat & KGB</option>
                <option value="cuti">Rekapitulasi Saldo & Pengajuan Cuti</option>
                <option value="absensi">Rekap Presensi & Keterlambatan</option>
                <option value="kinerja">Distribusi Penilaian SKP Tahunan</option>
                <option value="pensiun">Daftar Proyeksi Pensiun BUP</option>
                <option value="formasi">Analisis Beban Kerja & Formasi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Cakupan Perangkat Daerah</label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={pdFilter}
                onChange={(e) => setPdFilter(e.target.value)}
              >
                <option value="all">Seluruh Perangkat Daerah</option>
                {pdList.map((pd) => (
                  <option key={pd.id} value={pd.id}>
                    {pd.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Tahun Laporan</label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                <option value="2026">Tahun Anggaran 2026</option>
                <option value="2025">Tahun Anggaran 2025</option>
                <option value="2024">Tahun Anggaran 2024</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleEksporCsv}
              disabled={loading}
              className="gap-2 text-xs font-semibold shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {loading ? "Menghasilkan Berkas..." : "Ekspor Spreadsheet (CSV)"}
            </Button>
            <Button
              variant="outline"
              onClick={handleEksporPdf}
              disabled={loading}
              className="gap-2 text-xs font-semibold"
            >
              <FileText className="h-4 w-4 text-rose-600" />
              {loading ? "Menghasilkan Dokumen..." : "Ekspor Dokumen Resmi (PDF)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
