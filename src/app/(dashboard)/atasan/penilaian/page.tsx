"use client";

import Link from "next/link";
import { useSKPList } from "@/services";
import { Target, ArrowRight, Award, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function PenilaianSKPBawahanPage() {
  const { data: skpList, loading: isLoading } = useSKPList();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Penilaian Prestasi Kerja (SKP) Bawahan
          </h1>
          <p className="text-xs text-muted-foreground">
            Evaluasi capaian realisasi target kerja pegawai dan penetapan predikat kinerja tahunan.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Daftar Berkas SKP Bawahan untuk Dinilai
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih berkas pegawai untuk membuka lembar penilaian dan kalkulasi predikat.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Tahun Kinerja</TableHead>
                <TableHead>Status SKP</TableHead>
                <TableHead>Nilai Capaian</TableHead>
                <TableHead>Predikat Kinerja</TableHead>
                <TableHead className="text-right">Aksi Penilaian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat berkas SKP bawahan...</p>
                  </TableCell>
                </TableRow>
              ) : skpList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada berkas SKP yang masuk untuk dinilai.
                  </TableCell>
                </TableRow>
              ) : (
                skpList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {item.pegawai_nama}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      Tahun {item.tahun}
                    </TableCell>
                    <TableCell>
                      <Badge variant="selesai">
                        ● {(item.status || "draft").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600 tabular-nums">
                      {item.nilai_akhir || "-"}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {item.predikat || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/atasan/penilaian/${item.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
                          Buka Lembar Penilaian
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
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
