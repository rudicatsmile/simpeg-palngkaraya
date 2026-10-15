"use client";

import Link from "next/link";
import { useState } from "react";
import { useDokumenList } from "@/services";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { FileText, Eye, Filter, Download, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function AdminDokumenPage() {
  const [filterKat, setFilterKat] = useState("all");
  const { data: dokumenList, loading } = useDokumenList();
  const { getOptions: getMasterOptions, getLabel: getMasterLabel } = useMasterReferensi();

  const optKategoriDokumen = getMasterOptions("kategori_dokumen");
  const filtered = filterKat === "all" ? dokumenList : dokumenList.filter((d) => d.kategori === filterKat);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Repositori Dokumen & Arsip Digital ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Pusat penyimpanan terenkripsi berkas SK, sertifikat, dan ijazah seluruh pegawai daerah dari database Supabase.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-foreground">Filter Kategori Dokumen:</span>
          <select
            className="flex h-9 rounded-lg border border-input bg-card px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            value={filterKat}
            onChange={(e) => setFilterKat(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            {optKategoriDokumen.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Daftar Berkas Digital Terverifikasi
          </CardTitle>
          <CardDescription className="text-xs">
            Seluruh berkas terproteksi signed URL dengan masa berlaku 300 detik.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Berkas / Dokumen</TableHead>
                <TableHead>Pemilik Dokumen</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Versi</TableHead>
                <TableHead>Status Persetujuan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat repositori dokumen dari database...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada berkas dokumen yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dok) => (
                  <TableRow key={dok.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground">{dok.judul}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">{dok.storage_path}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {dok.pegawai_nama}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{dok.kategori}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">v{dok.versi}</TableCell>
                    <TableCell>
                      <Badge variant={dok.status_persetujuan === "disetujui" ? "disetujui" : "diajukan"}>
                        {dok.status_persetujuan.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/dokumen/${dok.id}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          Detail & Versi
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
