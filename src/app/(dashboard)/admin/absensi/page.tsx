"use client";

import Link from "next/link";
import { useState } from "react";
import { useAbsensiList } from "@/services";
import { Clock, Fingerprint, Filter, Upload, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminAbsensiPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const { data: absensiList, loading: isLoading } = useAbsensiList();

  const filtered = filterStatus === "all" ? absensiList : absensiList.filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Kehadiran & Rekap Presensi ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Rekap log kehadiran harian dari mesin fingerprint dan ingest API (Ambang batas: 07.30 WIB).
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/absensi/perangkat">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Fingerprint className="h-4 w-4" />
              Kelola Perangkat Fingerprint
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => toast.info("Fitur import CSV log presensi dibuka.")}
            className="gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Impor Log Presensi
          </Button>
        </div>
      </div>

      {/* Filter Keterlambatan */}
      <Card className="p-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-foreground">Filter Status:</span>
          <select
            className="flex h-9 rounded-lg border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status Log</option>
            <option value="hadir">Tepat Waktu (Hadir)</option>
            <option value="terlambat">Terlambat (&gt; 07.30 WIB)</option>
            <option value="izin">Izin / Cuti</option>
          </select>
        </div>
      </Card>

      {/* Tabel Log Presensi */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Log Aktivitas Presensi Pegawai
          </CardTitle>
          <CardDescription className="text-xs">
            Data masuk melalui endpoint /api/v1/absensi/ingest atau perangkat terminal fingerprint terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari & Tanggal</TableHead>
                <TableHead>Jam Masuk</TableHead>
                <TableHead>Jam Pulang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sumber Presensi</TableHead>
                <TableHead>Terminal / Device ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data presensi dari database...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada data presensi yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {item.tanggal}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums font-semibold">
                      {item.jam_masuk}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">
                      {item.jam_pulang}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "hadir" ? "disetujui" : "warning"}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {item.sumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-primary font-semibold">
                      {item.device_id}
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
