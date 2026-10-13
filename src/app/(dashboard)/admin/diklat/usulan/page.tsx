"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePegawaiDiklatList, diklatService } from "@/services";
import { PegawaiDiklat } from "@/types";
import { ArrowLeft, GraduationCap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function UsulanDiklatAdminPage() {
  const { data: initialList, loading } = usePegawaiDiklatList();
  const [list, setList] = useState<PegawaiDiklat[]>([]);

  useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const handleApprove = async (id: string, nama: string) => {
    const ok = await diklatService.updatePegawaiDiklatStatus(id, "disetujui");
    if (ok) {
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "disetujui" as const } : item
        )
      );
      toast.success("Usulan Diklat Disetujui!", {
        description: `Pegawai ${nama} resmi didaftarkan pada kuota anggaran pelatihan daerah di Supabase.`,
      });
    } else {
      toast.error("Gagal menyetujui usulan diklat.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/diklat">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Antrean Usulan Pelatihan Pegawai
          </h1>
          <p className="text-xs text-muted-foreground">
            Verifikasi permohonan mengikuti bimtek dan diklat pengembangan kompetensi aparatur langsung dari database Supabase.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Daftar Usulan Mengikuti Diklat
          </CardTitle>
          <CardDescription className="text-xs">
            Persetujuan akan memverifikasi alokasi anggaran pelatihan pada BKPSDM.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Program Diklat</TableHead>
                <TableHead>Penyelenggara</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Verifikasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat antrean usulan diklat dari database...
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada usulan pelatihan yang diajukan saat ini.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {item.pegawai_nama || item.pegawai_id}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-primary">
                      {item.diklat_nama || "Pelatihan Diklat"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.penyelenggara || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "selesai" || item.status === "disetujui"
                            ? "disetujui"
                            : "menunggu"
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      {item.status === "diajukan" ? (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(item.id, item.pegawai_nama || "")}
                          className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Setujui Usulan
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Terverifikasi</span>
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
