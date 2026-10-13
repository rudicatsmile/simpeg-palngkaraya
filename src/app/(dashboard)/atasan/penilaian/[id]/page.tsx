"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { kinerjaService } from "@/services";
import { SKP } from "@/types";
import { ArrowLeft, Target, Award, CheckCircle2, Save, Calculator, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

const defaultTargets = [
  { id: "target-1", uraian: "Penyusunan Kurikulum dan Modul Pembelajaran", target: "12", satuan: "Modul", realisasi: "12", bobot: 40 },
  { id: "target-2", uraian: "Pelaksanaan Monitoring dan Evaluasi Guru", target: "24", satuan: "Laporan", realisasi: "24", bobot: 35 },
  { id: "target-3", uraian: "Pengelolaan Administrasi Kepegawaian Bidang", target: "100", satuan: "%", realisasi: "100", bobot: 25 },
];

export default function FormPenilaianSKPPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [skp, setSkp] = useState<SKP | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scores, setScores] = useState<Record<string, number>>({
    "target-1": 95,
    "target-2": 95,
    "target-3": 93,
  });

  useEffect(() => {
    async function loadData() {
      try {
        let data = await kinerjaService.getById(id);
        if (!data) {
          const list = await kinerjaService.getSKP();
          data = list[0] || null;
        }
        setSkp(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const targets = defaultTargets;

  // Kalkulasi nilai tertimbang otomatis
  const hitungNilaiAkhir = () => {
    let totalScore = 0;
    targets.forEach((tgt) => {
      const s = scores[tgt.id] || 0;
      totalScore += (s * tgt.bobot) / 100;
    });
    return Math.round(totalScore * 10) / 10;
  };

  const nilaiAkhir = hitungNilaiAkhir();

  const getPredikat = (n: number) => {
    if (n >= 91) return "Sangat Baik";
    if (n >= 76) return "Baik";
    if (n >= 61) return "Cukup";
    if (n >= 51) return "Kurang";
    return "Sangat Kurang";
  };

  const predikat = getPredikat(nilaiAkhir);

  const handleSimpanPenilaian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skp) return;
    try {
      setIsSubmitting(true);
      await kinerjaService.update(skp.id, {
        nilai_akhir: nilaiAkhir,
        predikat,
        status: "disetujui",
      });
      toast.success("Penilaian SKP Berhasil Difinalisasi!", {
        description: `Nilai akhir pegawai ditetapkan: ${nilaiAkhir} (Predikat: ${predikat}).`,
      });
      router.push("/atasan/penilaian");
    } catch {
      toast.error("Gagal menyimpan penilaian SKP");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!skp) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Data SKP tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/atasan/penilaian">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Form Evaluasi & Penilaian SKP: {skp.pegawai_nama}
          </h1>
          <p className="text-xs text-muted-foreground">
            Tahun Penilaian: {skp.tahun} • Masukkan skor penilaian untuk masing-masing target rencana kerja.
          </p>
        </div>
      </div>

      {/* Kalkulasi Ringkasan Nilai & Predikat Otomatis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Nilai Akhir Rata-rata Tertimbang</span>
              <p className="text-3xl font-extrabold font-heading text-primary tabular-nums">
                {nilaiAkhir} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
              </p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Predikat Kinerja</span>
              <div>
                <Badge variant="disetujui" className="text-xs font-bold px-3 py-1">
                  ● {predikat.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col justify-center text-xs text-muted-foreground space-y-1 border-border">
          <p className="font-semibold text-foreground">Standar Predikat Peraturan BKN:</p>
          <p>• 91 – 100: Sangat Baik | 76 – 90: Baik</p>
          <p>• 61 – 75: Cukup | 51 – 60: Kurang | &lt; 51: Sangat Kurang</p>
        </Card>
      </div>

      {/* Form Tabel Penilaian per Target */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Evaluasi Rencana Kinerja & Realisasi Pegawai
          </CardTitle>
          <CardDescription className="text-xs">
            Nilai dihitung otomatis secara proporsional sesuai persentase bobot masing-masing aspek.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSimpanPenilaian} className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Uraian Rencana Kerja</TableHead>
                  <TableHead>Target Pegawai</TableHead>
                  <TableHead>Realisasi Riil</TableHead>
                  <TableHead>Bobot (%)</TableHead>
                  <TableHead className="w-32 text-right">Skor Nilai (1-100)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targets.map((tgt) => (
                  <TableRow key={tgt.id}>
                    <TableCell className="font-semibold text-xs text-foreground max-w-md">
                      {tgt.uraian}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {tgt.target} {tgt.satuan}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-emerald-600">
                      {tgt.realisasi} {tgt.satuan}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums font-semibold">
                      {tgt.bobot}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        required
                        className="h-8 w-24 text-right ml-auto font-mono text-xs font-bold"
                        value={scores[tgt.id] || 0}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            [tgt.id]: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href="/atasan/penilaian">
                <Button variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" size="sm" className="font-semibold text-xs gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                Finalisasi & Simpan Penilaian SKP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
