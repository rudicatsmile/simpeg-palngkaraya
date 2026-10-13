"use client";

import React, { useState } from "react";
import { 
  FileText, Download, Printer, ShieldCheck, CheckCircle2, 
  Calendar, FileCheck2, Filter, AlertTriangle, Building2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LaporanAuditResmi {
  id: string;
  nomorSurat: string;
  judul: string;
  periode: string;
  tanggalAudit: string;
  auditorUtama: string;
  statusTemuan: "Nihil Temuan Signifikan" | "Ada Rekomendasi" | "Perlu Tindak Lanjut Segera";
  jumlahTemuan: number;
  ringkasan: string;
}

const DUMMY_AUDIT_REPORTS: LaporanAuditResmi[] = [
  {
    id: "lha-01",
    nomorSurat: "700/084/LHA/INSP/2026",
    judul: "Laporan Hasil Audit Kepatuhan Pembayaran TPP ASN Berbasis Presensi & SKP",
    periode: "Triwulan II 2026",
    tanggalAudit: "18 Juli 2026",
    auditorUtama: "Rudi Hartono, S.H., CFrA.",
    statusTemuan: "Nihil Temuan Signifikan",
    jumlahTemuan: 0,
    ringkasan: "Verifikasi silang antara data geotagging presensi mobile, rekapitulasi finger scan, dan potongan TPP pada 43 Perangkat Daerah telah sesuai Perbup No. 14/2024."
  },
  {
    id: "lha-02",
    nomorSurat: "700/052/LHA/INSP/2026",
    judul: "Audit Kepatuhan Penerbitan SK Kenaikan Pangkat Pilihan & Jabatan Fungsional",
    periode: "Semester I 2026",
    tanggalAudit: "10 April 2026",
    auditorUtama: "Rudi Hartono, S.H., CFrA.",
    statusTemuan: "Ada Rekomendasi",
    jumlahTemuan: 3,
    ringkasan: "Ditemukan 3 berkas kenaikan pangkat pilihan yang dokumen konversi predikat kinerja (PAK Integrasi) belum disahkan pejabat penilai secara digital."
  },
  {
    id: "lha-03",
    nomorSurat: "700/019/LHA/INSP/2026",
    judul: "Pemeriksaan Khusus Tata Kelola Izin Cuti Alasan Penting & Cuti Sakit Berkepanjangan",
    periode: "Tahun Anggaran 2025",
    tanggalAudit: "15 Januari 2026",
    auditorUtama: "Drs. M. Taufik, M.M.",
    statusTemuan: "Nihil Temuan Signifikan",
    jumlahTemuan: 0,
    ringkasan: "Seluruh cuti sakit di atas 14 hari telah dilengkapi surat keterangan dokter pemerintah sesuai Peraturan BKN No. 24/2017."
  }
];

export default function AuditLaporanPage() {
  const [reports, setReports] = useState<LaporanAuditResmi[]>(DUMMY_AUDIT_REPORTS);
  const [activeReport, setActiveReport] = useState<LaporanAuditResmi>(DUMMY_AUDIT_REPORTS[0]);

  const handleDownload = (judul: string) => {
    toast.success(`Mengunduh dokumen LHA: ${judul}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Nihil Temuan Signifikan":
        return <Badge className="bg-emerald-600">Nihil Temuan Signifikan</Badge>;
      case "Ada Rekomendasi":
        return <Badge className="bg-amber-600">Ada Rekomendasi</Badge>;
      default:
        return <Badge variant="destructive" className="bg-rose-600">Perlu Tindak Lanjut</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Hasil Audit (LHA) Inspektorat</h1>
          <p className="text-slate-500 text-sm mt-1">
            Penerbitan dan pengarsipan Laporan Hasil Pemeriksaan (LHP/LHA) kepegawaian untuk BPK RI dan Bupati.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => toast.success("Draft LHA baru berhasil dibuat.")}
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Buat Draft LHA Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Daftar LHA */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Daftar Dokumen LHA Resmi</h3>
          {reports.map((rep) => {
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
                  <span className="font-mono text-[11px] font-semibold text-slate-600">
                    {rep.nomorSurat}
                  </span>
                  <span className="text-[11px] text-slate-500">{rep.tanggalAudit}</span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs mt-2 line-clamp-2">
                  {rep.judul}
                </h4>
                <div className="mt-2">{getStatusBadge(rep.statusTemuan)}</div>
              </div>
            );
          })}
        </div>

        {/* Kolom Detail & Pratinjau Dokumen LHA */}
        <div className="lg:col-span-2">
          <Card className="shadow-xs border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {activeReport.nomorSurat}
                  </span>
                  <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                    {activeReport.judul}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Auditor Penanggung Jawab: {activeReport.auditorUtama} • Periode Audit: {activeReport.periode}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" /> Cetak LHA
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                    onClick={() => handleDownload(activeReport.judul)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Unduh PDF
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Hasil Temuan */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                    Ringkasan Hasil Pemeriksaan (Opini Pengawas)
                  </h4>
                  {getStatusBadge(activeReport.statusTemuan)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReport.ringkasan}
                </p>
              </div>

              {/* Rekomendasi Tindak Lanjut */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                  Rekomendasi Tindak Lanjut Inspektorat
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      Meningkatkan sinkronisasi otomatis antara absensi mobile dan kalkulasi TPP di modul penggajian BPKAD.
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">
                      Pemberian sosialisasi berkala penegakan disiplin PP No. 94/2021 kepada seluruh Kasubag Kepegawaian Perangkat Daerah.
                    </span>
                  </div>
                </div>
              </div>

              {/* Tanda Tangan Digital Pengawas */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Sertifikasi Audit Digital Terverifikasi</p>
                    <p className="text-[11px] text-slate-500">
                      Dokumen ini dienkripsi dengan SHA-256 Hash dan sah secara hukum sesuai UU ITE No. 1/2024.
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-600">Sah & Final</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
