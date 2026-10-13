"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAturanKepangkatanList, kepangkatanService } from "@/services";
import { AturanKepangkatan } from "@/types";
import { ArrowLeft, Sliders, Save, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AturanMasaKerjaKepangkatanPage() {
  const { data: initialList, loading } = useAturanKepangkatanList();
  const [listAturan, setListAturan] = useState<AturanKepangkatan[]>([]);

  useEffect(() => {
    setListAturan(initialList);
  }, [initialList]);

  const handleSaveAturan = async (id: string, tahunBaru: number) => {
    const ok = await kepangkatanService.updateAturan(id, {
      masa_tahun: tahunBaru,
      masa_bulan: tahunBaru * 12,
    });

    if (ok) {
      setListAturan((prev) =>
        prev.map((a) => (a.id === id ? { ...a, masa_tahun: tahunBaru, masa_bulan: tahunBaru * 12 } : a))
      );
      toast.success("Aturan Masa Kerja Berhasil Diperbarui!", {
        description: "Pembaruan aturan masa kerja tersimpan di database Supabase.",
      });
    } else {
      toast.error("Gagal memperbarui aturan masa kerja.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/kepangkatan">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Konfigurasi Aturan Masa Kerja Kepangkatan
          </h1>
          <p className="text-xs text-muted-foreground">
            Pengaturan parameter masa kerja kenaikan pangkat reguler dan checklist syarat langsung terhubung ke database Supabase.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            Parameter Masa Kerja Golongan Ruang
          </CardTitle>
          <CardDescription className="text-xs">
            Sistem job scheduler harian menggunakan parameter ini untuk menghitung prediksi TMT secara otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dari Golongan</TableHead>
                <TableHead>Ke Golongan</TableHead>
                <TableHead>Masa Kerja Minimal</TableHead>
                <TableHead>Checklist Syarat Wajib</TableHead>
                <TableHead>Berlaku Sejak</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat konfigurasi aturan dari Supabase...
                  </TableCell>
                </TableRow>
              ) : listAturan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Belum ada aturan masa kerja yang tersimpan.
                  </TableCell>
                </TableRow>
              ) : (
                listAturan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-xs text-primary">
                      Golongan {item.golongan_dari}
                    </TableCell>
                    <TableCell className="font-bold text-xs text-emerald-600">
                      Golongan {item.golongan_ke}
                    </TableCell>
                    <TableCell className="text-xs font-semibold tabular-nums">
                      {item.masa_tahun} Tahun ({item.masa_bulan} Bulan)
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      <ul className="list-disc pl-4 space-y-0.5">
                        {item.checklist.map((chk, i) => (
                          <li key={i}>{chk}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.berlaku_mulai}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSaveAturan(
                            item.id,
                            item.masa_tahun === 4 ? 3 : 4
                          )
                        }
                        className="text-xs h-8"
                      >
                        Ubah Masa Kerja
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
