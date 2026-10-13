"use client";

import Link from "next/link";
import { useDiklatList } from "@/services";
import { GraduationCap, Plus, ArrowRight, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function MasterDiklatPage() {
  const { data: diklatList, loading } = useDiklatList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Katalog Master Pelatihan & Diklat ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola daftar program diklat kepemimpinan, teknis, dan fungsional terakreditasi BKN langsung dari database Supabase.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/diklat/usulan">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <GraduationCap className="h-4 w-4" />
              Antrean Usulan Pegawai
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => toast.info("Form pendaftaran master diklat baru dibuka.")}
            className="gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Katalog Diklat
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Katalog Pelatihan Terdaftar
          </CardTitle>
          <CardDescription className="text-xs">
            Pelatihan yang dapat dipilih oleh pegawai saat mengajukan usulan pengembangan kompetensi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Program Pelatihan</TableHead>
                <TableHead>Kategori / Jenis</TableHead>
                <TableHead>Lembaga Penyelenggara</TableHead>
                <TableHead>Jam Pelajaran (JP)</TableHead>
                <TableHead>Kompetensi yang Ditingkatkan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat katalog diklat dari database...
                  </TableCell>
                </TableRow>
              ) : diklatList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada katalog diklat yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                diklatList.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      {d.nama}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.jenis}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {d.penyelenggara}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-primary font-mono tabular-nums">
                      {d.jam_pelajaran} JP
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {d.kompetensi_terkait?.map((kt, i) => (
                          <span key={i} className="bg-muted px-2 py-0.5 rounded text-[10px]">
                            {kt}
                          </span>
                        ))}
                      </div>
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
