"use client";

import { useState } from "react";
import { Lock, Bell, MessageSquare, Mail, Shield, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PengaturanAkunPage() {
  // Ganti Password state
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Preferensi Notifikasi Multi-channel state
  const [waNotif, setWaNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter!");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Konfirmasi kata sandi baru tidak sesuai!");
      return;
    }
    toast.success("Kata Sandi Berhasil Diperbarui!", {
      description: "Gunakan kata sandi baru untuk login sesi berikutnya.",
    });
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleSavePreferences = () => {
    toast.success("Preferensi Notifikasi Disimpan!", {
      description: `WhatsApp: ${waNotif ? "Aktif" : "Nonaktif"}, Email: ${
        emailNotif ? "Aktif" : "Nonaktif"
      }`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Pengaturan Akun & Keamanan
        </h1>
        <p className="text-xs text-muted-foreground">
          Kelola kredensial keamanan akun dan preferensi saluran notifikasi multi-channel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Ganti Password */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Ubah Kata Sandi Akun
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui kata sandi secara berkala untuk menjaga keamanan data kepegawaian Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Kata Sandi Saat Ini</label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Kata Sandi Baru</label>
                  <Input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter kombinasi..."
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Ulangi Kata Sandi Baru</label>
                  <Input
                    type="password"
                    required
                    placeholder="Ketik ulang kata sandi baru..."
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>

                <Button type="submit" size="sm" className="font-semibold gap-1.5">
                  <Save className="h-4 w-4" />
                  Simpan Kata Sandi Baru
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Preferensi Notifikasi Kanal */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Preferensi Saluran Notifikasi
              </CardTitle>
              <CardDescription className="text-xs">
                Pilih media untuk menerima pemberitahuan kenaikan pangkat dan cuti.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp Gateway</p>
                    <p className="text-[11px] text-muted-foreground">Pengingat H-180 & hasil cuti via WA</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={waNotif}
                  onChange={(e) => setWaNotif(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Email Resmi Instansi</p>
                    <p className="text-[11px] text-muted-foreground">Surat keputusan & berkas digital</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-foreground">Pemberitahuan In-App</p>
                    <p className="text-[11px] text-muted-foreground">Lonceng notifikasi dalam aplikasi</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={inAppNotif}
                  onChange={(e) => setInAppNotif(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleSavePreferences}
                className="w-full text-xs font-semibold"
              >
                Simpan Preferensi Notifikasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
