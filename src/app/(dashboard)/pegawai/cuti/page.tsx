"use client";

import { useState } from "react";
import Link from "next/link";
import { useCutiList, useSaldoCuti } from "@/services";
import { Cuti } from "@/types";
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function CutiSayaPage() {
  const { data: listCuti, refresh } = useCutiList();
  const { saldo } = useSaldoCuti();

  const handleBatalkan = (id: string) => {
    toast.success("Pengajuan Cuti Berhasil Dibatalkan!", {
      description: "Saldo cuti telah dikembalikan secara otomatis ke kuota tahunan.",
    });
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Layanan Cuti & Izin Pegawai
          </h1>
          <p className="text-xs text-muted-foreground">
            Pantau kuota sisa cuti real-time dan riwayat persetujuan berjenjang.
          </p>
        </div>
        <Link href="/pegawai/cuti/baru">
          <Button size="sm" className="gap-2 text-xs font-semibold shadow-sm">
            <Plus className="h-4 w-4" />
            Ajukan Permohonan Cuti Baru
          </Button>
        </Link>
      </div>

      {/* 3 Kartu Saldo Cuti */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Jatah Cuti Tahunan</span>
            <p className="text-2xl font-bold font-heading text-foreground tabular-nums">{saldo.jatah} Hari</p>
            <p className="text-[11px] text-muted-foreground">Sesuai Peraturan BKN No. 24 Tahun 2017</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Cuti Telah Digunakan</span>
            <p className="text-2xl font-bold font-heading text-amber-600 tabular-nums">{saldo.terpakai} Hari Kerja</p>
            <p className="text-[11px] text-muted-foreground">Total pengajuan yang telah disetujui</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Sisa Kuota Cuti Anda</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">{saldo.sisa} Hari Kerja</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Tersedia untuk diajukan kapan saja
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Riwayat Pengajuan */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Daftar Riwayat Pengajuan Cuti
          </CardTitle>
          <CardDescription className="text-xs">
            Alur persetujuan diproses oleh Atasan Langsung lalu Kepala Perangkat Daerah.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Periode Tanggal</TableHead>
                <TableHead>Jumlah Hari</TableHead>
                <TableHead>Alasan / Keterangan</TableHead>
                <TableHead>Status Verifikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listCuti.map((cuti) => (
                <TableRow key={cuti.id}>
                  <TableCell className="font-semibold text-xs text-foreground capitalize">
                    Cuti {cuti.jenis.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {cuti.tanggal_mulai} s.d. {cuti.tanggal_selesai}
                  </TableCell>
                  <TableCell className="text-xs font-bold tabular-nums">
                    {cuti.jumlah_hari} Hari Kerja
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {cuti.alasan}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cuti.status === "disetujui_kepala_pd" || cuti.status === "selesai"
                          ? "disetujui"
                          : cuti.status === "ditolak"
                          ? "ditolak"
                          : cuti.status === "dibatalkan"
                          ? "draf"
                          : "menunggu"
                      }
                    >
                      {cuti.status.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {cuti.status === "diajukan" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBatalkan(cuti.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 h-8 gap-1"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Batalkan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
