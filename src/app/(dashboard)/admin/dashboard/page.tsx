"use client";

import Link from "next/link";
import { useDashboardStats, usePerubahanDataList, useUsulanPangkatList, useCutiList } from "@/services";
import { useAppSettings } from "@/hooks/useAppSettings";

import {
  Users,
  Award,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Layers,
  Settings,
  BellRing,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { stats, loading: loadingStats } = useDashboardStats();
  const { settings } = useAppSettings();
  const { data: perubahanDataList, loading: loadingPerubahan } = usePerubahanDataList();
  const { data: usulanPangkatList } = useUsulanPangkatList();
  const { data: cutiList } = useCutiList();

  const antreanVerifikasi = perubahanDataList.filter((d) => d.status === "diajukan").length;
  const totalUsulanPangkat = usulanPangkatList.length || stats.totalUsulanPangkat;
  const totalCutiAktif = cutiList.length || stats.totalCutiMenunggu;

  return (
    <div className="space-y-6">
      {/* Banner Admin */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-slate-900 via-primary to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1">
          <Badge variant="secondary" className="text-[10px] font-bold text-primary mb-2">
            Hak Akses Penuh: Super Admin & Operator BKPSDM
          </Badge>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pusat Kendali Manajemen Kepegawaian Daerah
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            {settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah"} • Terhubung Langsung ke Pangkalan Data Supabase PostgreSQL
          </p>
        </div>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card interactive className="border-l-4 border-l-primary">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Data Induk Pegawai</span>
            <p className="text-3xl font-extrabold font-heading text-foreground tabular-nums">
              {stats.totalAsn} ASN
            </p>
            <p className="text-[11px] text-muted-foreground">
              PNS ({stats.totalPns}) • PPPK ({stats.totalPppk})
            </p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Antrean Verifikasi Data</span>
            <p className="text-3xl font-extrabold font-heading text-amber-600 tabular-nums">
              {antreanVerifikasi} Pengajuan
            </p>
            <p className="text-[11px] text-muted-foreground">Perubahan mandiri dari pegawai</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Usulan Kenaikan Pangkat</span>
            <p className="text-3xl font-extrabold font-heading text-emerald-600 tabular-nums">
              {totalUsulanPangkat} Berkas
            </p>
            <p className="text-[11px] text-muted-foreground">Periode April 2026</p>
          </CardContent>
        </Card>

        <Card interactive className="border-l-4 border-l-indigo-500">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Pengajuan Cuti Aktif</span>
            <p className="text-3xl font-extrabold font-heading text-indigo-600 tabular-nums">
              {totalCutiAktif} Usulan
            </p>
            <p className="text-[11px] text-muted-foreground">Tahunan & Izin Daerah</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Antrean Verifikasi & Pintasan Administrasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Antrean Verifikasi Mandiri */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-primary" />
                    Antrean Verifikasi Perubahan Data Pegawai
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pengajuan pembaruan data kontak dan domisili dari pegawai.
                  </CardDescription>
                </div>
                <Link href="/admin/perubahan-data">
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingPerubahan ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                  Memuat data permohonan...
                </div>
              ) : perubahanDataList.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Tidak ada permohonan perubahan data yang perlu diverifikasi.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {perubahanDataList.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{item.pegawai_nama}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Perubahan: <strong>{item.field}</strong> • Lama: <span className="line-through">{item.nilai_lama}</span> → Baru: <span className="font-semibold text-primary">{item.nilai_baru}</span>
                        </p>
                      </div>
                      <Link href="/admin/perubahan-data">
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          Verifikasi
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Akses Cepat Modul Operator */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Pintasan Administrasi Kepegawaian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/admin/pegawai/baru"
                className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 text-center space-y-1 transition-all"
              >
                <Users className="h-5 w-5 mx-auto text-primary" />
                <p className="font-semibold text-foreground">Tambah Pegawai</p>
                <p className="text-[10px] text-muted-foreground">Form data induk</p>
              </Link>

              <Link
                href="/admin/formasi"
                className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 text-center space-y-1 transition-all"
              >
                <Layers className="h-5 w-5 mx-auto text-emerald-600" />
                <p className="font-semibold text-foreground">Analisis Beban Kerja</p>
                <p className="text-[10px] text-muted-foreground">Peta ABK & Bezetting</p>
              </Link>

              <Link
                href="/admin/kepangkatan"
                className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 text-center space-y-1 transition-all"
              >
                <Award className="h-5 w-5 mx-auto text-amber-600" />
                <p className="font-semibold text-foreground">Kenaikan Pangkat</p>
                <p className="text-[10px] text-muted-foreground">Early warning TMT</p>
              </Link>

              <Link
                href="/admin/jabatan"
                className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/60 text-center space-y-1 transition-all"
              >
                <Settings className="h-5 w-5 mx-auto text-indigo-600" />
                <p className="font-semibold text-foreground">Master Jabatan</p>
                <p className="text-[10px] text-muted-foreground">Konfigurasi eselon</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
