"use client";

import React from "react";
import { 
  Users, Award, TrendingUp, AlertTriangle, Building2, Calendar, 
  ArrowUpRight, FileText, CheckCircle2, ShieldCheck, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { usePegawaiList, usePerangkatDaerahList } from "@/services";

// Data chart untuk eksekutif
const DATA_GOLONGAN = [
  { name: "Gol. I", jumlah: 120, fill: "#94a3b8" },
  { name: "Gol. II", jumlah: 850, fill: "#60a5fa" },
  { name: "Gol. III", jumlah: 2450, fill: "#4f46e5" },
  { name: "Gol. IV", jumlah: 1320, fill: "#9333ea" },
];

const DATA_JENIS_PEGAWAI = [
  { name: "PNS", value: 3850, color: "#4f46e5" },
  { name: "PPPK", value: 890, color: "#06b6d4" },
];

const DATA_DISTRIBUSI_PD = [
  { pd: "Dinas Pendidikan", pns: 1450, pppk: 520 },
  { pd: "Dinas Kesehatan", pns: 820, pppk: 240 },
  { pd: "PUPR", pns: 290, pppk: 45 },
  { pd: "BKPSDM", pns: 65, pppk: 12 },
  { pd: "Bappeda", pns: 78, pppk: 8 },
  { pd: "Inspektorat", pns: 54, pppk: 5 },
  { pd: "Lainnya (PD)", pns: 1093, pppk: 60 },
];

const DATA_TREN_PENSIUN_5THN = [
  { tahun: "2026", jumlah: 142 },
  { tahun: "2027", jumlah: 168 },
  { tahun: "2028", jumlah: 195 },
  { tahun: "2029", jumlah: 230 },
  { tahun: "2030", jumlah: 210 },
];

export default function EksekutifDashboardPage() {
  const { data: pegawaiList } = usePegawaiList();
  const { data: pdList } = usePerangkatDaerahList();

  const totalASN = pegawaiList.length || 6;
  const totalPNS = pegawaiList.filter((p) => p.status_kepegawaian === "PNS").length || 5;
  const totalPPPK = pegawaiList.filter((p) => p.status_kepegawaian === "PPPK").length || 1;

  return (
    <div className="space-y-6">
      {/* Header Eksekutif */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs">
              Executive Strategic Briefing
            </Badge>
            <span className="text-xs text-slate-400">Diperbarui: 12 Okt 2026, 16:00 WIB</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Pimpinan Tinggi Daerah</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Ringkasan indikator kinerja utama kepegawaian, komposisi talenta ASN, dan kewaspadaan pensiun Pemerintah Kabupaten Nusantara Jaya.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Unduh Ringkasan Eksekutif (PDF)
          </Button>
        </div>
      </div>

      {/* KPI Cards Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kekuatan ASN</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalASN.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +2.4%
              </span>
              <span className="text-slate-500">dibanding tahun anggaran lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Komposisi ASN</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              81.2% <span className="text-base font-normal text-slate-500">PNS</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>PNS: <strong>{totalPNS}</strong></span>
              <span>•</span>
              <span>PPPK: <strong>{totalPPPK}</strong> (18.8%)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rasio Indeks Kinerja</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">94.8%</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Predikat Kinerja Baik & Sangat Baik
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 border-amber-200 bg-amber-50/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Kewaspadaan Pensiun</span>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-900 mt-2">142 ASN</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-700 font-medium">
              <span>Memasuki BUP dalam kurun 12 bulan</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Baris Chart 1: Golongan & Jenis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Distribusi Pegawai per Perangkat Daerah</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Sebaran PNS dan PPPK di satuan kerja pemerintah daerah tahun 2026.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA_DISTRIBUSI_PD} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="pd" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="pns" name="PNS" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pppk" name="PPPK" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Piramida Golongan Ruang</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Komposisi jenjang kepangkatan ASN daerah.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={DATA_GOLONGAN} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="jumlah" radius={[0, 4, 4, 0]}>
                    {DATA_GOLONGAN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>Mayoritas ASN: <strong>Golongan III (51.7%)</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Baris Chart 2: Tren Pensiun & Early Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xs border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">Proyeksi Pensiun 5 Tahun (2026 - 2030)</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Estimasi pelepasan ASN untuk perencanaan rekrutmen formasi CASN.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-indigo-600 border-indigo-200">Total 945 Pegawai</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DATA_TREN_PENSIUN_5THN} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="jumlah" name="ASN Pensiun" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 bg-rose-50/70 p-2.5 rounded-lg border border-rose-100">
              ⚠️ Puncak pensiun diproyeksikan terjadi pada tahun <strong>2029 (230 orang)</strong>, terutama jabatan fungsional guru dan tenaga kesehatan.
            </p>
          </CardContent>
        </Card>

        {/* Ringkasan Isu Strategis Kepegawaian */}
        <Card className="shadow-xs border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Rekomendasi Tindak Lanjut Strategis</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Catatan sistem cerdas (Early Warning) untuk bahan keputusan Bupati / Sekda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">18 Jabatan Administrator (Eselon III) Akan Lowong</p>
                <p className="text-slate-600 mt-0.5">
                  18 pejabat struktural akan purna tugas dalam 6 bulan ke depan. Direkomendasikan pembukaan seleksi terbuka talenta (Talent Pool Box 9).
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">Analisis Beban Kerja Formasi Nakes Puskesmas</p>
                <p className="text-slate-600 mt-0.5">
                  Dinas Kesehatan mengalami defisit 42 perawat dan bidan di 6 Puskesmas daerah terluar Nusantara Jaya. Usulan formasi PPPK 2027 telah siap diajukan ke MenPAN-RB.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">Kepatuhan Penyusunan SKP Semester I 2026</p>
                <p className="text-slate-600 mt-0.5">
                  Tingkat kepatuhan penetapan SKP mencapai 98.4%. Sebanyak 4.664 ASN telah menyelesaikan kontrak kinerja berbasis PermenPAN-RB No. 6/2022.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
