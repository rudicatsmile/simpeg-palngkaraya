"use client";

import { useFormasiList } from "@/services";
import { Layers, Building2, AlertCircle, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function FormasiPdPage() {
  const { data: formasiList, loading } = useFormasiList();

  const totalKebutuhan = formasiList.reduce((acc, f) => acc + (f.kebutuhan || 0), 0);
  const totalTersedia = formasiList.reduce((acc, f) => acc + (f.tersedia || 0), 0);
  const totalGap = Math.max(0, totalKebutuhan - totalTersedia);
  const persentase = totalKebutuhan > 0 ? Math.round((totalTersedia / totalKebutuhan) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Kebutuhan & Ketersediaan Formasi Jabatan Dinas
          </h1>
          <p className="text-xs text-muted-foreground">
            Analisis beban kerja (ABK), ketersediaan pegawai riil, dan proyeksi kekurangan formasi tahun 2025.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Kebutuhan ABK</span>
            <p className="text-3xl font-extrabold font-heading text-foreground tabular-nums">{totalKebutuhan} Formasi</p>
            <p className="text-[11px] text-muted-foreground">Tahun Anggaran 2025</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pegawai Tersedia Saat Ini</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">{totalTersedia} Pegawai</p>
            <p className="text-[11px] text-muted-foreground">Terisi {persentase}%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/20">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Kekurangan Formasi (Gap)</span>
            <p className="text-3xl font-extrabold font-heading text-rose-600 tabular-nums">{totalGap} Formasi</p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
              Prioritas Usulan CASN / Mutasi
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Matriks Formasi per Jabatan Dinas Pendidikan
          </CardTitle>
          <CardDescription className="text-xs">
            Data digunakan sebagai dasar penetapan redistribusi mutasi internal maupun usulan ke BKPSDM.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Jabatan</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Kebutuhan (ABK)</TableHead>
                <TableHead>Tersedia (Riil)</TableHead>
                <TableHead>Selisih (Gap)</TableHead>
                <TableHead className="text-right">Status Formasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat matriks formasi...</p>
                  </TableCell>
                </TableRow>
              ) : formasiList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada data analisis formasi jabatan.
                  </TableCell>
                </TableRow>
              ) : (
                formasiList.map((item) => {
                  const selisih = item.tersedia - item.kebutuhan;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {item.jabatan_nama}
                        <span className="block text-[11px] text-muted-foreground">{item.pd_nama}</span>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{item.tahun}</TableCell>
                      <TableCell className="text-xs font-bold tabular-nums">
                        {item.kebutuhan}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-emerald-600 tabular-nums">
                        {item.tersedia}
                      </TableCell>
                      <TableCell className="text-xs font-bold tabular-nums">
                        {selisih < 0 ? (
                          <span className="text-rose-600">Kurang {Math.abs(selisih)}</span>
                        ) : (
                          <span className="text-emerald-600">Cukup ({selisih})</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={selisih < 0 ? "ditolak" : "disetujui"}>
                          {selisih < 0 ? "KEKURANGAN" : "TERPENUHI"}
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
