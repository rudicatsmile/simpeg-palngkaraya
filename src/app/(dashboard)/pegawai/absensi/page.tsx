"use client";

import { useState } from "react";
import { useAbsensiList } from "@/services";
import { Clock, Calendar, CheckCircle2, AlertTriangle, FileText, UserCheck, Loader2 } from "lucide-react";
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

export default function RiwayatAbsensiPage() {
  const [selectedBulan, setSelectedBulan] = useState("02-2025");
  const { data: absensiList, loading: isLoading } = useAbsensiList();

  const hadirCount = absensiList.filter((a) => a.status === "hadir").length;
  const terlambatCount = absensiList.filter((a) => a.status === "terlambat").length;
  const izinCount = absensiList.filter((a) => a.status === "izin" || a.status === "sakit").length;
  const alphaCount = absensiList.filter((a) => a.status === "alpha").length;
  const total = absensiList.length || 1;
  const hadirPct = ((hadirCount / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Riwayat Presensi & Kehadiran
          </h1>
          <p className="text-xs text-muted-foreground">
            Rekapitulasi log fingerprint perangkat dan deteksi keterlambatan real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Periode:</span>
          <select
            className="flex h-9 rounded-lg border border-input bg-card px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
          >
            <option value="02-2025">Februari 2025</option>
            <option value="01-2025">Januari 2025</option>
            <option value="12-2024">Desember 2024</option>
          </select>
        </div>
      </div>

      {/* 4 Kartu KPI Kehadiran Bulanan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Hadir Tepat Waktu</span>
            <p className="text-2xl font-bold font-heading text-emerald-600 tabular-nums">{hadirCount} Hari</p>
            <p className="text-[11px] text-muted-foreground">Persentase: {hadirPct}%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Terlambat (&gt; 07.30)</span>
            <p className="text-2xl font-bold font-heading text-amber-600 tabular-nums">{terlambatCount} Hari</p>
            <p className="text-[11px] text-muted-foreground">Perlu peningkatan disiplin</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Cuti & Izin Resmi</span>
            <p className="text-2xl font-bold font-heading text-blue-600 tabular-nums">{izinCount} Hari</p>
            <p className="text-[11px] text-muted-foreground">Bulan berjalan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Tanpa Keterangan (Alpha)</span>
            <p className="text-2xl font-bold font-heading text-foreground tabular-nums">{alphaCount} Hari</p>
            <p className="text-[11px] text-emerald-600 font-medium">{alphaCount === 0 ? "Tertib presensi" : "Perlu perhatian"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Log Presensi Harian */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Catatan Presensi Harian
          </CardTitle>
          <CardDescription className="text-xs">
            Data disinkronkan otomatis dari perangkat fingerprint dan database kehadiran Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari & Tanggal</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Status Kehadiran</TableHead>
                <TableHead>Sumber Data</TableHead>
                <TableHead>ID Perangkat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat data presensi...</p>
                  </TableCell>
                </TableRow>
              ) : absensiList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada data presensi untuk periode ini.
                  </TableCell>
                </TableRow>
              ) : (
                absensiList.map((abs) => (
                  <TableRow key={abs.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {new Date(abs.tanggal).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums font-semibold">
                      {abs.jam_masuk || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {abs.jam_pulang || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          abs.status === "hadir"
                            ? "disetujui"
                            : abs.status === "terlambat"
                            ? "warning"
                            : "menunggu"
                        }
                      >
                        {abs.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {abs.sumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {abs.device_id || "-"}
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
