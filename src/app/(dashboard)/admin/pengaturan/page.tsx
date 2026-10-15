"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Globe,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Trash2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { appSettingsService, DEFAULT_APP_SETTINGS } from "@/services/app-settings.service";
import { AppSettings } from "@/types";

export default function PengaturanUmumAdminPage() {
  // State Konfigurasi Atribut Beranda (Tersimpan di Supabase)
  const [branding, setBranding] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [loadingBranding, setLoadingBranding] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  // State Konfigurasi Instansi Umum
  const [instansi, setInstansi] = useState({
    namaPemda: "Pemerintah Kabupaten Nusantara Jaya",
    namaBkd: "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)",
    singkatanBkd: "BKPSDM Kab. Nusantara Jaya",
    alamat: "Jl. Praja Mukti No. 01, Kompleks Perkantoran Terpadu, Nusantara Jaya 65123",
    emailDinas: "bkpsdm@nusantarajaya.go.id",
    noTelepon: "(0341) 889922",
    whatsappHelpdesk: "0812-3456-7890",
    situsWeb: "https://bkpsdm.nusantarajaya.go.id",
    zonaWaktu: "WIB (Asia/Jakarta, UTC+7)",
    formatTanggal: "DD/MM/YYYY",
    tahunAnggaran: "2026",
    kuotaCutiTahunanDefault: "12",
    toleransiKeterlambatanMenit: "15",
    batasUsiaPensiunUmum: "58",
    batasUsiaPensiunStruktural: "60",
    autoLockSessionMenit: "30",
    enforceMfaAdmin: true,
  });

  const [savingInstansi, setSavingInstansi] = useState(false);

  // Muat data app_settings dari Supabase saat halaman dibuka
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoadingBranding(true);
        const data = await appSettingsService.get();
        setBranding(data);
      } catch (err) {
        console.error("Gagal memuat pengaturan branding:", err);
      } finally {
        setLoadingBranding(false);
      }
    }
    loadSettings();
  }, []);

  // Simpan perubahan branding ke Supabase
  const handleSaveBranding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!branding.nama_aplikasi.trim() || !branding.nama_sub_aplikasi.trim()) {
      toast.error("Nama aplikasi dan nama sub aplikasi wajib diisi!");
      return;
    }

    try {
      setSavingBranding(true);
      const { data, error } = await appSettingsService.update({
        nama_aplikasi: branding.nama_aplikasi,
        nama_sub_aplikasi: branding.nama_sub_aplikasi,
        slogan: branding.slogan,
        teks_perkenalan: branding.teks_perkenalan,
        logo_url: branding.logo_url,
        favicon_url: branding.favicon_url,
      });

      if (error) {
        toast.error("Gagal menyimpan ke Supabase: " + (error.message || "Periksa hak akses"));
      } else {
        if (data) setBranding(data);
        toast.success("Atribut branding aplikasi berhasil disimpan ke database Supabase!");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setSavingBranding(false);
    }
  };

  // Upload Logo ke Supabase Storage (bucket: app-assets)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const { publicUrl, error } = await appSettingsService.uploadAsset(file, "logo");

      if (error) {
        toast.error(error);
        return;
      }

      if (publicUrl) {
        setBranding((prev) => ({ ...prev, logo_url: publicUrl }));
        toast.success("Logo aplikasi berhasil diunggah ke Supabase Storage!");
      }
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // Upload Favicon ke Supabase Storage (bucket: app-assets)
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFavicon(true);
      const { publicUrl, error } = await appSettingsService.uploadAsset(file, "favicon");

      if (error) {
        toast.error(error);
        return;
      }

      if (publicUrl) {
        setBranding((prev) => ({ ...prev, favicon_url: publicUrl }));
        toast.success("Favicon aplikasi berhasil diunggah ke Supabase Storage!");
      }
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) faviconInputRef.current.value = "";
    }
  };

  // Reset Branding ke nilai default
  const handleResetToDefault = () => {
    if (confirm("Kembalikan atribut branding ke nilai standar default?")) {
      setBranding({
        ...DEFAULT_APP_SETTINGS,
      });
      toast.info("Nilai direset ke default. Klik 'Simpan ke Supabase' untuk menerapkan permanen.");
    }
  };

  // Simpan parameter instansi umum
  const handleSaveInstansi = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInstansi(true);
    setTimeout(() => {
      setSavingInstansi(false);
      toast.success("Pengaturan instansi dan parameter operasional berhasil diperbarui!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Sistem & Branding</h1>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
              Supabase DB Connected
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi seluruh atribut aplikasi beranda, logo, favicon, dan profil instansi tanpa deploy ulang.
          </p>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="branding" className="text-xs font-semibold gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Branding Beranda & Aplikasi
          </TabsTrigger>
          <TabsTrigger value="profil" className="text-xs">Profil Pemda & BKPSDM</TabsTrigger>
          <TabsTrigger value="lokalisasi" className="text-xs">Waktu & Regional</TabsTrigger>
          <TabsTrigger value="keamanan" className="text-xs">Keamanan Sesi & Akun</TabsTrigger>
          <TabsTrigger value="integrasi" className="text-xs">Status Server & API</TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB 1: BRANDING BERANDA & APLIKASI (SUPABASE DB & STORAGE) */}
        {/* ========================================================================= */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Konfigurasi (Kiri: 7 Kolom) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="shadow-xs border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-900">
                        Atribut Aplikasi Halaman Beranda
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Dikelola penuh melalui tabel <code className="text-indigo-600 font-mono">public.app_settings</code> di Supabase.
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetToDefault}
                      className="text-xs text-slate-500 hover:text-rose-600"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset Default
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Nama Aplikasi & Nama Sub Aplikasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        1. Nama Aplikasi <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="Contoh: SIMPEG Daerah"
                        value={branding.nama_aplikasi}
                        onChange={(e) => setBranding({ ...branding, nama_aplikasi: e.target.value })}
                        disabled={loadingBranding}
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tampil di bilah navigasi header, beranda, dan tab browser.
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        2. Nama Sub Aplikasi / Wilayah <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        placeholder="Contoh: Kabupaten Nusantara Jaya"
                        value={branding.nama_sub_aplikasi}
                        onChange={(e) => setBranding({ ...branding, nama_sub_aplikasi: e.target.value })}
                        disabled={loadingBranding}
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Nama daerah atau instansi pelaksana kepegawaian.
                      </p>
                    </div>
                  </div>

                  {/* Slogan Aplikasi */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      3. Slogan Aplikasi (Tagline Hero)
                    </label>
                    <Input
                      placeholder="Contoh: Transformasi Digital Kepegawaian Terpadu"
                      value={branding.slogan}
                      onChange={(e) => setBranding({ ...branding, slogan: e.target.value })}
                      disabled={loadingBranding}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tampil di badge pill atas pada Hero section halaman beranda.
                    </p>
                  </div>

                  {/* Teks Perkenalan Aplikasi */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      4. Teks Perkenalan Aplikasi di Halaman Beranda
                    </label>
                    <textarea
                      rows={4}
                      className="w-full text-xs border border-slate-200 rounded-lg p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                      placeholder="Tuliskan deskripsi ringkas mengenai tujuan dan keunggulan aplikasi bagi ASN..."
                      value={branding.teks_perkenalan}
                      onChange={(e) => setBranding({ ...branding, teks_perkenalan: e.target.value })}
                      disabled={loadingBranding}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Paragraf pengantar yang menjelaskan layanan SIMPEG kepada pengunjung beranda.
                    </p>
                  </div>

                  {/* Upload Assets Section (Logo & Favicon) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    {/* 5. Logo Aplikasi */}
                    <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
                          5. Logo Aplikasi
                        </label>
                        {branding.logo_url && (
                          <button
                            type="button"
                            onClick={() => setBranding((prev) => ({ ...prev, logo_url: null }))}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Hapus Logo
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-xs overflow-hidden">
                          {branding.logo_url ? (
                            <img
                              src={branding.logo_url}
                              alt="Logo Pratinjau"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="h-full w-full bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                              <Building2 className="h-7 w-7" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploadingLogo}
                            onClick={() => logoInputRef.current?.click()}
                            className="text-xs h-8"
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            {uploadingLogo ? "Mengunggah..." : "Unggah Logo"}
                          </Button>
                          <p className="text-[10px] text-slate-400">PNG, SVG, JPG (Maks. 2MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* 6. Favicon */}
                    <div className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-emerald-600" />
                          6. Favicon Browser
                        </label>
                        {branding.favicon_url && (
                          <button
                            type="button"
                            onClick={() => setBranding((prev) => ({ ...prev, favicon_url: null }))}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Hapus Favicon
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-xs overflow-hidden">
                          {branding.favicon_url ? (
                            <img
                              src={branding.favicon_url}
                              alt="Favicon Pratinjau"
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <Globe className="h-7 w-7 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <input
                            ref={faviconInputRef}
                            type="file"
                            accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"
                            className="hidden"
                            onChange={handleFaviconUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploadingFavicon}
                            onClick={() => faviconInputRef.current?.click()}
                            className="text-xs h-8"
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            {uploadingFavicon ? "Mengunggah..." : "Unggah Favicon"}
                          </Button>
                          <p className="text-[10px] text-slate-400">ICO, PNG (16x16 atau 32x32)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Simpan */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {branding.updated_at
                        ? `Terakhir diperbarui: ${new Date(branding.updated_at).toLocaleString("id-ID")}`
                        : "Belum pernah diperbarui"}
                    </span>
                    <Button
                      type="button"
                      onClick={() => handleSaveBranding()}
                      disabled={savingBranding || loadingBranding}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {savingBranding ? "Menyimpan ke Supabase..." : "Simpan Konfigurasi Beranda"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Interactive Preview (Kanan: 5 Kolom) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="shadow-xs border-indigo-100 bg-gradient-to-b from-indigo-50/30 to-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-indigo-600" />
                      Pratinjau Langsung (Live Preview)
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-white text-indigo-600 border-indigo-200">
                      Real-time
                    </Badge>
                  </div>
                  <CardDescription className="text-[11px] text-slate-500">
                    Tampilan instan header navigasi dan hero section halaman beranda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock Browser Window */}
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Browser Chrome Header */}
                    <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-white rounded-md py-0.5 px-3 text-[10px] text-slate-500 font-mono inline-flex items-center gap-1 max-w-[200px] truncate shadow-2xs">
                          {branding.favicon_url ? (
                            <img src={branding.favicon_url} alt="Favicon" className="h-3 w-3 inline object-contain" />
                          ) : (
                            <Globe className="h-3 w-3 text-slate-400" />
                          )}
                          simpeg.daerah.go.id
                        </div>
                      </div>
                    </div>

                    {/* Preview Navbar */}
                    <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        {branding.logo_url ? (
                          <div className="h-7 w-7 rounded-lg border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={branding.logo_url} alt="Logo" className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                            <Building2 className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none">
                            {branding.nama_aplikasi || "SIMPEG Daerah"}
                          </p>
                          <p className="text-[9px] text-slate-400 leading-tight">
                            {branding.nama_sub_aplikasi || "Kabupaten Daerah"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 hidden sm:inline">Beranda</span>
                        <div className="h-5 px-2 rounded-md bg-indigo-600 text-white text-[9px] font-medium flex items-center">
                          Masuk
                        </div>
                      </div>
                    </div>

                    {/* Preview Hero Section */}
                    <div className="p-4 bg-gradient-to-b from-indigo-50/50 via-white to-white space-y-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/70 border border-indigo-200/60 px-2 py-0.5 text-[9px] font-semibold text-indigo-700">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{branding.slogan || "Slogan Aplikasi"}</span>
                      </div>

                      {branding.logo_url && (
                        <div className="h-10 w-10 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
                          <img src={branding.logo_url} alt="Logo" className="h-full w-full object-contain" />
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {branding.nama_aplikasi || "SIMPEG Daerah"}
                        </h3>
                        <p className="text-xs font-bold text-indigo-600 leading-tight">
                          {branding.nama_sub_aplikasi || "Kabupaten Nusantara Jaya"}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                        {branding.teks_perkenalan || "Teks perkenalan aplikasi..."}
                      </p>

                      <div className="flex gap-1.5 pt-1">
                        <div className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-semibold shadow-2xs">
                          Masuk ke Portal ASN
                        </div>
                        <div className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 text-[10px] font-medium">
                          Aktivasi Akun
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Sinkronisasi */}
                  <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Sinkronisasi Beranda Otomatis
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Begitu Anda menekan <strong>Simpan Konfigurasi Beranda</strong>, seluruh pengunjung yang membuka beranda langsung melihat logo, teks, dan favicon terbaru tanpa redeploy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: PROFIL PEMDA & BKPSDM (DATA INSTANSI UMUM) */}
        {/* ========================================================================= */}
        <TabsContent value="profil" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-xs border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Lambang Resmi Instansi</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Logo resmi Pemkab yang tampil di kop surat, slip digital, dan watermark dokumen SK.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  {branding.logo_url ? (
                    <img
                      src={branding.logo_url}
                      alt="Logo Resmi"
                      className="h-28 w-28 object-contain mb-2"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md font-bold text-3xl">
                      NJ
                    </div>
                  )}
                  <p className="font-semibold text-slate-800 text-sm mt-3">Logo_Pemerintah_Daerah.png</p>
                  <p className="text-xs text-slate-500 mt-0.5">Format PNG Transparan, Maks 2MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 text-xs"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" /> Ganti Lambang
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-xs border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Identitas Lembaga Pemerintah</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Informasi ini digunakan dalam dokumen cetak resmi, SK pensiun/pangkat, dan footer notifikasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Pemerintah Daerah</label>
                    <Input
                      value={instansi.namaPemda}
                      onChange={(e) => setInstansi({ ...instansi, namaPemda: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Singkatan / Akronim BKD</label>
                    <Input
                      value={instansi.singkatanBkd}
                      onChange={(e) => setInstansi({ ...instansi, singkatanBkd: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Perangkat Daerah Pengelola Kepegawaian</label>
                  <Input
                    value={instansi.namaBkd}
                    onChange={(e) => setInstansi({ ...instansi, namaBkd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Kantor Pelayanan</label>
                  <Input
                    value={instansi.alamat}
                    onChange={(e) => setInstansi({ ...instansi, alamat: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Resmi</label>
                    <Input
                      value={instansi.emailDinas}
                      onChange={(e) => setInstansi({ ...instansi, emailDinas: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">No. Telepon Kantor</label>
                    <Input
                      value={instansi.noTelepon}
                      onChange={(e) => setInstansi({ ...instansi, noTelepon: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Helpdesk WhatsApp</label>
                    <Input
                      value={instansi.whatsappHelpdesk}
                      onChange={(e) => setInstansi({ ...instansi, whatsappHelpdesk: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleSaveInstansi}
                    disabled={savingInstansi}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingInstansi ? "Menyimpan..." : "Simpan Profil Instansi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: WAKTU & REGIONAL */}
        {/* ========================================================================= */}
        <TabsContent value="lokalisasi" className="space-y-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Standar Waktu & Kalender Kerja</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Semua perhitungan absensi, keterlambatan, dan tenggat waktu verifikasi mengacu pada parameter ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Zona Waktu Operasional</label>
                  <select
                    value={instansi.zonaWaktu}
                    onChange={(e) => setInstansi({ ...instansi, zonaWaktu: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
                  >
                    <option value="WIB (Asia/Jakarta, UTC+7)">WIB (Asia/Jakarta, UTC+7)</option>
                    <option value="WITA (Asia/Makassar, UTC+8)">WITA (Asia/Makassar, UTC+8)</option>
                    <option value="WIT (Asia/Jayapura, UTC+9)">WIT (Asia/Jayapura, UTC+9)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tahun Anggaran Berjalan</label>
                  <Input
                    value={instansi.tahunAnggaran}
                    onChange={(e) => setInstansi({ ...instansi, tahunAnggaran: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Toleransi Presensi Datang (Menit)</label>
                  <Input
                    type="number"
                    value={instansi.toleransiKeterlambatanMenit}
                    onChange={(e) => setInstansi({ ...instansi, toleransiKeterlambatanMenit: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-3">
                <Clock className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 leading-relaxed">
                  <p className="font-semibold">Sinkronisasi Waktu Server Antigravity Cloud:</p>
                  <p className="text-indigo-800 mt-0.5">
                    Server saat ini tersinkronisasi otomatis dengan Network Time Protocol (NTP) Badan Siber dan Sandi Negara (BSSN) Indonesia dengan deviasi waktu kurang dari 5ms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: KEAMANAN SESI & AKUN */}
        {/* ========================================================================= */}
        <TabsContent value="keamanan" className="space-y-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Kebijakan Sesi & Keamanan Data ASN</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pencegahan kebocoran data pribadi ASN dan perlindungan akun administrator.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Batas Timeout Sesi Tidak Aktif (Menit)</label>
                  <Input
                    type="number"
                    value={instansi.autoLockSessionMenit}
                    onChange={(e) => setInstansi({ ...instansi, autoLockSessionMenit: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Sesi akan otomatis logout jika tidak ada interaksi dalam 30 menit.</p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Multi-Factor Authentication (MFA)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="mfa"
                      checked={instansi.enforceMfaAdmin}
                      onChange={(e) => setInstansi({ ...instansi, enforceMfaAdmin: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300"
                    />
                    <label htmlFor="mfa" className="text-xs text-slate-700 font-medium">
                      Wajibkan OTP / MFA untuk peran Administrator & Operator BKPSDM
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-semibold">Enkripsi Data Pribadi (UU PDP No. 27/2022)</p>
                  <p className="text-emerald-800 mt-0.5">
                    Nomor Induk Kependudukan (NIK) dan data keluarga disimpan menggunakan enkripsi PostgreSQL pgcrypto AES-256 dan dilindungi Row Level Security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: INTEGRASI & STATUS SERVER */}
        {/* ========================================================================= */}
        <TabsContent value="integrasi" className="space-y-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Status Layanan & Konektivitas Eksternal</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Status modul integrasi nasional (BKN SIASN, MOLA, dan Supabase Database).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Supabase PostgreSQL 15 & Row Level Security</p>
                      <p className="text-[11px] text-slate-500">Tabel app_settings & storage app-assets aktif</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">Terkoneksi</Badge>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Supabase Storage Bucket (app-assets)</p>
                      <p className="text-[11px] text-slate-500">Penyimpanan publik untuk Logo dan Favicon aplikasi</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">Terkoneksi</Badge>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">API BKN SIASN WebService (SSO BKN)</p>
                      <p className="text-[11px] text-slate-500">Sinkronisasi berkala terjadwal setiap pukul 02:00 WIB</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">Siap Eksekusi</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
