"use client";

import { useState } from "react";
import { useLowonganList } from "@/services";
import { LowonganInternal } from "@/types";
import { Briefcase, Plus, Users, Calendar, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function LowonganInternalPage() {
  const { data: listLowongan, loading } = useLowonganList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Lowongan Jabatan Internal (Talent Mobility)
          </h1>
          <p className="text-xs text-muted-foreground">
            Publikasi posisi lowong untuk mutasi mandiri dan seleksi terbuka antar perangkat daerah.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => toast.info("Form pembukaan lowongan internal baru dibuka.")}
          className="gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Buka Lowongan Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Daftar Formasi Jabatan Terbuka
          </CardTitle>
          <CardDescription className="text-xs">
            Pegawai yang memenuhi syarat kompetensi dapat mendaftar melalui portal self-service.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Jabatan</TableHead>
                <TableHead>Perangkat Daerah</TableHead>
                <TableHead>Batas Akhir Pendaftaran</TableHead>
                <TableHead>Jumlah Pelamar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat daftar lowongan internal...</p>
                  </TableCell>
                </TableRow>
              ) : listLowongan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada lowongan internal yang dibuka.
                  </TableCell>
                </TableRow>
              ) : (
                listLowongan.map((low) => (
                <TableRow key={low.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{low.jabatan_nama}</p>
                      <p className="text-[11px] text-muted-foreground max-w-md line-clamp-1">
                        {low.deskripsi}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {low.pd_nama}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-semibold">
                    {low.batas_daftar}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-primary tabular-nums">
                    {low.jumlah_pelamar || 0} Pegawai
                  </TableCell>
                  <TableCell>
                    <Badge variant={low.status === "buka" ? "disetujui" : "draf"}>
                      {low.status === "buka" ? "TERBUKA" : "DITUTUP"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info(`Melihat daftar pelamar untuk jabatan ${low.jabatan_nama}`)}
                      className="text-xs h-8"
                    >
                      Daftar Pelamar
                    </Button>
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
