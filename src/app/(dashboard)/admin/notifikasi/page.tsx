import Link from "next/link";
import { Bell, MessageSquare, Mail, Sliders, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata = {
  title: "Pusat Notifikasi & Log Pengiriman | SIMPEG Daerah",
};

export default function AdminNotifikasiLogPage() {
  const notifLogs = [
    {
      channel: "whatsapp",
      penerima: "681234567890 (Dr. Budi Santoso)",
      template: "Peringatan H-180 Kenaikan Pangkat",
      status: "terkirim",
      percobaan: 1,
      waktu: "10 Okt 2025 08:00:15 WIB",
    },
    {
      channel: "email",
      penerima: "budi.santoso@nusantarajaya.go.id",
      template: "Pemberitahuan Persetujuan Cuti Tahunan",
      status: "terkirim",
      percobaan: 1,
      waktu: "5 Agu 2025 09:12:00 WIB",
    },
    {
      channel: "whatsapp",
      penerima: "681377889900 (Ahmad Fauzan)",
      template: "Notifikasi Kenaikan Gaji Berkala (KGB)",
      status: "terkirim",
      percobaan: 1,
      waktu: "1 Agu 2025 10:15:30 WIB",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pusat Notifikasi & Log Multi-channel
          </h1>
          <p className="text-xs text-muted-foreground">
            Pemantauan pengiriman pesan gateway WhatsApp, email SMTP, dan in-app real-time.
          </p>
        </div>
        <Link href="/admin/notifikasi/template">
          <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
            <Sliders className="h-4 w-4" />
            Kelola Template Pesan WhatsApp
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">WhatsApp Gateway Aktif</span>
            <p className="text-2xl font-bold font-heading text-emerald-600">Terhubung (Online)</p>
            <p className="text-[11px] text-muted-foreground">Tingkat keberhasilan kirim: 99.4%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Server Email (SMTP)</span>
            <p className="text-2xl font-bold font-heading text-primary">Normal</p>
            <p className="text-[11px] text-muted-foreground">Port 587 TLS terproteksi</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Notifikasi Bulan Ini</span>
            <p className="text-2xl font-bold font-heading text-indigo-600 tabular-nums">1.480 Pesan</p>
            <p className="text-[11px] text-muted-foreground">Kenaikan pangkat, cuti, & SKP</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Log Riwayat Pengiriman Notifikasi
          </CardTitle>
          <CardDescription className="text-xs">
            Pesan yang gagal otomatis diulang maksimal 3 kali dengan jeda eksponensial.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Saluran Kanal</TableHead>
                <TableHead>Penerima Notifikasi</TableHead>
                <TableHead>Nama Template Pesan</TableHead>
                <TableHead>Waktu Terkirim</TableHead>
                <TableHead>Percobaan</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifLogs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Badge variant={log.channel === "whatsapp" ? "disetujui" : "default"}>
                      {log.channel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {log.penerima}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.template}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {log.waktu}
                  </TableCell>
                  <TableCell className="text-xs font-mono tabular-nums">
                    Ke-{log.percobaan}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="disetujui">TERKIRIM</Badge>
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
