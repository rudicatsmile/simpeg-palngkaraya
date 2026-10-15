"use client";

import React, { useState } from "react";
import { 
  FileText, Search, Filter, ShieldCheck, Eye, Download, 
  ArrowRight, UserCheck, Clock, Monitor, RefreshCw 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";

interface AuditTrailEntry {
  id: string;
  waktu: string;
  tabel: string;
  aksi: "INSERT" | "UPDATE" | "DELETE";
  nipPegawai: string;
  namaPegawai: string;
  aktorNama: string;
  aktorRole: string;
  ipAddress: string;
  perubahan: {
    field: string;
    sebelum: string;
    sesudah: string;
  }[];
  catatan: string;
}

const DUMMY_AUDIT_TRAILS: AuditTrailEntry[] = [
  {
    id: "aud-001",
    waktu: "12 Okt 2026, 14:15:22 WIB",
    tabel: "pegawai",
    aksi: "UPDATE",
    nipPegawai: "197805122002121003",
    namaPegawai: "Dr. Budi Santoso, M.Si.",
    aktorNama: "Siti Rahmawati, S.Sos.",
    aktorRole: "Operator PD (Dinas Pendidikan)",
    ipAddress: "192.168.10.45",
    perubahan: [
      {
        field: "telepon",
        sebelum: "081234567890",
        sesudah: "081122334455"
      },
      {
        field: "alamat",
        sebelum: "Jl. Merdeka No. 45, Palangkaraya",
        sesudah: "Jl. Veteran No. 88, Palangkaraya"
      }
    ],
    catatan: "Pembaruan kontak dan domisili atas permohonan mandiri ASN"
  },
  {
    id: "aud-002",
    waktu: "12 Okt 2026, 11:30:10 WIB",
    tabel: "riwayat_pangkat",
    aksi: "INSERT",
    nipPegawai: "198204102005011004",
    namaPegawai: "Ahmad Dahlan, S.T., M.Kom.",
    aktorNama: "Admin BKPSDM (Sistem Otomatis BKN)",
    aktorRole: "Admin BKPSDM",
    ipAddress: "10.0.1.200",
    perubahan: [
      {
        field: "golongan_id",
        sebelum: "Pembina (IV/a)",
        sesudah: "Pembina Tingkat I (IV/b)"
      },
      {
        field: "nomor_sk",
        sebelum: "-",
        sesudah: "821/045/BKPSDM/KP/2026"
      },
      {
        field: "tmt_pangkat",
        sebelum: "-",
        sesudah: "01 Oktober 2026"
      }
    ],
    catatan: "Penetapan Kenaikan Pangkat Pilihan Periode Oktober 2026"
  },
  {
    id: "aud-003",
    waktu: "11 Okt 2026, 15:45:00 WIB",
    tabel: "pengajuan_cuti",
    aksi: "UPDATE",
    nipPegawai: "199402282019032007",
    namaPegawai: "Dewi Lestari, S.E.",
    aktorNama: "Dr. Budi Santoso, M.Si.",
    aktorRole: "Atasan Langsung",
    ipAddress: "192.168.12.18",
    perubahan: [
      {
        field: "status_persetujuan",
        sebelum: "Menunggu Persetujuan Atasan",
        sesudah: "Disetujui Atasan Langsung"
      }
    ],
    catatan: "Persetujuan permohonan Cuti Tahunan 3 hari kerja"
  },
  {
    id: "aud-004",
    waktu: "10 Okt 2026, 09:20:15 WIB",
    tabel: "hukuman_disiplin",
    aksi: "INSERT",
    nipPegawai: "198503152009032008",
    namaPegawai: "Siti Rahmawati, S.Sos.",
    aktorNama: "Admin BKPSDM (Bidang Kinerja)",
    aktorRole: "Admin BKPSDM",
    ipAddress: "10.0.1.201",
    perubahan: [
      {
        field: "tingkat_hukuman",
        sebelum: "-",
        sesudah: "Ringan (Teguran Lisan)"
      },
      {
        field: "alasan",
        sebelum: "-",
        sesudah: "Keterlambatan apel gabungan melebihi 3x tanpa keterangan"
      }
    ],
    catatan: "Pencatatan SK Hukuman Disiplin No. 862/012/DIS/2026"
  }
];

export default function AuditTrailPage() {
  const [trails, setTrails] = useState<AuditTrailEntry[]>(DUMMY_AUDIT_TRAILS);
  const [search, setSearch] = useState("");
  const [filterAksi, setFilterAksi] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<AuditTrailEntry | null>(null);

  const filtered = trails.filter((t) => {
    const matchSearch =
      t.namaPegawai.toLowerCase().includes(search.toLowerCase()) ||
      t.nipPegawai.includes(search) ||
      t.aktorNama.toLowerCase().includes(search.toLowerCase()) ||
      t.tabel.toLowerCase().includes(search.toLowerCase());
    const matchAksi = filterAksi === "all" || t.aksi === filterAksi;
    return matchSearch && matchAksi;
  });

  const getAksiBadge = (aksi: string) => {
    switch (aksi) {
      case "INSERT":
        return <Badge className="bg-emerald-600 font-mono text-[11px]">INSERT</Badge>;
      case "UPDATE":
        return <Badge className="bg-blue-600 font-mono text-[11px]">UPDATE</Badge>;
      case "DELETE":
        return <Badge variant="destructive" className="bg-rose-600 font-mono text-[11px]">DELETE</Badge>;
      default:
        return <Badge variant="secondary">{aksi}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Jejak Rekam Audit (Audit Trail Diff)</h1>
          <p className="text-slate-500 text-sm mt-1">
            Rekaman forensik seluruh operasi basis data kepegawaian dengan perbandingan nilai sebelum dan sesudah (Field-Level Audit).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Ekspor Log Audit (CSV/JSON)
          </Button>
        </div>
      </div>

      {/* Tabel Audit */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Catatan Mutasi Data Terkini</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Setiap perubahan disimpan secara permanen di tabel log tak terhapuskan (Immutable).
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Cari nama, NIP, aktor, tabel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              <select
                value={filterAksi}
                onChange={(e) => setFilterAksi(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 h-9"
              >
                <option value="all">Semua Operasi</option>
                <option value="UPDATE">UPDATE (Perubahan)</option>
                <option value="INSERT">INSERT (Penambahan)</option>
                <option value="DELETE">DELETE (Penghapusan)</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Waktu (Timestamp)</th>
                  <th className="py-3 px-4">Entitas (Tabel)</th>
                  <th className="py-3 px-4">Operasi</th>
                  <th className="py-3 px-4">Subjek Pegawai</th>
                  <th className="py-3 px-4">Aktor / Pengguna</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Detail Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {t.waktu}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-indigo-700 font-semibold">
                      {t.tabel}
                    </td>
                    <td className="py-3.5 px-4">
                      {getAksiBadge(t.aksi)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{t.namaPegawai}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{t.nipPegawai}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{t.aktorNama}</div>
                      <div className="text-[11px] text-slate-500">{t.aktorRole}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {t.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setSelectedEntry(t)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Bandingkan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Perbandingan Diff (Sebelum vs Sesudah) */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Perbandingan Nilai (Field-Level Diff)</DialogTitle>
            <DialogDescription>
              Detail komparasi nilai lama vs nilai baru pada record data terpilih.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Tabel Basis Data:</span>
                  <p className="font-mono font-semibold text-indigo-700">{selectedEntry.tabel}</p>
                </div>
                <div>
                  <span className="text-slate-500">Waktu Eksekusi:</span>
                  <p className="font-medium text-slate-800">{selectedEntry.waktu}</p>
                </div>
                <div>
                  <span className="text-slate-500">Aktor Pelaksana:</span>
                  <p className="font-medium text-slate-800">{selectedEntry.aktorNama} ({selectedEntry.aktorRole})</p>
                </div>
                <div>
                  <span className="text-slate-500">Alamat IP:</span>
                  <p className="font-mono text-slate-800">{selectedEntry.ipAddress}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Daftar Perubahan Kolom ({selectedEntry.perubahan.length} Kolom)
                </h4>
                <div className="space-y-2">
                  {selectedEntry.perubahan.map((item, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg text-xs bg-white">
                      <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                        <span className="font-mono text-indigo-600">field: {item.field}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-rose-50 border border-rose-100 rounded text-rose-900">
                          <span className="text-[10px] uppercase font-bold text-rose-500 block">Nilai Sebelum (Old Value)</span>
                          <span className="font-mono break-all mt-1 block">{item.sebelum}</span>
                        </div>
                        <div className="p-2 bg-emerald-50 border border-emerald-100 rounded text-emerald-900">
                          <span className="text-[10px] uppercase font-bold text-emerald-500 block">Nilai Sesudah (New Value)</span>
                          <span className="font-mono break-all mt-1 block">{item.sesudah}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                <span className="font-semibold block text-slate-800">Catatan / Alasan Perubahan:</span>
                <p className="mt-0.5">{selectedEntry.catatan}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
