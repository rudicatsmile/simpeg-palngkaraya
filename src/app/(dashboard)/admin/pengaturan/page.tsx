"use client";

import React, { useState } from "react";
import { 
  Building2, Globe, Clock, ShieldCheck, Mail, Phone, MapPin, 
  Upload, Save, RefreshCw, KeyRound, Server, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function PengaturanUmumAdminPage() {
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
    enforceMfaAdmin: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Pengaturan instansi dan parameter sistem berhasil disimpan!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Umum Sistem</h1>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi profil instansi Pemerintah Daerah, parameter waktu, dan integrasi operasional.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="profil" className="text-xs">Profil Pemda & BKPSDM</TabsTrigger>
          <TabsTrigger value="lokalisasi" className="text-xs">Waktu & Regional</TabsTrigger>
          <TabsTrigger value="keamanan" className="text-xs">Keamanan Sesi & Akun</TabsTrigger>
          <TabsTrigger value="integrasi" className="text-xs">Status Server & API</TabsTrigger>
        </TabsList>

        {/* Tab 1: Profil */}
        <TabsContent value="profil" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-xs border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Lambang Daerah</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Logo resmi Pemkab Nusantara Jaya yang tampil di kop surat, slip digital, dan watermark dokumen SK.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="h-28 w-28 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md font-bold text-3xl">
                    NJ
                  </div>
                  <p className="font-semibold text-slate-800 text-sm mt-3">Logo_Kabupaten_NusantaraJaya.png</p>
                  <p className="text-xs text-slate-500 mt-0.5">Format PNG Transparan, Maks 2MB</p>
                  <Button variant="outline" size="sm" className="mt-4 text-xs">
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Waktu & Regional */}
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

        {/* Tab 3: Keamanan */}
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

        {/* Tab 4: Integrasi */}
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
                      <p className="text-[11px] text-slate-500">Koneksi Aktif (Pooler: 5432) • Latensi: 18ms</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">Terkoneksi</Badge>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Supabase Storage (Private Bucket S3-compatible)</p>
                      <p className="text-[11px] text-slate-500">Akses tanda tangan URL 5 menit • Kuota: 12.4 GB / 100 GB</p>
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
