"use client";

import Link from "next/link";
import { usePerubahanDataList } from "@/services";
import { ArrowLeft, History, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
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

export default function RiwayatPerubahanPage() {
  const { data, loading } = usePerubahanDataList();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/pegawai/profil">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Riwayat Pengajuan Perubahan Data
          </h1>
          <p className="text-xs text-muted-foreground">
            Lacak status verifikasi usulan perbaikan data pribadi Anda oleh Atasan dan Operator BKPSDM dari database Supabase.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Daftar Usulan Perubahan Data Pribadi
          </CardTitle>
          <CardDescription className="text-xs">
            Setiap usulan melalui alur persetujuan Atasan Langsung sebelum disimpan ke data induk.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Diajukan</TableHead>
                <TableHead>Bidang / Kolom</TableHead>
                <TableHead>Nilai Lama</TableHead>
                <TableHead>Nilai Baru (Usulan)</TableHead>
                <TableHead>Status Persetujuan</TableHead>
                <TableHead>Keterangan / Verifikator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat riwayat perubahan data...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada riwayat pengajuan perubahan data.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {item.diajukan_at
                        ? new Date(item.diajukan_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {item.field}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground line-through">
                      {item.nilai_lama}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-primary">
                      {item.nilai_baru}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "disetujui"
                            ? "disetujui"
                            : item.status === "ditolak"
                            ? "ditolak"
                            : "diajukan"
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.diputuskan_oleh
                        ? `Disetujui oleh ${item.diputuskan_oleh}`
                        : "Menunggu telaah verifikator"}
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
