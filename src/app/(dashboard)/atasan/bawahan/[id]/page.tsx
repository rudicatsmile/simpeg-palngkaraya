import Link from "next/link";
import { pegawaiService } from "@/services";
import { ArrowLeft, User, Calendar, Award, Clock, Target, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Profil Bawahan Ringkas | SIMPEG Daerah",
};

export default async function ProfilBawahanRingkasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let pegawai = await pegawaiService.getById(id);
  if (!pegawai) {
    const all = await pegawaiService.getAll();
    pegawai = all[0];
  }

  if (!pegawai) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Data pegawai tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/atasan/bawahan">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Profil Ringkas Bawahan: {pegawai.nama_lengkap}
          </h1>
          <p className="text-xs text-muted-foreground">
            NIP: {pegawai.nip} • {pegawai.jabatan_nama} • {pegawai.pd_nama}
          </p>
        </div>
      </div>

      {/* 3 Kartu Ringkasan Indikator Bawahan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Kinerja SKP 2024</span>
            <p className="text-2xl font-bold font-heading text-emerald-600 tabular-nums">94.50</p>
            <p className="text-[11px] text-muted-foreground">Predikat: Sangat Baik</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Sisa Cuti Tahunan</span>
            <p className="text-2xl font-bold font-heading text-primary tabular-nums">9 Hari</p>
            <p className="text-[11px] text-muted-foreground">Jatah 12 Hari Kerja</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Keterlambatan Presensi</span>
            <p className="text-2xl font-bold font-heading text-foreground tabular-nums">1 Kali</p>
            <p className="text-[11px] text-muted-foreground">Bulan berjalan (Februari 2025)</p>
          </CardContent>
        </Card>
      </div>

      {/* Rincian Identitas & Riwayat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Identitas & Status Kepegawaian
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs divide-y divide-border/60">
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Pangkat / Golongan</span>
              <span className="font-semibold text-foreground">{pegawai.pangkat} ({pegawai.golongan})</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">TMT Golongan</span>
              <span className="font-mono text-foreground">{pegawai.tmt_golongan}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Pendidikan Terakhir</span>
              <span className="font-semibold text-foreground text-right">{pegawai.pendidikan_terakhir}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Surel Resmi</span>
              <span className="font-mono text-foreground">{pegawai.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Karier & Kenaikan Pangkat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs divide-y divide-border/60">
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Prediksi Kenaikan Pangkat</span>
              <span className="font-bold text-primary">1 April 2026 (180 Hari Lagi)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Status Disiplin</span>
              <Badge variant="disetujui">● Bebas Disiplin</Badge>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Batas Usia Pensiun</span>
              <span className="font-mono text-foreground">{pegawai.tanggal_pensiun}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
