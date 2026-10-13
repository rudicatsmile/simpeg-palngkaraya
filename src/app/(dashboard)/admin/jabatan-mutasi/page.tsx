import Link from "next/link";
import { Briefcase, Plus, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata = {
  title: "Jabatan & Mutasi ASN | SIMPEG Daerah",
};

export default function JabatanMutasiPage() {
  const usulanMutasi = [
    {
      id: "mut-1",
      nama: "Ahmad Fauzan, S.T.",
      nip: "198811172012101001",
      jenis: "Mutasi",
      pd_asal: "Dinas Pekerjaan Umum & Penataan Ruang",
      pd_tujuan: "Sekretariat Daerah",
      jabatan_tujuan: "Pengelola Pengadaan Barang/Jasa Ahli Muda",
      status: "verifikasi",
      tanggal: "15 Januari 2025",
    },
    {
      id: "mut-2",
      nama: "Siti Rahmawati, S.Pd.",
      nip: "199203042019032008",
      jenis: "Rotasi",
      pd_asal: "Dinas Pendidikan dan Kebudayaan",
      pd_tujuan: "Dinas Pendidikan dan Kebudayaan",
      jabatan_tujuan: "Guru Ahli Pertama - SMP Negeri 01 Nusantara",
      status: "disetujui",
      tanggal: "10 Januari 2025",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pengelolaan Jabatan & Mutasi Pegawai
          </h1>
          <p className="text-xs text-muted-foreground">
            Usulan mutasi antar instansi, rotasi internal, promosi jabatan, dan pengecekan formasi.
          </p>
        </div>
        <Link href="/admin/jabatan-mutasi/baru">
          <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
            <Plus className="h-4 w-4" />
            Buat Usulan Mutasi Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Daftar Usulan Mutasi, Rotasi, dan Promosi
          </CardTitle>
          <CardDescription className="text-xs">
            Setiap usulan divalidasi ketersediaan formasinya sebelum SK diterbitkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Jenis Alih Tugas</TableHead>
                <TableHead>Perangkat Daerah Asal</TableHead>
                <TableHead>Tujuan & Jabatan Baru</TableHead>
                <TableHead>Tanggal Usulan</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usulanMutasi.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{m.nama}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">NIP. {m.nip}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.jenis === "Mutasi" ? "default" : "secondary"}>
                      {m.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {m.pd_asal}
                  </TableCell>
                  <TableCell className="text-xs max-w-xs truncate">
                    <span className="font-semibold text-foreground block">{m.jabatan_tujuan}</span>
                    <span className="text-[11px] text-muted-foreground">{m.pd_tujuan}</span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{m.tanggal}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={m.status === "disetujui" ? "disetujui" : "diajukan"}>
                      {m.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
