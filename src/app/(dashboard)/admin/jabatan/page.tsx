"use client";

import { useState } from "react";
import { useJabatanList } from "@/services";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { Jabatan } from "@/types";
import { Briefcase, Plus, Edit3, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function MasterJabatanPage() {
  const { data: listJabatan, loading } = useJabatanList();
  const { getLabel, getBadgeColor } = useMasterReferensi();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Master Data Jabatan & Struktur Organisasi
          </h1>
          <p className="text-xs text-muted-foreground">
            Katalog jabatan struktural, fungsional, dan pelaksana beserta standar kompetensi wajib.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => toast.info("Form tambah master jabatan baru dibuka.")}
          className="gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Jabatan Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Daftar Jabatan Resmi di Lingkungan Pemerintah Daerah
          </CardTitle>
          <CardDescription className="text-xs">
            Standar kompetensi digunakan sebagai acuan rekomendasi diklat dan talent pool.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Jabatan</TableHead>
                <TableHead>Nama Jabatan</TableHead>
                <TableHead>Jenis Jabatan</TableHead>
                <TableHead>Eselon</TableHead>
                <TableHead>Syarat Standar Kompetensi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat daftar master jabatan...</p>
                  </TableCell>
                </TableRow>
              ) : listJabatan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada data jabatan terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                listJabatan.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {j.kode}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {j.nama}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        getBadgeColor("jenis_jabatan", j.jenis) === "indigo"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : getBadgeColor("jenis_jabatan", j.jenis) === "blue"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200"
                      }`}
                    >
                      {getLabel("jenis_jabatan", j.jenis, j.jenis)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {j.eselon || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {j.syarat_kompetensi.map((sk, idx) => (
                        <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info(`Edit jabatan: ${j.nama}`)}
                      className="text-xs h-8 text-primary"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
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
