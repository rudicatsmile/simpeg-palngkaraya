"use client";

import Link from "next/link";
import { useUsulanPangkatList } from "@/services";
import { Award, Sliders, ArrowRight, Clock, CheckCircle2, AlertTriangle, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function ManajemenKepangkatanPage() {
  const { data: usulanList, loading } = useUsulanPangkatList();

  const totalSiap = usulanList.filter((u) => u.status === "disetujui" || u.status === "verifikasi").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Manajemen Kenaikan Pangkat & Early Warning
          </h1>
          <p className="text-xs text-muted-foreground">
            Pemantauan otomatis prediksi TMT H-180, verifikasi checklist berkas, dan penetapan SK langsung dari database Supabase.
          </p>
        </div>
        <Link href="/admin/kepangkatan/aturan">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <Sliders className="h-4 w-4" />
            Konfigurasi Aturan Masa Kerja
          </Button>
        </Link>
      </div>

      {/* 3 Kartu KPI Kepangkatan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Periode Kenaikan Pangkat</span>
            <p className="text-2xl font-bold font-heading text-foreground">1 April 2026</p>
            <p className="text-[11px] text-muted-foreground">Periode Reguler BKN Semester I</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Usulan Masuk</span>
            <p className="text-2xl font-bold font-heading text-amber-600 tabular-nums">
              {usulanList.length} Berkas
            </p>
            <p className="text-[11px] text-muted-foreground">Terdaftar di pangkalan data Supabase</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Usulan Siap / Terverifikasi</span>
            <p className="text-2xl font-bold font-heading text-emerald-600 tabular-nums">
              {totalSiap} Usulan
            </p>
            <p className="text-[11px] text-muted-foreground">Memenuhi checklist syarat BKN</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Usulan Kenaikan Pangkat */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Daftar Usulan Kenaikan Pangkat Periode Berjalan
          </CardTitle>
          <CardDescription className="text-xs">
            Periksa pemenuhan syarat dan kelengkapan berkas digital per pegawai.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Perangkat Daerah</TableHead>
                <TableHead>Gol. Asal → Tujuan</TableHead>
                <TableHead>TMT Usulan</TableHead>
                <TableHead>Status Verifikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat daftar usulan kenaikan pangkat dari database...
                  </TableCell>
                </TableRow>
              ) : usulanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada usulan kenaikan pangkat yang tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                usulanList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-foreground">{item.pegawai_nama}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.pegawai_nip || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {item.pd_nama}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-primary">
                      {item.golongan_asal} → {item.golongan_tujuan} ({item.jenis})
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      {item.tmt_usulan}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "disetujui"
                            ? "disetujui"
                            : item.status === "verifikasi"
                            ? "diajukan"
                            : "menunggu"
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/kepangkatan/${item.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          Checklist Berkas
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
