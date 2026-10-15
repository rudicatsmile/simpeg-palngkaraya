"use client";

import { useState } from "react";
import Link from "next/link";
import { usePegawaiList, usePerangkatDaerahList } from "@/services";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";

import { Users, Plus, Upload, Search, Filter, Eye, Edit3, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function DataIndukPegawaiPage() {
  const [search, setSearch] = useState("");
  const [filterPd, setFilterPd] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: pegawaiList, loading: isLoading } = usePegawaiList();
  const { data: pdList } = usePerangkatDaerahList();
  const { settings } = useAppSettings();
  const { getOptions: getMasterOptions, getLabel: getMasterLabel } = useMasterReferensi();

  const optStatusKepegawaian = getMasterOptions("status_kepegawaian");

  const filtered = pegawaiList.filter((p) => {
    const matchSearch =
      p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.includes(search);
    const matchPd = filterPd === "all" || p.pd_id === filterPd;
    const matchStatus = filterStatus === "all" || p.status_kepegawaian === filterStatus;
    return matchSearch && matchPd && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Data Induk Pegawai ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Pangkalan data utama PNS dan PPPK {settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah"}.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/pegawai/impor">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Upload className="h-4 w-4" />
              Impor CSV
            </Button>
          </Link>
          <Link href="/admin/pegawai/baru">
            <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
              <Plus className="h-4 w-4" />
              Tambah Pegawai Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Pencarian */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama lengkap atau NIP 18-digit..."
              className="pl-9 h-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sm:col-span-4">
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={filterPd}
              onChange={(e) => setFilterPd(e.target.value)}
            >
              <option value="all">Semua Perangkat Daerah</option>
              {pdList.map((pd) => (
                <option key={pd.id} value={pd.id}>
                  {pd.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status Kepegawaian</option>
              {optStatusKepegawaian.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tabel Data Pegawai */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Daftar Pegawai Terdaftar ({filtered.length} Data)
            </CardTitle>
            <span className="text-xs text-muted-foreground">Halaman 1 dari 1</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Status Kedudukan</TableHead>
                <TableHead>Golongan & Pangkat</TableHead>
                <TableHead>Perangkat Daerah & Jabatan</TableHead>
                <TableHead>Pensiun</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat data pegawai ASN...</p>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Tidak ada pegawai yang sesuai dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">
                        {item.gelar_depan ? `${item.gelar_depan} ` : ""}
                        {item.nama_lengkap}
                        {item.gelar_belakang ? `, ${item.gelar_belakang}` : ""}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status_kepegawaian === "PNS" ? "default" : "secondary"}>
                      {item.status_kepegawaian}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-primary">{item.golongan}</span>
                    <span className="block text-[11px] text-muted-foreground">{item.pangkat}</span>
                  </TableCell>
                  <TableCell className="text-xs max-w-xs truncate">
                    <span className="font-semibold text-foreground block">{item.jabatan_nama}</span>
                    <span className="text-[11px] text-muted-foreground">{item.pd_nama}</span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {item.tanggal_pensiun}
                  </TableCell>
                  <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                    <Link href={`/admin/pegawai/${item.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Detail
                      </Button>
                    </Link>
                    <Link href={`/admin/pegawai/${item.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs h-8 text-primary">
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
