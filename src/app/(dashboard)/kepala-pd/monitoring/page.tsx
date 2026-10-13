"use client";

import { usePegawaiList } from "@/services";
import { Users, Building2, Award, HeartHandshake, Layers, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function MonitoringPegawaiPdPage() {
  const { data: pdPegawai, loading: isLoading } = usePegawaiList();

  const gol4 = pdPegawai.filter((p) => p.golongan?.startsWith("IV")).length;
  const gol3 = pdPegawai.filter((p) => p.golongan?.startsWith("III")).length;
  const pppk = pdPegawai.filter((p) => p.status_kepegawaian === "PPPK" || p.golongan?.startsWith("IX")).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Monitoring Pegawai Lingkup Perangkat Daerah
        </h1>
        <p className="text-xs text-muted-foreground">
          Peta sebaran jabatan, komposisi golongan, dan proyeksi suksesi aparatur perangkat daerah.
        </p>
      </div>

      {/* 3 Kartu Komposisi Golongan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pejabat Pembina (Golongan IV)</span>
            <p className="text-3xl font-extrabold font-heading text-foreground tabular-nums">{gol4} ASN</p>
            <p className="text-[11px] text-muted-foreground">Eselon II & Pengawas Madya</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pejabat Penata (Golongan III)</span>
            <p className="text-3xl font-extrabold font-heading text-indigo-600 tabular-nums">{gol3} ASN</p>
            <p className="text-[11px] text-muted-foreground">Kasi, Staf Analis, & Guru Ahli</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">PPPK Fungsional / Lainnya</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">{pppk} ASN</p>
            <p className="text-[11px] text-muted-foreground">Guru Ahli Pertama & Tenaga Teknis</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Pegawai Lingkup Dinas */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Daftar Aparatur Sipil Negara di Dinas Pendidikan
          </CardTitle>
          <CardDescription className="text-xs">
            Data kepegawaian internal perangkat daerah sesuai hak akses Bab 5 PRD.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Status Kedudukan</TableHead>
                <TableHead>Pangkat / Golongan</TableHead>
                <TableHead>Jabatan Dinas</TableHead>
                <TableHead>TMT Golongan</TableHead>
                <TableHead>Proyeksi Pensiun</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat data pegawai...</p>
                  </TableCell>
                </TableRow>
              ) : pdPegawai.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada data pegawai di perangkat daerah ini.
                  </TableCell>
                </TableRow>
              ) : (
                pdPegawai.map((peg) => (
                <TableRow key={peg.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">
                        {peg.gelar_depan ? `${peg.gelar_depan} ` : ""}
                        {peg.nama_lengkap}
                        {peg.gelar_belakang ? `, ${peg.gelar_belakang}` : ""}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {peg.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={peg.status_kepegawaian === "PNS" ? "default" : "secondary"}>
                      {peg.status_kepegawaian}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-primary">{peg.golongan}</span>
                    <span className="block text-[11px] text-muted-foreground">{peg.pangkat}</span>
                  </TableCell>
                  <TableCell className="text-xs text-foreground max-w-xs truncate">
                    {peg.jabatan_nama}
                  </TableCell>
                  <TableCell className="text-xs font-mono">{peg.tmt_golongan}</TableCell>
                  <TableCell className="text-xs font-mono text-amber-600 font-semibold">
                    {peg.tanggal_pensiun}
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
