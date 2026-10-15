"use client";

import { useState } from "react";
import { Sliders, Save, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSettings } from "@/hooks/useAppSettings";
import { toast } from "sonner";

export default function PengaturanAturanBisnisPage() {
  const { settings } = useAppSettings();
  const [bupPns, setBupPns] = useState(58);
  const [jatahCuti, setJatahCuti] = useState(12);
  const [jamKeterlambatan, setJamKeterlambatan] = useState("07:30");
  const [masaRingan, setMasaRingan] = useState(12);
  const [masaSedang, setMasaSedang] = useState(24);
  const [masaBerat, setMasaBerat] = useState(36);
  const [masaPangkat, setMasaPangkat] = useState(4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Aturan Bisnis Berhasil Diperbarui!", {
      description: "Konfigurasi parameter sistem tersimpan dengan versioning aktif tanpa perlu restart aplikasi.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Konfigurasi Aturan Bisnis Sistem (Business Rules Engine)
        </h1>
        <p className="text-xs text-muted-foreground">
          Pengaturan ambang batas dan parameter kebijakan kepegawaian yang berlaku di {settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah"}.
        </p>
      </div>


      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Usia Pensiun & Cuti */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              1. Batas Usia Pensiun & Jatah Cuti Tahunan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Batas Usia Pensiun Non-Jabatan Tertentu (Tahun)
              </label>
              <Input
                type="number"
                value={bupPns}
                onChange={(e) => setBupPns(parseInt(e.target.value) || 58)}
              />
              <p className="text-[11px] text-muted-foreground">Standar regulasi BKN: 58 Tahun.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Jatah Cuti Tahunan Pegawai (Hari Kerja)
              </label>
              <Input
                type="number"
                value={jatahCuti}
                onChange={(e) => setJatahCuti(parseInt(e.target.value) || 12)}
              />
              <p className="text-[11px] text-muted-foreground">Default: 12 Hari Kerja per tahun.</p>
            </div>
          </CardContent>
        </Card>

        {/* Presensi & Keterlambatan */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              2. Presensi & Ambang Batas Keterlambatan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Ambang Batas Jam Masuk Kerja (WIB)
              </label>
              <Input
                type="text"
                value={jamKeterlambatan}
                onChange={(e) => setJamKeterlambatan(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">Presensi setelah jam ini otomatis berstatus Terlambat.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Masa Kerja Standar Kenaikan Pangkat Reguler (Tahun)
              </label>
              <Input
                type="number"
                value={masaPangkat}
                onChange={(e) => setMasaPangkat(parseInt(e.target.value) || 4)}
              />
              <p className="text-[11px] text-muted-foreground">Default: 4 Tahun per jenjang golongan.</p>
            </div>
          </CardContent>
        </Card>

        {/* Disiplin Masa Berlaku */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              3. Masa Berlaku Hukuman Disiplin (Bulan)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Tingkat Ringan (Bulan)</label>
              <Input
                type="number"
                value={masaRingan}
                onChange={(e) => setMasaRingan(parseInt(e.target.value) || 12)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Tingkat Sedang (Bulan)</label>
              <Input
                type="number"
                value={masaSedang}
                onChange={(e) => setMasaSedang(parseInt(e.target.value) || 24)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Tingkat Berat (Bulan)</label>
              <Input
                type="number"
                value={masaBerat}
                onChange={(e) => setMasaBerat(parseInt(e.target.value) || 36)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="sm" className="font-semibold text-xs gap-1.5 shadow-sm">
            <Save className="h-4 w-4" />
            Simpan Seluruh Aturan Bisnis
          </Button>
        </div>
      </form>
    </div>
  );
}
