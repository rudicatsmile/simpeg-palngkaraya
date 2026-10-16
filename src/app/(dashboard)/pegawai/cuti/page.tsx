"use client";

import { useState } from "react";
import Link from "next/link";
import { useCutiList, useSaldoCuti, usePegawaiList, cutiService } from "@/services";
import { formatTanggalIndo } from "@/lib/kepangkatan-engine";
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, Ban, Loader2, FileText } from "lucide-react";
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
  const { data: pegawaiList, loading: loadingPegawai } = usePegawaiList();
  const pegawai = pegawaiList[0];
  const pegawaiId = pegawai?.id;

  const { data: listCuti, loading: loadingCuti, refresh: refreshCuti } = useCutiList(pegawaiId);
  const { saldo, loading: loadingSaldo, refresh: refreshSaldo } = useSaldoCuti(pegawaiId);

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleBatalkan = async (id: string) => {
    try {
      setCancellingId(id);
      const ok = await cutiService.batalkan(id);
      if (ok) {
        toast.success("Pengajuan Cuti Berhasil Dibatalkan!", {
          description: "Status pengajuan telah diubah menjadi dibatalkan di database Supabase.",
        });
        refreshCuti();
        refreshSaldo();
      } else {
        toast.error("Gagal membatalkan permohonan cuti. Silakan coba lagi.");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + (err.message || "Gagal menghubungi database"));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disetujui_kepala_pd":
      case "selesai":
        return { variant: "disetujui" as const, label: "Disetujui Penuh" };
      case "disetujui_atasan":
        return { variant: "menunggu" as const, label: "Disetujui Atasan (Menunggu Kepala PD)" };
      case "ditolak":
        return { variant: "ditolak" as const, label: "Ditolak" };
      case "dibatalkan":
        return { variant: "draf" as const, label: "Dibatalkan" };
      case "diajukan":
      default:
        return { variant: "menunggu" as const, label: "Menunggu Verifikasi Atasan" };
    }
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
            Pantau kuota sisa cuti real-time dan riwayat persetujuan berjenjang langsung dari database.
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
            {loadingSaldo || loadingPegawai ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-1">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Memuat kuota...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold font-heading text-foreground tabular-nums">{saldo.jatah} Hari</p>
            )}
            <p className="text-[11px] text-muted-foreground">Sesuai Peraturan BKN No. 24 Tahun 2017</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Cuti Telah Digunakan</span>
            {loadingSaldo || loadingPegawai ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-1">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Memuat data...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold font-heading text-amber-600 tabular-nums">{saldo.terpakai} Hari Kerja</p>
            )}
            <p className="text-[11px] text-muted-foreground">Total pengajuan yang telah disetujui</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Sisa Kuota Cuti Anda</span>
            {loadingSaldo || loadingPegawai ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-1">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span>Menghitung sisa...</span>
              </div>
            ) : (
              <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">{saldo.sisa} Hari Kerja</p>
            )}
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
              {loadingCuti || loadingPegawai ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat riwayat pengajuan cuti dari database Supabase...
                  </TableCell>
                </TableRow>
              ) : listCuti.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">Belum Ada Riwayat Pengajuan Cuti</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mx-auto">
                      Anda belum pernah mengajukan permohonan cuti tahunan maupun izin lainnya. Klik tombol di bawah untuk membuat pengajuan baru.
                    </p>
                    <div className="mt-4">
                      <Link href="/pegawai/cuti/baru">
                        <Button size="sm" variant="outline" className="text-xs gap-1.5">
                          <Plus className="h-3.5 w-3.5" />
                          Ajukan Permohonan Cuti Baru
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listCuti.map((cuti) => {
                  const statusInfo = getStatusBadge(cuti.status);
                  return (
                    <TableRow key={cuti.id}>
                      <TableCell className="font-semibold text-xs text-foreground capitalize">
                        Cuti {cuti.jenis.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {formatTanggalIndo(cuti.tanggal_mulai)} s.d. {formatTanggalIndo(cuti.tanggal_selesai)}
                      </TableCell>
                      <TableCell className="text-xs font-bold tabular-nums">
                        {cuti.jumlah_hari} Hari Kerja
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {cuti.alasan}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {cuti.status === "diajukan" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={cancellingId === cuti.id}
                            onClick={() => handleBatalkan(cuti.id)}
                            className="text-xs text-rose-600 hover:text-rose-700 h-8 gap-1"
                          >
                            {cancellingId === cuti.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            {cancellingId === cuti.id ? "Membatalkan..." : "Batalkan"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
