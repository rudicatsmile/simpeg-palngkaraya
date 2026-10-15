"use client";

import React, { useState } from "react";
import { 
  FileText, Download, Printer, Calendar, BarChart2, 
  Users, CheckCircle2, ChevronRight, Share2, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSettings } from "@/hooks/useAppSettings";
import { toast } from "sonner";


interface LaporanEksekutif {
  id: string;
  judul: string;
  periode: string;
  kategori: string;
  ukuran: string;
  tanggalRilis: string;
  ringkasan: string;
}

const DAFTAR_LAPORAN: LaporanEksekutif[] = [
  {
    id: "rep-1",
    judul: "Buku Statistik Kepegawaian Semester I Tahun 2026",
    periode: "Semester I 2026",
    kategori: "Statistik Komprehensif",
    ukuran: "4.8 MB (PDF)",
    tanggalRilis: "15 Juli 2026",
    ringkasan: "Memuat sebaran ASN berdasarkan kualifikasi pendidikan, kepangkatan, gender, dan profil kompetensi 43 Perangkat Daerah."
  },
  {
    id: "rep-2",
    judul: "Laporan Evaluasi Kinerja & Disiplin ASN Triwulan III 2026",
    periode: "Triwulan III 2026",
    kategori: "Kinerja & Disiplin",
    ukuran: "2.3 MB (PDF)",
    tanggalRilis: "05 Oktober 2026",
    ringkasan: "Evaluasi predikat capaian SKP berkala, angka ketidakhadiran, serta rekapitulasi penjatuhan hukuman disiplin ASN."
  },
  {
    id: "rep-3",
    judul: "Kajian Proyeksi Kebutuhan ASN & Pensiun 2026-2030",
    periode: "Rencana Strategis 5 Tahunan",
    kategori: "Perencanaan Formasi",
    ukuran: "3.5 MB (PDF)",
    tanggalRilis: "02 Februari 2026",
    ringkasan: "Rekomendasi kebutuhan pengadaan CPNS & PPPK untuk menyeimbangkan pelepasan 945 ASN yang memasuki BUP."
  },
  {
    id: "rep-4",
    judul: "Laporan Penerapan Manajemen Talenta & Merit System 2025/2026",
    periode: "Tahunan 2025/2026",
    kategori: "Sistem Merit",
    ukuran: "5.1 MB (PDF)",
    tanggalRilis: "28 Agustus 2026",
    ringkasan: "Kepatuhan 8 area sistem merit KASN/BKN dengan capaian predikat 'Sangat Baik' (Skor 362.5)."
  }
];

export default function EksekutifLaporanPage() {
  const [activeReport, setActiveReport] = useState<LaporanEksekutif>(DAFTAR_LAPORAN[0]);
  const { settings } = useAppSettings();

  const handleDownload = (judul: string) => {
    toast.success(`Mengunduh dokumen: ${judul}`);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Strategis Eksekutif</h1>
          <p className="text-slate-500 text-sm mt-1">
            Publikasi resmi dan laporan manajerial kepegawaian untuk Bupati, Wakil Bupati, dan Sekretaris Daerah.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleDownload("Semua_Laporan_Eksekutif_2026.zip")}
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            <Download className="h-4 w-4 mr-1.5" /> Unduh Seluruh Laporan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Daftar Laporan */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Daftar Dokumen Laporan Eksekutif</h3>
          {DAFTAR_LAPORAN.map((rep) => {
            const isSelected = activeReport.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setActiveReport(rep)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={`text-[10px] ${isSelected ? "border-indigo-400 bg-indigo-100 text-indigo-800" : "border-slate-200"}`}>
                    {rep.kategori}
                  </Badge>
                  <span className="text-[11px] text-slate-500">{rep.tanggalRilis}</span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mt-2 line-clamp-2">
                  {rep.judul}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">Periode: {rep.periode}</p>
              </div>
            );
          })}
        </div>

        {/* Kolom Preview Laporan */}
        <div className="lg:col-span-2">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <Badge className="bg-indigo-600 text-white mb-2 text-xs">
                    {activeReport.kategori}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {activeReport.judul}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Dipublikasikan oleh {settings.singkatan_bkd || `BKPSDM ${settings.nama_pemda || "Pemerintah Daerah"}`} • Rilis: {activeReport.tanggalRilis}
                  </CardDescription>

                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" /> Cetak
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                    onClick={() => handleDownload(activeReport.judul)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Unduh Dokumen ({activeReport.ukuran})
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Ringkasan Eksekutif */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                  Executive Abstract
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReport.ringkasan}
                </p>
              </div>

              {/* Sorotan Data (Key Highlights) */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                  Sorotan Angka Utama
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                    <p className="text-[11px] text-slate-500">Total ASN Terdaftar</p>
                    <p className="text-xl font-bold text-indigo-700 mt-1">4.740</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">3.850 PNS + 890 PPPK</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                    <p className="text-[11px] text-slate-500">Skor Indeks Merit Sistem</p>
                    <p className="text-xl font-bold text-emerald-700 mt-1">362.5</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Kategori Sangat Baik</p>
                  </div>
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg">
                    <p className="text-[11px] text-slate-500">Rasio Jabatan Fungsional</p>
                    <p className="text-xl font-bold text-purple-700 mt-1">64.2%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Transformasi Eselonisasi</p>
                  </div>
                </div>
              </div>

              {/* Lembar Otorisasi */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Otorisasi & Keabsahan Digital</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ditandatangani secara elektronik (BSrE BSSN) oleh Kepala {settings.singkatan_bkd || `BKPSDM ${settings.nama_pemda || "Pemerintah Daerah"}`}.
                  </p>

                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Terverifikasi Sah
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
