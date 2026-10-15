"use client";

import { useSKPList } from "@/services";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { Target, TrendingUp, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function AdminKinerjaSkpPage() {
  const { data: skpList, loading: isLoading } = useSKPList();
  const { getLabel, getBadgeColor } = useMasterReferensi();

  const total = skpList.length;
  const sangatBaikCount = skpList.filter((s) => s.predikat?.toLowerCase().includes("sangat baik")).length;
  const baikCount = skpList.filter((s) => s.predikat?.toLowerCase() === "baik").length;
  const cukupCount = skpList.filter((s) => s.predikat?.toLowerCase().includes("cukup")).length;
  const kurangCount = skpList.filter((s) => s.predikat?.toLowerCase().includes("kurang") || s.predikat?.toLowerCase().includes("buruk")).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Monitoring Kinerja SKP Seluruh ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Rekapitulasi penetapan rencana kinerja, evaluasi penilaian akhir, dan distribusi predikat daerah dari database.
          </p>
        </div>
      </div>

      {/* 4 Kartu Distribusi Predikat Kinerja */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Predikat Sangat Baik (91-100)</span>
            <p className="text-2xl font-bold font-heading text-emerald-600 tabular-nums">
              {sangatBaikCount} ASN
            </p>
            <p className="text-[11px] text-muted-foreground">
              {total > 0 ? ((sangatBaikCount / total) * 100).toFixed(1) : 0}% total tercatat
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Predikat Baik (76-90)</span>
            <p className="text-2xl font-bold font-heading text-primary tabular-nums">
              {baikCount} ASN
            </p>
            <p className="text-[11px] text-muted-foreground">
              {total > 0 ? ((baikCount / total) * 100).toFixed(1) : 0}% total tercatat
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Predikat Cukup (61-75)</span>
            <p className="text-2xl font-bold font-heading text-amber-600 tabular-nums">
              {cukupCount} ASN
            </p>
            <p className="text-[11px] text-muted-foreground">
              {total > 0 ? ((cukupCount / total) * 100).toFixed(1) : 0}% total tercatat
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Predikat Kurang / Buruk</span>
            <p className="text-2xl font-bold font-heading text-foreground tabular-nums">
              {kurangCount} ASN
            </p>
            <p className="text-[11px] text-rose-600 font-medium">Dalam pembinaan khusus</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Tabel Evaluasi SKP Pegawai
          </CardTitle>
          <CardDescription className="text-xs">
            Nilai SKP terintegrasi langsung sebagai prasyarat usulan kenaikan pangkat otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Jumlah Rencana Aksi</TableHead>
                <TableHead>Nilai Capaian</TableHead>
                <TableHead>Predikat Kinerja</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data SKP dari database...
                  </TableCell>
                </TableRow>
              ) : skpList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada data SKP yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                skpList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {item.pegawai_nama || item.pegawai_id}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.tahun}</TableCell>
                    <TableCell className="text-xs font-semibold tabular-nums">
                      {item.targets?.length || 0} Target Hasil Kerja
                    </TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600 tabular-nums">
                      {item.nilai_akhir ?? "-"}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          getBadgeColor("predikat_skp", item.predikat || "") === "emerald"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : getBadgeColor("predikat_skp", item.predikat || "") === "blue"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : getBadgeColor("predikat_skp", item.predikat || "") === "amber"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {getLabel("predikat_skp", item.predikat || "", item.predikat || "-")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          getBadgeColor("status_skp", item.status) === "emerald"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : getBadgeColor("status_skp", item.status) === "blue"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {getLabel("status_skp", item.status, item.status)}
                      </span>
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
