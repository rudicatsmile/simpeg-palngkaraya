"use client";

import Link from "next/link";
import { usePegawaiList, useCutiList } from "@/services";
import { Users, CheckCircle2, Clock, Award, Calendar, ArrowRight, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AtasanDashboardPage() {
  const { data: pegawaiList, loading: loadingPegawai } = usePegawaiList();
  const { data: cutiList, loading: loadingCuti } = useCutiList();

  const bawahanList = pegawaiList.slice(0, 4);
  const antreanPersetujuan = cutiList.filter((c) => c.status === "diajukan" || c.status === "disetujui_atasan");

  return (
    <div className="space-y-6">
      {/* Header Banner Atasan */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-indigo-800 p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="space-y-1">
          <Badge variant="secondary" className="text-[10px] font-bold text-primary mb-2">
            Peran: Atasan Langsung
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dasbor Pengawasan & Persetujuan Atasan
          </h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">
            Drs. H. Suryadi, M.Si. • Kepala Dinas Pendidikan & Kebudayaan
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card interactive className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Jumlah Bawahan Langsung</span>
            <p className="text-3xl font-extrabold font-heading text-foreground tabular-nums">
              {bawahanList.length} Orang
            </p>
            <p className="text-[11px] text-muted-foreground">Aktif di Dinas Pendidikan</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Antrean Persetujuan Cuti</span>
            <p className="text-3xl font-extrabold font-heading text-amber-600 tabular-nums">
              {antreanPersetujuan.length} Usulan
            </p>
            <p className="text-[11px] text-muted-foreground">Memerlukan telaah Anda</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Akan Naik Pangkat (H-180)</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">
              1 Orang
            </p>
            <p className="text-[11px] text-muted-foreground">Dr. Budi Santoso (1 April 2026)</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Penilaian SKP Bawahan</span>
            <p className="text-3xl font-extrabold font-heading text-indigo-600 tabular-nums">
              100%
            </p>
            <p className="text-[11px] text-muted-foreground">Seluruh target telah dinilai</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Antrean & Bawahan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Antrean Persetujuan Usulan Bawahan */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Antrean Permohonan Cuti Bawahan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tinjau dan berikan rekomendasi persetujuan tingkat pertama.
                  </CardDescription>
                </div>
                <Link href="/atasan/persetujuan">
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {antreanPersetujuan.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Tidak ada usulan cuti yang memerlukan persetujuan saat ini.
                  </div>
                ) : (
                  antreanPersetujuan.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{c.pegawai_nama}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Cuti {c.jenis} • {c.jumlah_hari} Hari Kerja ({c.tanggal_mulai} s.d. {c.tanggal_selesai})
                        </p>
                        <p className="text-[11px] text-foreground italic">"{c.alasan}"</p>
                      </div>
                      <Link href={`/atasan/persetujuan/${c.id}`}>
                        <Button size="sm" className="text-xs h-8">
                          Tinjau Usulan
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Bawahan Langsung */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Bawahan Langsung
                </CardTitle>
                <Link href="/atasan/bawahan">
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Kelola
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {bawahanList.map((b) => (
                <div key={b.id} className="p-3.5 flex items-center justify-between hover:bg-muted/30">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">{b.nama_lengkap}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      NIP. {b.nip} • {b.golongan}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{b.jabatan_nama}</p>
                  </div>
                  <Link href={`/atasan/bawahan/${b.id}`}>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Profil
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
