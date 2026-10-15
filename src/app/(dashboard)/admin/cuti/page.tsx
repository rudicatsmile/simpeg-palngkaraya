"use client";

import { useState } from "react";
import { useCutiList } from "@/services";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { Calendar, Sliders, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminManajemenCutiPage() {
  const [jatahTahunan, setJatahTahunan] = useState(12);
  const { data: listCuti, loading } = useCutiList();
  const { getLabel, getBadgeColor } = useMasterReferensi();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Manajemen Cuti & Izin Seluruh Pegawai
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitoring permohonan cuti aktif dan konfigurasi kuota jatah cuti tahunan daerah.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-xl text-xs">
          <span className="font-semibold text-muted-foreground">Jatah Cuti Tahunan:</span>
          <span className="font-bold text-primary font-heading text-sm">{jatahTahunan} Hari</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Pengaturan jatah cuti dibuka di aturan bisnis.")}
            className="text-xs h-7 ml-2"
          >
            Ubah
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Daftar Seluruh Permohonan Cuti Pegawai Daerah
          </CardTitle>
          <CardDescription className="text-xs">
            Alur verifikasi diproses secara transaksional berjenjang.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Perangkat Daerah</TableHead>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Durasi / Periode</TableHead>
                <TableHead>Alasan Permohonan</TableHead>
                <TableHead className="text-right">Status Saat Ini</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat daftar permohonan cuti...</p>
                  </TableCell>
                </TableRow>
              ) : listCuti.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada permohonan cuti tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                listCuti.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{item.pegawai_nama}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.pd_nama}
                  </TableCell>
                  <TableCell className="font-semibold text-xs">
                    {getLabel("jenis_cuti", item.jenis, `Cuti ${item.jenis}`)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-bold tabular-nums">{item.jumlah_hari} Hari Kerja</span>
                    <span className="block text-[11px] text-muted-foreground font-mono">
                      {item.tanggal_mulai} s.d. {item.tanggal_selesai}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {item.alasan}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        getBadgeColor("status_cuti", item.status) === "emerald"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : getBadgeColor("status_cuti", item.status) === "rose"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : getBadgeColor("status_cuti", item.status) === "blue"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : getBadgeColor("status_cuti", item.status) === "cyan"
                          ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {getLabel("status_cuti", item.status)}
                    </span>
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
