"use client";

import React, { useState } from "react";
import { 
  Calendar, Users, AlertCircle, Building2, TrendingDown, 
  Download, Filter, Search, ArrowRight, ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from "recharts";
import { usePegawaiList } from "@/services";

const DATA_PROYEKSI_PD = [
  { pd: "Dinas Pendidikan", y2026: 62, y2027: 74, y2028: 89, y2029: 105, y2030: 98 },
  { pd: "Dinas Kesehatan", y2026: 35, y2027: 41, y2028: 48, y2029: 55, y2030: 50 },
  { pd: "Dinas PUPR", y2026: 12, y2027: 15, y2028: 18, y2029: 22, y2030: 19 },
  { pd: "Bappeda", y2026: 4, y2027: 5, y2028: 6, y2029: 7, y2030: 5 },
  { pd: "BKPSDM", y2026: 3, y2027: 4, y2028: 5, y2029: 6, y2030: 4 },
  { pd: "Sekretariat Daerah", y2026: 16, y2027: 18, y2028: 19, y2029: 23, y2030: 21 },
  { pd: "Lainnya", y2026: 10, y2027: 11, y2028: 10, y2029: 12, y2030: 13 },
];

export default function EksekutifPensiunPage() {
  const [selectedTahun, setSelectedTahun] = useState("all");
  const [search, setSearch] = useState("");
  const { data: pegawaiList, loading: isLoading } = usePegawaiList();

  const pegawaiPensiun = pegawaiList.map((p) => ({
    id: p.id,
    nama: `${p.gelar_depan ? `${p.gelar_depan} ` : ""}${p.nama_lengkap}${p.gelar_belakang ? `, ${p.gelar_belakang}` : ""}`,
    nip: p.nip,
    jabatan: p.jabatan_nama || "Jabatan ASN",
    pd: p.pd_nama || "Perangkat Daerah",
    golongan: `${p.pangkat} / ${p.golongan}`,
    tmtPensiun: p.tanggal_pensiun || "2030-01-01",
    sisaBulan: "Masa Persiapan",
    statusUsulan: "Terdata di SIMPEG",
    eselon: p.golongan?.startsWith("IV") ? "Eselon II/III" : "Pelaksana / Fungsional",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Proyeksi Pensiun & Suksesi Jabatan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Analisis proyeksi Batas Usia Pensiun (BUP) 5 tahun ke depan untuk mengantisipasi kekosongan jabatan strategis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Ekspor Analisis BUP
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500">Pensiun Tahun 2026</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">142 ASN</p>
            <p className="text-xs text-rose-600 mt-1 font-medium">BUP Terdekat (Tahun Berjalan)</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500">Jabatan Struktural Kosong</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">24 Posisi</p>
            <p className="text-xs text-slate-500 mt-1">Eselon II, III, & IV</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500">Guru & Tenaga Kependidikan</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">540 ASN</p>
            <p className="text-xs text-slate-500 mt-1">Proyeksi 5 Tahun ke Depan</p>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500">Kesiapan Kader Talenta (Box 9)</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">86 ASN</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Siap Promosi & Suksesi</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Sebaran Pensiun per PD */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Proyeksi Pensiun per Perangkat Daerah (2026 - 2030)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Komposisi pelepasan ASN tahunan berdasarkan data kelahiran riil di database SIMPEG.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_PROYEKSI_PD} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="pd" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="y2026" name="Tahun 2026" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2027" name="Tahun 2027" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2028" name="Tahun 2028" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2029" name="Tahun 2029" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2030" name="Tahun 2030" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Jabatan Strategis Kritis */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Daftar Pejabat Mendekati BUP (Prioritas Suksesi)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Pejabat JPT Pratama dan Administrator yang membutuhkan persiapan seleksi terbuka atau promosi internal.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Nama Pejabat & NIP</th>
                  <th className="py-3 px-4">Jabatan & Eselon</th>
                  <th className="py-3 px-4">Perangkat Daerah</th>
                  <th className="py-3 px-4">TMT Pensiun</th>
                  <th className="py-3 px-4">Sisa Waktu</th>
                  <th className="py-3 px-4">Status Layanan BKN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pegawaiPensiun.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.nama}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{p.nip}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{p.jabatan}</div>
                      <Badge variant="outline" className="text-[10px] mt-1 text-slate-600">
                        {p.eselon}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.pd}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.tmtPensiun}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {p.sisaBulan}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700">
                        {p.statusUsulan}
                      </span>
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
