"use client";

import { useTalentPoolList } from "@/services";
import { TrendingUp, Award, Users, CheckCircle2, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function AdminTalentPoolPage() {
  const { data: talentList, loading } = useTalentPoolList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Talent Pool & Peta Rencana Suksesi Jabatan
          </h1>
          <p className="text-xs text-muted-foreground">
            Identifikasi ASN berkinerja tinggi (SKP Sangat Baik 2 tahun terakhir) untuk kaderisasi jabatan strategis daerah dari database Supabase.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Daftar Kader Talenta Terbaik Kabupaten Nusantara Jaya
          </CardTitle>
          <CardDescription className="text-xs">
            Kandidat diurutkan berdasarkan matriks kompetensi dan rekam jejak integritas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Instansi Asal</TableHead>
                <TableHead>Jabatan Suksesi Target</TableHead>
                <TableHead>Tingkat Kesiapan</TableHead>
                <TableHead>Evaluasi SKP 2 Thn</TableHead>
                <TableHead>Catatan Dewan Pertimbangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data talent pool dari database...
                  </TableCell>
                </TableRow>
              ) : talentList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada data kader talenta yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                talentList.map((tp) => (
                  <TableRow key={tp.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-foreground">{tp.pegawai_nama}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">NIP. {tp.nip}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {tp.pd_nama}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-primary">
                      {tp.jabatan_target_nama}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tp.kesiapan === "siap_sekarang"
                            ? "disetujui"
                            : tp.kesiapan === "siap_1_2_tahun"
                            ? "diajukan"
                            : "menunggu"
                        }
                      >
                        {tp.kesiapan ? tp.kesiapan.replace(/_/g, " ").toUpperCase() : "SIAP SEKARANG"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600">
                      {tp.nilai_skp_2thn}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      {tp.catatan}
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
