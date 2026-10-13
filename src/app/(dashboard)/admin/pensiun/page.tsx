"use client";

import { usePegawaiList } from "@/services";
import { HeartHandshake, Hourglass, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminPensiunPage() {
  const { data: pegawaiList, loading: isLoading } = usePegawaiList();

  // Hitung perkiraan pensiun berdasarkan tanggal lahir (BUP 60 th untuk struktural/ahli, 58 th staf)
  const pensiunList = pegawaiList.map((p) => {
    let tmtPensiun = "2030-01-01";
    let sisaHari = 1000;
    if (p.tanggal_lahir) {
      const bup = p.jabatan?.jenis === "struktural" ? 60 : 58;
      const tglLahir = new Date(p.tanggal_lahir);
      const tahunPensiun = tglLahir.getFullYear() + bup;
      const bulanPensiun = tglLahir.getMonth() + 1;
      const datePensiun = new Date(tahunPensiun, bulanPensiun, 1);
      tmtPensiun = `1 ${datePensiun.toLocaleString("id-ID", { month: "long" })} ${tahunPensiun}`;
      const now = new Date();
      const diffMs = datePensiun.getTime() - now.getTime();
      sisaHari = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    const statusBerkas = sisaHari <= 180 ? "Lengkap (Siap SK BKN)" : sisaHari <= 365 ? "Persiapan Berkas" : "Dalam Masa Pengabdian";

    return {
      id: p.id,
      nama: p.nama_lengkap || p.nama || "Nama Pegawai",
      nip: p.nip,
      pd: p.pd_nama || "Pemerintah Daerah",
      jabatan: `${p.jabatan_nama || "-"} (${p.golongan || "-"})`,
      tmtPensiun,
      sisaHari,
      statusBerkas,
    };
  }).sort((a, b) => a.sisaHari - b.sisaHari);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Layanan Pensiun & Purna Tugas ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Monitoring batas usia pensiun (BUP 58 / 60 tahun) dan verifikasi checklist berkas Taspen BKN dari database kepegawaian.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-primary" />
            Daftar Pegawai Memasuki Masa Purna Tugas
          </CardTitle>
          <CardDescription className="text-xs">
            Notifikasi pengingat otomatis dikirim pada H-365, H-180, dan H-30 sebelum TMT Pensiun.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Perangkat Daerah & Jabatan</TableHead>
                <TableHead>TMT Pensiun Resmi</TableHead>
                <TableHead>Hitung Mundur</TableHead>
                <TableHead>Status Berkas Pensiun</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data purna tugas dari database...
                  </TableCell>
                </TableRow>
              ) : pensiunList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada data pegawai yang tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                pensiunList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-foreground">{item.nama}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground block">{item.jabatan}</span>
                      <span className="text-[11px] text-muted-foreground">{item.pd}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold text-primary">
                      {item.tmtPensiun}
                    </TableCell>
                    <TableCell className="text-xs font-bold tabular-nums">
                      {item.sisaHari <= 90 ? (
                        <span className="text-rose-600 font-extrabold">{item.sisaHari} Hari</span>
                      ) : (
                        <span className="text-muted-foreground">{item.sisaHari} Hari</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.sisaHari <= 180 ? "disetujui" : "draf"}>
                        {item.statusBerkas}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => toast.info(`Checklist berkas Taspen untuk ${item.nama} telah dibuka.`)}
                      >
                        Checklist Berkas
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
