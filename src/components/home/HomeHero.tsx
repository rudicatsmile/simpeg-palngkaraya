"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Award, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSettings } from "@/services/app-settings.service";

export function HomeHero() {
  const { settings, loading } = useAppSettings();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Slogan Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary transition-all">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              {loading ? (
                <div className="h-4 w-48 bg-primary/20 animate-pulse rounded" />
              ) : (
                <span>{settings.slogan}</span>
              )}
            </div>

            {/* Logo & Judul Aplikasi */}
            <div className="space-y-2">
              {settings.logo_url && (
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-card border border-border/70 shadow-lg p-2.5 flex items-center justify-center">
                    <img
                      src={settings.logo_url}
                      alt={settings.nama_aplikasi}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {loading ? (
                  <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto lg:mx-0 mb-2" />
                ) : (
                  <span>{settings.nama_aplikasi} </span>
                )}
                {loading ? (
                  <div className="h-12 w-80 bg-primary/20 animate-pulse rounded mx-auto lg:mx-0" />
                ) : (
                  <span className="text-primary block mt-1">
                    {settings.nama_sub_aplikasi}
                  </span>
                )}
              </h1>
            </div>

            {/* Teks Perkenalan Aplikasi */}
            {loading ? (
              <div className="space-y-2 max-w-2xl mx-auto lg:mx-0">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings.teks_perkenalan}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-md">
                  Masuk ke Portal ASN
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/aktivasi">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
                  Aktivasi Akun Pegawai
                </Button>
              </Link>
              <Link href="/fitur">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                >
                  Jelajahi Fitur
                </Button>
              </Link>
            </div>

            {/* Value Props */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Tanpa Berkas Kertas Fisik
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Early Warning H-180
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                Keamanan RLS PostgreSQL
              </span>
            </div>
          </div>

          {/* Hero Graphic Card Pratinjau ASN */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      BS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Dr. Budi Santoso, S.E., M.M.</p>
                      <p className="text-[11px] text-muted-foreground">NIP. 198506122010011003 • Penata (III/c)</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                    Aktif
                  </span>
                </div>

                {/* Early Warning Card Preview */}
                <div className="rounded-xl bg-primary/5 p-4 border border-primary/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Kenaikan Pangkat Reguler
                    </span>
                    <span className="font-bold text-foreground tabular-nums">180 Hari Lagi</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Prediksi TMT: 1 April 2026 menuju Penata Tk. I (III/d). Seluruh syarat administrasi 100% lengkap.
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full w-[85%]" />
                  </div>
                </div>

                {/* Sisa Cuti */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Sisa Cuti Tahunan</p>
                    <p className="text-xl font-bold font-heading text-foreground tabular-nums">9 Hari</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                    <p className="text-[11px] text-muted-foreground">Predikat SKP 2024</p>
                    <p className="text-base font-bold font-heading text-emerald-600">Sangat Baik</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full text-xs font-semibold justify-center">
                      Buka Dasbor Simulasi Pegawai →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
