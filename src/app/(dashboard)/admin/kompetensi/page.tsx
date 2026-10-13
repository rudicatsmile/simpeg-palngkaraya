import { Sparkles, TrendingUp, Award, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata = {
  title: "Kompetensi & Analisis Gap Jabatan | SIMPEG Daerah",
};

export default function AnalisisKompetensiPage() {
  const gapList = [
    {
      jabatan: "Kepala Seksi Pembinaan SMP",
      pegawai: "Dr. Budi Santoso, S.E., M.M.",
      kompetensi: "Kepemimpinan Pengawas",
      standar: 4,
      dimiliki: 4,
      gap: 0,
      status: "Memenuhi Standar",
    },
    {
      jabatan: "Analis Kepegawaian Ahli Muda",
      pegawai: "Hj. Dewi Lestari, S.Sos., M.AP.",
      kompetensi: "Transformasi Digital ASN & SPBE",
      standar: 4,
      dimiliki: 3,
      gap: -1,
      status: "Kesenjangan (Disarankan Bimtek)",
    },
    {
      jabatan: "Staf Bidang Bina Marga",
      pegawai: "Ahmad Fauzan, S.T.",
      kompetensi: "Pengawasan Konstruksi Jalan & Jembatan",
      standar: 3,
      dimiliki: 3,
      gap: 0,
      status: "Memenuhi Standar",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Standar Kompetensi & Analisis Kesenjangan (Gap)
        </h1>
        <p className="text-xs text-muted-foreground">
          Pemetaan tingkat kemahiran pegawai terhadap standar kompetensi manajerial, sosio-kultural, dan teknis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pegawai Memenuhi Standar</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">88.4%</p>
            <p className="text-[11px] text-muted-foreground">Kompetensi sesuai jabatan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pegawai Memerlukan Diklat</span>
            <p className="text-3xl font-extrabold font-heading text-amber-600 tabular-nums">11.6%</p>
            <p className="text-[11px] text-muted-foreground">Rekomendasi bimtek terbit</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Standar Kompetensi Aktif</span>
            <p className="text-3xl font-extrabold font-heading text-primary tabular-nums">48 Unit</p>
            <p className="text-[11px] text-muted-foreground">Kamus kompetensi daerah</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Matriks Analisis Kesenjangan Kompetensi per Jabatan
          </CardTitle>
          <CardDescription className="text-xs">
            Sistem rule-based otomatis mendeteksi celah kompetensi dan mengaitkannya ke katalog diklat.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jabatan & Pemegang</TableHead>
                <TableHead>Kompetensi yang Diuji</TableHead>
                <TableHead>Standar Level (1-5)</TableHead>
                <TableHead>Level Dimiliki (1-5)</TableHead>
                <TableHead>Selisih Gap</TableHead>
                <TableHead className="text-right">Status Evaluasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gapList.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-foreground">{item.jabatan}</p>
                      <p className="text-[11px] text-muted-foreground">{item.pegawai}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {item.kompetensi}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold">
                    Level {item.standar}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-primary">
                    Level {item.dimiliki}
                  </TableCell>
                  <TableCell className="text-xs font-bold tabular-nums">
                    {item.gap === 0 ? (
                      <span className="text-emerald-600">0 (Sesuai)</span>
                    ) : (
                      <span className="text-amber-600">{item.gap} (Kurang)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.gap === 0 ? "disetujui" : "warning"}>
                      {item.status}
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
