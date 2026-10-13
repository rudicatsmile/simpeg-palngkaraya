"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, Clock, TrendingUp, CheckCircle, ArrowRight, 
  Search, Filter, ShieldAlert, Award, FileWarning, BellRing
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EarlyWarningItem {
  id: string;
  nama: string;
  nip: string;
  pd: string;
  kategori: "Kenaikan Pangkat" | "Kinerja Rendah" | "Kedisiplinan" | "Sertifikasi";
  masalah: string;
  tmtAtauWaktu: string;
  keterangan: string;
  urgensi: "Tinggi" | "Sedang" | "Rendah";
  rekomendasi: string;
}

const DUMMY_WARNINGS: EarlyWarningItem[] = [
  {
    id: "ew-1",
    nama: "Ahmad Dahlan, S.T., M.Kom.",
    nip: "198204102005011004",
    pd: "Dinas Pendidikan",
    kategori: "Kenaikan Pangkat",
    masalah: "Telah memenuhi masa kerja 4 tahun di Gol. IV/a namun kekurangan Angka Kredit (AK) Konversi",
    tmtAtauWaktu: "TMT Terakhir: 01 April 2022 (Terlambat 6 Bulan)",
    keterangan: "Butuh 24.5 AK untuk KP ke Pembina Tingkat I (IV/b)",
    urgensi: "Tinggi",
    rekomendasi: "Instruksikan atasan langsung untuk memvalidasi SKP konversi periode 2024-2025"
  },
  {
    id: "ew-2",
    nama: "Dewi Lestari, S.E.",
    nip: "199402282019032007",
    pd: "Dinas Kesehatan",
    kategori: "Kenaikan Pangkat",
    masalah: "Berkas Ijazah Magister belum dilegalisir untuk penyesuaian ijazah (PI)",
    tmtAtauWaktu: "Periode KP: Oktober 2026",
    keterangan: "Surat Izin Belajar sah, transkrip belum terunggah di e-Dokumen",
    urgensi: "Sedang",
    rekomendasi: "Kirimkan notifikasi push pengunggahan berkas digital ke ASN bersangkutan"
  },
  {
    id: "ew-3",
    nama: "Ir. Bambang Trihatmodjo, M.T.",
    nip: "196704151994031004",
    pd: "Dinas Pekerjaan Umum dan Penataan Ruang",
    kategori: "Kinerja Rendah",
    masalah: "Realisasi SKP Triwulan III belum dinilai oleh Kepala Dinas PUPR",
    tmtAtauWaktu: "Batas Akhir: 15 Oktober 2026",
    keterangan: "Potensi menghambat pencairan TPP dan evaluasi berkala",
    urgensi: "Tinggi",
    rekomendasi: "Peringatan otomatis via WA Gateway kepada Kepala Dinas PUPR"
  },
  {
    id: "ew-4",
    nama: "Fajar Nugroho, A.Md.",
    nip: "199507112020121005",
    pd: "Kecamatan Nusantara Kota",
    kategori: "Kedisiplinan",
    masalah: "Akumulasi keterlambatan presensi mencapai 185 menit dalam bulan ini",
    tmtAtauWaktu: "Bulan Oktober 2026",
    keterangan: "Pelanggaran jam kerja berpotensi pemotongan TPP 3%",
    urgensi: "Sedang",
    rekomendasi: "Pembinaan lisan oleh Atasan Langsung / Camat"
  },
  {
    id: "ew-5",
    nama: "Rina Kusuma, S.Pd.",
    nip: "198811202011012010",
    pd: "Dinas Pendidikan (SMP Negeri 1)",
    kategori: "Sertifikasi",
    masalah: "Sertifikat Pendidik belum terverifikasi di Dapodik dan BKN",
    tmtAtauWaktu: "Tunjangan Profesi Tertunda",
    keterangan: "Perbedaan NUPTK pada data dapodik",
    urgensi: "Rendah",
    rekomendasi: "Sinkronisasi data melalui Operator Dinas Pendidikan"
  }
];

export default function EksekutifEarlyWarningPage() {
  const [warnings, setWarnings] = useState<EarlyWarningItem[]>(DUMMY_WARNINGS);
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = warnings.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nip.includes(search) ||
      item.pd.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategoriFilter === "all" || item.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const getUrgensiBadge = (urgensi: "Tinggi" | "Sedang" | "Rendah") => {
    switch (urgensi) {
      case "Tinggi":
        return <Badge variant="destructive" className="bg-rose-600 font-semibold">Urgensi Tinggi</Badge>;
      case "Sedang":
        return <Badge className="bg-amber-600 text-white font-medium">Urgensi Sedang</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-600 border-slate-300">Urgensi Rendah</Badge>;
    }
  };

  const handleKirimDisposisi = (nama: string) => {
    toast.success(`Disposisi tindak lanjut untuk ${nama} berhasil diteruskan ke BKPSDM.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sistem Peringatan Dini (Early Warning)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Algoritma deteksi otomatis kendala kepegawaian, anomali berkas, dan keterlambatan kenaikan pangkat ASN daerah.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => toast.success("Semua disposisi peringatan dini berhasil disiarkan ke WhatsApp Kepala PD terkait.")} 
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            <BellRing className="h-4 w-4 mr-1.5" /> Broadcast Pengingat ke Kepala PD
          </Button>
        </div>
      </div>

      {/* Ringkasan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200 border-rose-200 bg-rose-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-700 font-semibold uppercase">Potensi Terlambat KP</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">48 ASN</p>
              <p className="text-xs text-rose-600 mt-0.5">Kekurangan berkas & AK</p>
            </div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 border-amber-200 bg-amber-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-semibold uppercase">Pending Penilaian SKP</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">32 ASN</p>
              <p className="text-xs text-amber-600 mt-0.5">Belum dinilai atasan</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <FileWarning className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Anomali Disiplin / Jam</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">14 Kasus</p>
              <p className="text-xs text-slate-500 mt-0.5">Keterlambatan berulang</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-semibold uppercase">Terselesaikan Pekan Ini</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">87 ASN</p>
              <p className="text-xs text-emerald-600 mt-0.5">Berkas telah tuntas</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Early Warning */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Daftar Deteksi Dini & Rekomendasi Solutif
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Monitoring otomatis berbasis aturan sistem e-SIMPEG.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Cari nama, NIP, unit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 h-9"
              >
                <option value="all">Semua Kategori</option>
                <option value="Kenaikan Pangkat">Kenaikan Pangkat</option>
                <option value="Kinerja Rendah">Kinerja Rendah</option>
                <option value="Kedisiplinan">Kedisiplinan</option>
                <option value="Sertifikasi">Sertifikasi</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Pegawai & Satuan Kerja</th>
                  <th className="py-3 px-4">Kategori & Urgensi</th>
                  <th className="py-3 px-4">Indikasi Masalah Terdeteksi</th>
                  <th className="py-3 px-4">Rekomendasi Tindak Lanjut</th>
                  <th className="py-3 px-4 text-right">Aksi Pimpinan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.nama}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{item.nip}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{item.pd}</div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <div>
                        <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50/50">
                          {item.kategori}
                        </Badge>
                      </div>
                      <div>{getUrgensiBadge(item.urgensi)}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-slate-800">{item.masalah}</p>
                      <p className="text-[11px] text-rose-600 font-mono mt-1">{item.tmtAtauWaktu}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.keterangan}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100 text-indigo-950">
                        <span className="font-semibold text-[11px]">Saran BKPSDM:</span>
                        <p className="text-[11px] mt-0.5 leading-snug">{item.rekomendasi}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => handleKirimDisposisi(item.nama)}
                      >
                        Disposisi
                      </Button>
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
