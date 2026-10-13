"use client";

import React, { useState } from "react";
import { 
  KeyRound, ShieldAlert, CheckCircle2, XCircle, Search, 
  Filter, Laptop, Smartphone, Globe, Download, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AuthLogEntry {
  id: string;
  waktu: string;
  nip: string;
  nama: string;
  status: "BERHASIL" | "GAGAL" | "DIBLOKIR";
  ipAddress: string;
  lokasi: string;
  perangkat: string;
  alasanGagal?: string;
}

const DUMMY_AUTH_LOGS: AuthLogEntry[] = [
  {
    id: "log-1",
    waktu: "12 Okt 2026, 15:10:45 WIB",
    nip: "197509141999031002",
    nama: "Rudi Hartono, S.H., CFrA.",
    status: "BERHASIL",
    ipAddress: "192.168.1.105 (Intranet Pemda)",
    lokasi: "Gedung Inspektorat Lt. 2",
    perangkat: "Chrome 128 / Windows 11",
  },
  {
    id: "log-2",
    waktu: "12 Okt 2026, 14:20:12 WIB",
    nip: "197805122002121003",
    nama: "Dr. Budi Santoso, M.Si.",
    status: "BERHASIL",
    ipAddress: "192.168.1.20 (Intranet Pemda)",
    lokasi: "Kantor BKPSDM",
    perangkat: "Edge 127 / macOS Sequoia",
  },
  {
    id: "log-3",
    waktu: "12 Okt 2026, 13:55:04 WIB",
    nip: "198204102005011004",
    nama: "Ahmad Dahlan, S.T., M.Kom.",
    status: "GAGAL",
    ipAddress: "114.125.45.89 (Telkomsel)",
    lokasi: "Kab. Nusantara Jaya (Seluler)",
    perangkat: "Safari / iPhone iOS 18",
    alasanGagal: "Kata sandi salah (Percobaan ke-1)"
  },
  {
    id: "log-4",
    waktu: "12 Okt 2026, 13:56:11 WIB",
    nip: "198204102005011004",
    nama: "Ahmad Dahlan, S.T., M.Kom.",
    status: "BERHASIL",
    ipAddress: "114.125.45.89 (Telkomsel)",
    lokasi: "Kab. Nusantara Jaya (Seluler)",
    perangkat: "Safari / iPhone iOS 18",
  },
  {
    id: "log-5",
    waktu: "10 Okt 2026, 23:12:15 WIB",
    nip: "197805122002121003",
    nama: "Dr. Budi Santoso, M.Si.",
    status: "DIBLOKIR",
    ipAddress: "182.253.110.42 (IP Luar Wilayah)",
    lokasi: "Jakarta Pusat",
    perangkat: "Python-Requests / Linux Bot",
    alasanGagal: "Brute-force limit (5x salah password dalam 2 menit)"
  },
  {
    id: "log-6",
    waktu: "10 Okt 2026, 08:05:30 WIB",
    nip: "199402282019032007",
    nama: "Dewi Lestari, S.E.",
    status: "BERHASIL",
    ipAddress: "192.168.2.14 (Dinkes LAN)",
    lokasi: "Dinas Kesehatan",
    perangkat: "Firefox 130 / Windows 10",
  }
];

export default function AuditAuthLogPage() {
  const [logs, setLogs] = useState<AuthLogEntry[]>(DUMMY_AUTH_LOGS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.nama.toLowerCase().includes(search.toLowerCase()) ||
      l.nip.includes(search) ||
      l.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
      l.perangkat.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BERHASIL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Sukses
          </span>
        );
      case "GAGAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <XCircle className="h-3 w-3" /> Gagal
          </span>
        );
      case "DIBLOKIR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="h-3 w-3" /> Diblokir
          </span>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Log Aktivitas & Autentikasi Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pemantauan sesi masuk, kegagalan autentikasi, serta pencegahan anomali akses akun dinas ASN.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Unduh Log Akses
          </Button>
        </div>
      </div>

      {/* KPI Singkat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Total Sesi Login Hari Ini</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3,412</p>
              <p className="text-xs text-emerald-600 mt-0.5">Tingkat keberhasilan 99.2%</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <KeyRound className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Kegagalan Kata Sandi</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">28 Kali</p>
              <p className="text-xs text-slate-500 mt-0.5">Mayoritas salah ketik wajar</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <XCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 border-rose-200 bg-rose-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-700 font-semibold uppercase">Upaya Dicurigai / Diblokir</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">1 Percobaan</p>
              <p className="text-xs text-rose-600 mt-0.5">Bot scraping ditolak firewall</p>
            </div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Log */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Rekapitulasi Log Autentikasi</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Pencatatan real-time koneksi pengguna ke server SIMPEG Daerah.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Cari NIP, nama, IP, browser..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 h-9"
              >
                <option value="all">Semua Status</option>
                <option value="BERHASIL">Sukses (Berhasil)</option>
                <option value="GAGAL">Gagal Autentikasi</option>
                <option value="DIBLOKIR">Diblokir Sistem</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pegawai (NIP & Nama)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Alamat IP & Jaringan</th>
                  <th className="py-3 px-4">Lokasi / Unit</th>
                  <th className="py-3 px-4">Perangkat & Browser</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.waktu}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{log.nama}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{log.nip}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {log.lokasi}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {log.perangkat}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {log.alasanGagal ? (
                        <span className="text-rose-600 font-medium">{log.alasanGagal}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
