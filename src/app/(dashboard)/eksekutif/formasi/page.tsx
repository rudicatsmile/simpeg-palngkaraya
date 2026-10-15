"use client";

import React from "react";
import { 
  Building2, Users, PieChart as PieIcon, TrendingUp, DollarSign, 
  Download, FileCheck, ArrowUpRight, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from "recharts";
import { useFormasiList } from "@/services";
import { useAppSettings } from "@/hooks/useAppSettings";

const DATA_ANALISIS_BEBAN = [
  { nama: "Guru & Tenaga Kependidikan", kebutuhan: 2600, eksisting: 2150, gap: -450 },
  { nama: "Tenaga Kesehatan (Medis & Paramedis)", kebutuhan: 1450, eksisting: 1100, gap: -350 },
  { nama: "Teknis Infrastruktur (PUPR/Perkim)", kebutuhan: 380, eksisting: 320, gap: -60 },
  { nama: "Teknis Administrasi & Perencana", kebutuhan: 850, eksisting: 920, gap: 70 },
  { nama: "Auditor & Pengawas Pemerintahan", kebutuhan: 95, eksisting: 60, gap: -35 },
];

export default function EksekutifFormasiPage() {
  const { data: formasiList, loading } = useFormasiList();
  const { settings } = useAppSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analisis Kebutuhan Formasi & Belanja Pegawai</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kalkulasi makro Anjab-ABK, pemenuhan tenaga pelayanan dasar, dan batas proporsi belanja pegawai APBD {settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah"}.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Unduh Dokumen e-Formasi (PDF)
          </Button>
        </div>
      </div>

      {/* KPI Makro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Rasio Belanja Pegawai</span>
            <div className="text-3xl font-bold text-slate-900 mt-2">28.4%</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Aman (&lt;30% Mandat UU HKPD No. 1/2022)
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Kebutuhan Riil (ABK)</span>
            <div className="text-3xl font-bold text-indigo-600 mt-2">5,375</div>
            <p className="text-xs text-slate-500 mt-1">Berdasarkan hitungan beban kerja</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Defisit Formasi Pelayanan Dasar</span>
            <div className="text-3xl font-bold text-rose-600 mt-2">-800</div>
            <p className="text-xs text-slate-500 mt-1">Kekurangan Guru & Nakes</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Usulan CASN 2027</span>
            <div className="text-3xl font-bold text-emerald-600 mt-2">550 Formasi</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">400 PPPK + 150 CPNS</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart Gap Kebutuhan vs Eksisting */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Perbandingan Kebutuhan Formasi (ABK) vs Kekuatan Eksisting
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Data kebutuhan riil berdasarkan Anjab-ABK Kementerian PAN-RB tahun berjalan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_ANALISIS_BEBAN} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="nama" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="kebutuhan" name="Kebutuhan Ideal (ABK)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="eksisting" name="Eksisting Terisi" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rincian Kebutuhan per Jabatan */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-900">
            Ringkasan Anjab-ABK Jabatan Prioritas
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Sebaran jabatan strategis yang telah disetujui MenPAN-RB.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Nama Jabatan</th>
                  <th className="py-3 px-4">Perangkat Daerah</th>
                  <th className="py-3 px-4">Kebutuhan (ABK)</th>
                  <th className="py-3 px-4">Eksisting</th>
                  <th className="py-3 px-4">Selisih (Gap)</th>
                  <th className="py-3 px-4">Status Usulan MenPAN-RB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Memuat data formasi jabatan...
                    </td>
                  </tr>
                ) : formasiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Belum ada data usulan formasi.
                    </td>
                  </tr>
                ) : (
                  formasiList.map((f) => {
                    const selisih = f.tersedia - f.kebutuhan;
                    return (
                      <tr key={f.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{f.jabatan_nama}</td>
                        <td className="py-3.5 px-4 text-slate-600">{f.pd_nama}</td>
                        <td className="py-3.5 px-4 font-medium">{f.kebutuhan} orang</td>
                        <td className="py-3.5 px-4 font-medium">{f.tersedia} orang</td>
                        <td className="py-3.5 px-4 font-semibold">
                          <span className={selisih < 0 ? "text-rose-600" : "text-emerald-600"}>
                            {selisih > 0 ? `+${selisih}` : selisih} orang
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge className={selisih < 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                            {selisih < 0 ? "Usulan Formasi CASN" : "Terpenuhi"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
