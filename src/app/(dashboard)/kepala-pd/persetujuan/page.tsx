"use client";

import { useState, useEffect } from "react";
import { useCutiList, cutiService } from "@/services";
import { Cuti } from "@/types";
import { CheckCircle2, XCircle, ArrowRight, Calendar, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function PersetujuanTingkatDuaPage() {
  const { data: dbCuti, loading, refresh } = useCutiList();
  const [list, setList] = useState<Cuti[]>([]);

  useEffect(() => {
    if (dbCuti) {
      setList(dbCuti.filter((item) => item.status === "disetujui_atasan" || item.status === "diajukan"));
    }
  }, [dbCuti]);

  const handleApproveFinal = async (id: string, nama: string) => {
    try {
      await cutiService.updateStatus(id, "disetujui_kepala_pd");
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "disetujui_kepala_pd" as const } : item
        )
      );
      toast.success("Persetujuan Tingkat Akhir Diterbitkan!", {
        description: `Permohonan cuti oleh ${nama} telah disetujui penuh oleh Kepala Perangkat Daerah. Saldo cuti terpotong secara transaksional.`,
      });
    } catch {
      toast.error("Gagal menyetujui permohonan");
    }
  };

  const handleRejectFinal = async (id: string, nama: string) => {
    try {
      await cutiService.updateStatus(id, "ditolak");
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "ditolak" as const } : item
        )
      );
      toast.error("Permohonan Ditolak oleh Kepala PD!", {
        description: `Usulan cuti oleh ${nama} ditolak. Saldo kuota pegawai tidak berkurang.`,
      });
    } catch {
      toast.error("Gagal menolak permohonan");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Persetujuan Tingkat Kedua (Kepala Perangkat Daerah)
        </h1>
        <p className="text-xs text-muted-foreground">
          Usulan yang telah mendapatkan rekomendasi persetujuan Atasan Langsung dan menunggu penetapan final Kepala PD.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Daftar Usulan Menunggu Penetapan Final
          </CardTitle>
          <CardDescription className="text-xs">
            Persetujuan di tingkat ini akan memotong saldo kuota cuti pegawai secara real-time dan menerbitkan surat persetujuan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Jenis Permohonan</TableHead>
                <TableHead>Durasi / Periode</TableHead>
                <TableHead>Alasan / Keterangan</TableHead>
                <TableHead>Status Workflow</TableHead>
                <TableHead className="text-right">Keputusan Kepala PD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat usulan cuti...</p>
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Tidak ada usulan cuti yang menunggu penetapan Kepala Perangkat Daerah.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{item.pegawai_nama}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs capitalize">
                    Cuti {item.jenis}
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
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "disetujui_kepala_pd"
                          ? "disetujui"
                          : item.status === "ditolak"
                          ? "ditolak"
                          : "menunggu"
                      }
                    >
                      {item.status.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                    {item.status !== "disetujui_kepala_pd" && item.status !== "ditolak" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveFinal(item.id, item.pegawai_nama || "")}
                          className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Setujui Penuh
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectFinal(item.id, item.pegawai_nama || "")}
                          className="text-xs h-8 font-semibold"
                        >
                          Tolak
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">
                        Keputusan Selesai
                      </span>
                    )}
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
