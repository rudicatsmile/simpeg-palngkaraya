"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCutiList, cutiService } from "@/services";
import { Cuti } from "@/types";
import { CheckCircle2, XCircle, ArrowRight, Calendar, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AntreanPersetujuanAtasanPage() {
  const { data: dbCuti, loading, refresh } = useCutiList();
  const [list, setList] = useState<Cuti[]>([]);

  useEffect(() => {
    if (dbCuti) {
      setList(dbCuti.filter((item) => item.status === "diajukan" || item.status === "disetujui_atasan"));
    }
  }, [dbCuti]);

  const handleApprove = async (id: string, nama: string) => {
    try {
      await cutiService.updateStatus(id, "disetujui_atasan");
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "disetujui_atasan" as const } : item
        )
      );
      toast.success("Usulan Telah Disetujui Atasan!", {
        description: `Permohonan cuti oleh ${nama} diteruskan ke Kepala Perangkat Daerah untuk persetujuan tingkat 2.`,
      });
    } catch {
      toast.error("Gagal menyetujui usulan cuti");
    }
  };

  const handleReject = async (id: string, nama: string) => {
    try {
      await cutiService.updateStatus(id, "ditolak");
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "ditolak" as const } : item
        )
      );
      toast.error("Usulan Ditolak!", {
        description: `Permohonan cuti oleh ${nama} ditolak pada tingkat 1. Notifikasi telah dikirimkan ke pegawai.`,
      });
    } catch {
      toast.error("Gagal menolak usulan cuti");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Antrean Persetujuan Atasan Langsung
        </h1>
        <p className="text-xs text-muted-foreground">
          Tinjau usulan cuti dan permohonan kepegawaian dari bawahan langsung sebelum diteruskan ke Kepala Perangkat Daerah.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Daftar Usulan Menunggu Verifikasi Tingkat Pertama
          </CardTitle>
          <CardDescription className="text-xs">
            Aksi persetujuan langsung memperbarui status ke alur workflow tingkat berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Jenis Permohonan</TableHead>
                <TableHead>Durasi / Periode</TableHead>
                <TableHead>Alasan / Keperluan</TableHead>
                <TableHead>Status Saat Ini</TableHead>
                <TableHead className="text-right">Aksi Verifikasi</TableHead>
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
                    Tidak ada usulan cuti yang menunggu verifikasi tingkat atasan.
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
                        item.status === "disetujui_atasan" || item.status === "disetujui_kepala_pd"
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
                    {item.status === "diajukan" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(item.id, item.pegawai_nama || "")}
                          className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(item.id, item.pegawai_nama || "")}
                          className="text-xs h-8"
                        >
                          Tolak
                        </Button>
                      </>
                    ) : (
                      <Link href={`/atasan/persetujuan/${item.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          Detail
                        </Button>
                      </Link>
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
