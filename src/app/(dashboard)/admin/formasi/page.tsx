"use client";

import { useFormasiList } from "@/services";
import { Layers, Plus, Building2, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function AdminFormasiKebutuhanPage() {
  const { data: formasiList, loading } = useFormasiList();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Perencanaan Formasi & Kebutuhan Jabatan Daerah
          </h1>
          <p className="text-xs text-muted-foreground">
            Analisis Beban Kerja (ABK) dan proyeksi formasi aparatur per Perangkat Daerah tahun 2025.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <Download className="h-4 w-4" />
            Ekspor Analisis Formasi
          </Button>
          <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Alokasi Formasi
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Matriks Formasi Jabatan Seluruh Perangkat Daerah (2025)
          </CardTitle>
          <CardDescription className="text-xs">
            Perbandingan antara formasi yang dibutuhkan versus jumlah pegawai definitif saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perangkat Daerah</TableHead>
                <TableHead>Nama Jabatan</TableHead>
                <TableHead>Tahun Anggaran</TableHead>
                <TableHead>Kebutuhan (ABK)</TableHead>
                <TableHead>Tersedia (Riil)</TableHead>
                <TableHead>Kekurangan / Kelebihan</TableHead>
                <TableHead className="text-right">Rekomendasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat matriks formasi daerah...</p>
                  </TableCell>
                </TableRow>
              ) : formasiList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada data matriks formasi.
                  </TableCell>
                </TableRow>
              ) : (
                formasiList.map((item) => {
                const gap = item.tersedia - item.kebutuhan;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {item.pd_nama}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {item.jabatan_nama}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.tahun}</TableCell>
                    <TableCell className="text-xs font-bold tabular-nums">
                      {item.kebutuhan}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600 tabular-nums">
                      {item.tersedia}
                    </TableCell>
                    <TableCell className="text-xs font-bold tabular-nums">
                      {gap < 0 ? (
                        <span className="text-rose-600 font-bold">Kurang {Math.abs(gap)} Pegawai</span>
                      ) : (
                        <span className="text-emerald-600">Terpenuhi (+{gap})</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={gap < 0 ? "ditolak" : "disetujui"}>
                        {gap < 0 ? "Buka Usulan CASN / Mutasi" : "Formasi Stabil"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
