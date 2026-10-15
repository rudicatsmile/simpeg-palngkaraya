"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function KontakPage() {
  const { settings } = useAppSettings();
  const [formData, setFormData] = useState({

    nama: "",
    nip: "",
    email: "",
    kategori: "Kendala Akun & Login",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Laporan Pengaduan Terkirim!", {
        description: `Terima kasih Bapak/Ibu ${formData.nama || "Pegawai"}. Nomor tiket Anda adalah TKT-${Math.floor(
          100000 + Math.random() * 900000
        )}. Operator BKPSDM akan segera memverifikasi.`,
      });
      setFormData({
        nama: "",
        nip: "",
        email: "",
        kategori: "Kendala Akun & Login",
        pesan: "",
      });
    }, 800);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 className="h-4 w-4" />
            <span>Layanan Bantuan Kepegawaian</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            Hubungi BKPSDM Kabupaten Nusantara Jaya
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sampaikan pertanyaan, kendala verifikasi data, atau pengaduan teknis aplikasi. Tim
            Helpdesk siap melayani Anda pada hari dan jam kerja operasional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Pengaduan */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">
                Formulir Pengaduan & Layanan Pegawai
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Isi rincian pengaduan di bawah ini dengan menyertakan NIP resmi Anda.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: Dr. Budi Santoso, M.M."
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      NIP 18 Digit <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="198506122010011003"
                      maxLength={18}
                      required
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Resmi Instansi <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="nama@nusantarajaya.go.id"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Kategori Layanan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    >
                      <option value="Kendala Akun & Login">Kendala Akun & Login</option>
                      <option value="Perbaikan Data Induk">Perbaikan Data Induk Pegawai</option>
                      <option value="Kenaikan Pangkat & KGB">Kenaikan Pangkat & KGB</option>
                      <option value="Pengajuan Cuti">Pengajuan & Saldo Cuti</option>
                      <option value="Presensi & Absensi">Presensi & Deteksi Keterlambatan</option>
                      <option value="Lainnya">Lain-lain / Konsultasi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Detail Pesan / Uraian Masalah <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan kendala Anda secara rinci beserta nomor dokumen jika ada..."
                    className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full sm:w-auto font-semibold gap-2">
                  <Send className="h-4 w-4" />
                  {loading ? "Mengirim Laporan..." : "Kirim Pengaduan"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Info Kantor & Helpdesk */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-6">
              <h3 className="font-heading font-bold text-base text-foreground">
                {settings.nama_sekretariat || "Kantor Pusat BKPSDM"}
              </h3>

              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Lokasi Sekretariat</p>
                    <p className="leading-relaxed">
                      {settings.alamat_sekretariat ||
                        "Jl. Praja Prajamukti No. 1, Kompleks Perkantoran Pemkab Nusantara Jaya"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Telepon & WhatsApp Helpdesk</p>
                    <p>{settings.telepon_sekretariat || "(021) 8765-4321 / 0812-3456-7890"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Surel Resmi</p>
                    <p>{settings.email_sekretariat || "bkpsdm@nusantarajaya.go.id"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Jam Pelayanan Operasional</p>
                    <p>{settings.jam_operasional_sekretariat || "Senin - Jumat: 07.30 - 16.00 WIB"}</p>
                  </div>
                </div>
              </div>
            </Card>


            <div className="rounded-xl bg-secondary/60 p-4 border border-primary/20 space-y-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Sistem Tiket Terpadu
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap laporan pengaduan otomatis tercatat dalam antrean layanan BKPSDM dan akan
                dibalas melalui email atau WhatsApp resmi maksimal 1x24 jam kerja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
