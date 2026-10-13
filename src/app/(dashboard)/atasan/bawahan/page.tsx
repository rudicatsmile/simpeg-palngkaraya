"use client";

import Link from "next/link";
import { usePegawaiList } from "@/services";
import { Users, Search, ArrowRight, UserCheck, Award, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function DaftarBawahanPage() {
  const { data: pegawaiList, loading: isLoading } = usePegawaiList();
  const bawahanList = pegawaiList.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Daftar Pegawai Bawahan Langsung
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitoring kondisi SDM, capaian kinerja SKP, dan rekapitulasi kehadiran staf di unit kerja Anda.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Tabel Bawahan Terdaftar di Dinas Pendidikan
          </CardTitle>
          <CardDescription className="text-xs">
            Klik nama atau tombol profil untuk melihat rekam jejak lengkap pegawai.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Golongan / Pangkat</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Status Kedudukan</TableHead>
                <TableHead>Capaian SKP</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat daftar bawahan...</p>
                  </TableCell>
                </TableRow>
              ) : (
                bawahanList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">
                        {item.gelar_depan ? `${item.gelar_depan} ` : ""}
                        {item.nama_lengkap}
                        {item.gelar_belakang ? `, ${item.gelar_belakang}` : ""}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-primary">{item.golongan}</span>
                    <span className="block text-[11px] text-muted-foreground">{item.pangkat}</span>
                  </TableCell>
                  <TableCell className="text-xs text-foreground max-w-xs truncate">
                    {item.jabatan_nama}
                  </TableCell>
                  <TableCell>
                    <Badge variant="disetujui">● {item.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-emerald-600">
                    Sangat Baik (94.50)
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/atasan/bawahan/${item.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
                        Profil Ringkas
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
