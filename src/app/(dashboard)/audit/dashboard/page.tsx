"use client";

import React from "react";
import { 
  ShieldCheck, AlertTriangle, Activity, FileSearch, CheckCircle2, 
  Clock, Lock, Download, ExternalLink, ArrowUpRight, Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AuditorDashboardPage() {
  const anomaliAudit = [
    {
      id: "anom-1",
      tanggal: "12 Okt 2026, 09:15 WIB",
      jenis: "Anomali Jam Presensi",
      aktor: "Operator PD - Dinas Kesehatan",
      keterangan: "Penyesuaian manual presensi 5 pegawai sekaligus tanpa melampirkan SPT dinas luar.",
      status: "Perlu Klarifikasi",
      urgensi: "Sedang"
    },
    {
      id: "anom-2",
      tanggal: "11 Okt 2026, 16:40 WIB",
      jenis: "Perubahan Rekening Gaji",
      aktor: "Admin Kepegawaian",
      keterangan: "Perubahan nomor rekening Bank Jatim atas nama Drs. Hendro Wibowo oleh admin.",
      status: "Terverifikasi Dokumen Sah",
      urgensi: "Rendah"
    },
    {
      id: "anom-3",
      tanggal: "10 Okt 2026, 23:12 WIB",
      jenis: "Percobaan Akses di Luar Jam Kerja",
      aktor: "IP: 182.253.110.42 (Eksternal)",
      keterangan: "3 kali gagal login berturut-turut pada akun Administrator.",
      status: "Diblokir Otomatis",
      urgensi: "Tinggi"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Inspektorat */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-950 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
              Pengawasan Internal • Inspektorat Daerah
            </Badge>
            <span className="text-xs text-slate-400">Integritas Log: WORM (Write Once Read Many)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal Pengawasan & Audit Trail Kepegawaian</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Pusat pengawasan tata kelola ASN, verifikasi kepatuhan regulasi merit, dan forensik digital perubahan data SIMPEG Daerah.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/audit/trail">
            <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs">
              <FileSearch className="h-4 w-4 mr-1.5" /> Buka Log Perubahan Data
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Mutasi Data (Bulan Ini)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
              <p className="text-xs text-slate-500 mt-0.5">Semua terekam di Audit Trail</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 border-amber-200 bg-amber-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-semibold uppercase">Temuan Anomali Perubahan</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">3 Kasus</p>
              <p className="text-xs text-amber-600 mt-0.5">Membutuhkan uji petik berkas</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-semibold uppercase">Kepatuhan Regulasi BKN</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">99.7%</p>
              <p className="text-xs text-emerald-600 mt-0.5">Sesuai Perka BKN No. 11/2022</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Log Keamanan Sesi</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">100%</p>
              <p className="text-xs text-slate-500 mt-0.5">Enkripsi SHA-256 Valid</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Lock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Anomali yang Terdeteksi */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Peringatan Anomali & Temuan Audit Terkini
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Peristiwa operasional yang memicu parameter anomali inspektorat daerah.
              </CardDescription>
            </div>
            <Link href="/audit/trail" className="text-xs text-indigo-600 hover:underline flex items-center">
              Lihat seluruh catatan audit <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Waktu Kejadian</th>
                  <th className="py-3 px-4">Jenis Anomali</th>
                  <th className="py-3 px-4">Aktor / Sumber</th>
                  <th className="py-3 px-4">Deskripsi Temuan</th>
                  <th className="py-3 px-4">Tingkat Risiko</th>
                  <th className="py-3 px-4 text-right">Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {anomaliAudit.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{item.tanggal}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.jenis}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.aktor}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-sm">{item.keterangan}</td>
                    <td className="py-3.5 px-4">
                      {item.urgensi === "Tinggi" ? (
                        <Badge variant="destructive" className="bg-rose-600">Tinggi</Badge>
                      ) : item.urgensi === "Sedang" ? (
                        <Badge className="bg-amber-600">Sedang</Badge>
                      ) : (
                        <Badge variant="secondary">Rendah</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-medium text-slate-800">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
