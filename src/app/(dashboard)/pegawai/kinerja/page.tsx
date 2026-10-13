"use client";

import { useState } from "react";
import { useSKPList } from "@/services";
import { Target, Award, TrendingUp, CheckCircle2, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function KinerjaSKPPage() {
  const { data: skpList } = useSKPList();
  const [selectedTahun, setSelectedTahun] = useState("2025");

  const skp = skpList.find((s) => s.tahun === Number(selectedTahun)) || skpList[0] || {
    id: "s0000001-0000-4000-8000-000000000001",
    tahun: 2025,
    status: "final",
    nilai_akhir: 94.5,
    predikat: "Sangat Baik",
    targets: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Sasaran Kinerja Pegawai (SKP)
          </h1>
          <p className="text-xs text-muted-foreground">
            Perencanaan target kinerja tahunan, monitoring realisasi aspek, dan evaluasi berkala atasan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Tahun Kinerja:</span>
          <select
            className="flex h-9 rounded-lg border border-input bg-card px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
          >
            <option value="2024">Tahun 2024 (Final)</option>
            <option value="2025">Tahun 2025 (Berjalan)</option>
          </select>
        </div>
      </div>

      {/* Kartu Ringkasan Predikat & Nilai Akhir */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20">
          <CardContent className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Nilai Kinerja Akhir</span>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold font-heading text-emerald-600 tabular-nums">
                {skp.nilai_akhir}
              </p>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Predikat Kinerja: {skp.predikat}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Status Penetapan SKP</span>
            <div className="pt-1">
              <Badge variant="selesai" className="text-xs px-2.5 py-1">
                ● Ditetapkan & Difinalisasi
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Dievaluasi oleh: <strong>Drs. H. Suryadi, M.Si.</strong> (Kepala Dinas Pendidikan)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Total Bobot Target</span>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold font-heading text-indigo-600 tabular-nums">
                100%
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Memenuhi syarat wajib PermenPANRB (Total bobot 100%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Rincian Target & Realisasi SKP */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Matriks Rencana Hasil Kerja (RHK) Pegawai
              </CardTitle>
              <CardDescription className="text-xs">
                Uraian target kuantitas, kualitas, dan waktu beserta realisasi terverifikasi.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Form pembaruan realisasi SKP bulanan dibuka.")}
              className="text-xs"
            >
              Update Realisasi Periode
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rencana Kinerja / Uraian Target</TableHead>
                <TableHead>Aspek</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Realisasi</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Bobot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(skp.targets || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                    Belum ada uraian rencana kinerja (RHK) untuk tahun {selectedTahun}.
                  </TableCell>
                </TableRow>
              ) : (
                skp.targets.map((tgt) => (
                <TableRow key={tgt.id}>
                  <TableCell className="font-semibold text-xs text-foreground max-w-md">
                    {tgt.uraian}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {tgt.aspek}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold tabular-nums">
                    {tgt.target}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-emerald-600 tabular-nums">
                    {tgt.realisasi}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {tgt.satuan}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold tabular-nums">
                    {tgt.bobot}%
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
