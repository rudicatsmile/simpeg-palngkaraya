"use client";

import { usePerubahanDataList, perubahanDataService } from "@/services";
import { FileCheck, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { PerubahanDataPegawai } from "@/types";

export default function VerifikasiPerubahanDataPage() {
  const { data: initialList, loading } = usePerubahanDataList();
  const [list, setList] = useState<PerubahanDataPegawai[]>([]);

  useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const handleSetujui = async (id: string, nama: string, field: string) => {
    const ok = await perubahanDataService.updateStatus(id, "disetujui");
    if (ok) {
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "disetujui" as const, diputuskan_oleh: "Operator BKPSDM" } : item
        )
      );
      toast.success("Perubahan Data Pegawai Disetujui!", {
        description: `Pembaruan kolom ${field} untuk ${nama} telah diterapkan langsung pada pangkalan data Supabase.`,
      });
    } else {
      toast.error("Gagal menyetujui perubahan data.");
    }
  };

  const handleTolak = async (id: string, nama: string) => {
    const ok = await perubahanDataService.updateStatus(id, "ditolak");
    if (ok) {
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "ditolak" as const, diputuskan_oleh: "Operator BKPSDM" } : item
        )
      );
      toast.error("Pengajuan Perubahan Ditolak!", {
        description: `Pengajuan perubahan data oleh ${nama} ditolak. Notifikasi penolakan dikirim ke pegawai.`,
      });
    } else {
      toast.error("Gagal menolak perubahan data.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Verifikasi Perubahan Data Mandiri
        </h1>
        <p className="text-xs text-muted-foreground">
          Antrean permohonan pembaharuan nomor telepon, alamat, dan data kontak dari pegawai ASN langsung dari database Supabase.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            Antrean Usulan Pembaruan Data Masuk
          </CardTitle>
          <CardDescription className="text-xs">
            Periksa keabsahan nilai baru yang diajukan sebelum memberikan persetujuan akhir.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Bidang / Kolom</TableHead>
                <TableHead>Nilai Lama</TableHead>
                <TableHead>Nilai Baru yang Diajukan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Verifikasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat antrean usulan perubahan data...
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada antrean perubahan data saat ini.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {item.pegawai_nama}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-primary">
                      {item.field}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground line-through">
                      {item.nilai_lama}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600">
                      {item.nilai_baru}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "disetujui"
                            ? "disetujui"
                            : item.status === "ditolak"
                            ? "ditolak"
                            : "menunggu"
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                      {item.status === "diajukan" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSetujui(item.id, item.pegawai_nama || "", item.field)}
                            className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          >
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleTolak(item.id, item.pegawai_nama || "")}
                            className="text-xs h-8 font-semibold"
                          >
                            Tolak
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">
                          Diproses: {item.diputuskan_oleh || "Operator"}
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
