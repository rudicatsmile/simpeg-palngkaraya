import Link from "next/link";
import { ArrowLeft, Fingerprint, Plus, Key, Wifi, WifiOff, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata = {
  title: "Perangkat Absensi Fingerprint | SIMPEG Daerah",
};

export default function PerangkatAbsensiPage() {
  const devices = [
    {
      id: "FP-DISDIK-01",
      nama: "Fingerprint Terminal Lobby Utama Dinas Pendidikan",
      lokasi: "Gedung A Lantai 1",
      ip: "192.168.10.201",
      apiKeyMasked: "sec_live_9f82••••••••3a71",
      statusKoneksi: "Online",
      terakhirSinkron: "2 menit yang lalu",
    },
    {
      id: "FP-BKPSDM-01",
      nama: "Fingerprint Lobby Pelayanan BKPSDM",
      lokasi: "Gedung C Lantai 1",
      ip: "192.168.1.55",
      apiKeyMasked: "sec_live_12c4••••••••88d9",
      statusKoneksi: "Online",
      terakhirSinkron: "1 menit yang lalu",
    },
    {
      id: "FP-DPUPR-01",
      nama: "Terminal Presensi Workshop Bina Marga",
      lokasi: "Workshop PUPR Nusantara",
      ip: "192.168.4.10",
      apiKeyMasked: "sec_live_55a1••••••••99f2",
      statusKoneksi: "Offline",
      terakhirSinkron: "3 jam yang lalu",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/absensi">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Konfigurasi Perangkat Terminal Presensi
          </h1>
          <p className="text-xs text-muted-foreground">
            Daftar mesin fingerprint terhubung melalui HMAC API signature (`ATTENDANCE_INGEST_SECRET`).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-primary" />
            Terminal Presensi Terdaftar di Pemerintah Daerah
          </CardTitle>
          <CardDescription className="text-xs">
            Kunci API digunakan oleh driver perangkat untuk mengirim data presensi secara aman.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Nama Perangkat & Lokasi</TableHead>
                <TableHead>Alamat IP</TableHead>
                <TableHead>Kunci API (Tersamar)</TableHead>
                <TableHead>Konektivitas</TableHead>
                <TableHead>Sinkronisasi Terakhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    {d.id}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{d.nama}</span>
                    <span className="text-[11px] text-muted-foreground">{d.lokasi}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {d.ip}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {d.apiKeyMasked}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.statusKoneksi === "Online" ? "disetujui" : "ditolak"}>
                      ● {d.statusKoneksi.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {d.terakhirSinkron}
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
