"use client";

import Link from "next/link";
import { usePegawaiList, useCutiList, useFormasiList } from "@/services";
import { Building2, Users, CheckCircle2, Clock, Layers, ArrowRight, HeartHandshake, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function KepalaPdDashboardPage() {
  const { data: pegawaiList, loading: loadingPegawai } = usePegawaiList();
  const { data: cutiList, loading: loadingCuti } = useCutiList();
  const { data: formasiList } = useFormasiList();

  const antreanPersetujuanTk2 = cutiList.filter((c) => c.status === "disetujui_atasan" || c.status === "diajukan");
  const totalPegawai = pegawaiList.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-indigo-800 p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="space-y-1">
          <Badge variant="secondary" className="text-[10px] font-bold text-primary mb-2">
            Peran: Kepala Perangkat Daerah
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dasbor Pimpinan Dinas Pendidikan dan Kebudayaan
          </h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">
            Drs. H. Suryadi, M.Si. • NIP. 196804151994031005 • Pembina Utama Muda (IV/c)
          </p>
        </div>
      </div>

      {/* 4 Kartu KPI Strategis PD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card interactive className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Pegawai Terdata</span>
            <p className="text-3xl font-extrabold font-heading text-foreground tabular-nums">
              {totalPegawai} ASN
            </p>
            <p className="text-[11px] text-muted-foreground">Aktif di Perangkat Daerah</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Persetujuan Tingkat 2</span>
            <p className="text-3xl font-extrabold font-heading text-amber-600 tabular-nums">
              {antreanPersetujuanTk2.length} Usulan
            </p>
            <p className="text-[11px] text-muted-foreground">Menunggu persetujuan Kepala PD</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Tingkat Kehadiran Rata-rata</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">
              96.8%
            </p>
            <p className="text-[11px] text-muted-foreground">Tertib presensi bulan berjalan</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Kebutuhan Formasi Baru</span>
            <p className="text-3xl font-extrabold font-heading text-indigo-600 tabular-nums">
              {formasiList.length} Formasi
            </p>
            <p className="text-[11px] text-muted-foreground">Kekurangan Guru & Teknis</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Persetujuan Tk. 2 & Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Persetujuan Usulan Masuk (Tingkat Kedua)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Usulan yang telah disetujui Atasan Langsung dan menunggu penetapan Kepala PD.
                  </CardDescription>
                </div>
                <Link href="/kepala-pd/persetujuan">
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {antreanPersetujuanTk2.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Tidak ada usulan yang menunggu persetujuan tingkat kedua.
                  </div>
                ) : (
                  antreanPersetujuanTk2.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{c.pegawai_nama}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Cuti {c.jenis} ({c.jumlah_hari} Hari Kerja) • Disetujui Atasan Langsung
                        </p>
                        <p className="text-[11px] text-foreground italic">"{c.alasan}"</p>
                      </div>
                      <Link href="/kepala-pd/persetujuan">
                        <Button size="sm" className="text-xs h-8">
                          Tindak Lanjuti
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                Pensiun Mendatang di Dinas (12 Bulan)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Drs. H. Suryadi, M.Si.</p>
                  <p className="text-[11px] text-muted-foreground">Kepala Dinas Pendidikan (IV/c)</p>
                </div>
                <Badge variant="warning">Mei 2028</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Wagiyo, S.Pd., M.Pd.</p>
                  <p className="text-[11px] text-muted-foreground">Pengawas Sekolah Madya (IV/b)</p>
                </div>
                <Badge variant="warning">November 2025</Badge>
              </div>
              <Link href="/kepala-pd/monitoring" className="block text-center pt-1">
                <span className="text-xs font-semibold text-primary hover:underline">
                  Lihat Monitoring Lengkap Pegawai Dinas →
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
