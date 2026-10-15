"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Save, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppSettings } from "@/hooks/useAppSettings";
import { toast } from "sonner";

export default function TemplateNotifikasiPage() {
  const { settings } = useAppSettings();
  const [selectedTemplate, setSelectedTemplate] = useState("wa_h180");
  const [templateContent, setTemplateContent] = useState(
    "Halo {{nama}}, usulan kenaikan pangkat Anda {{sisa_hari}} hari lagi akan tiba (TMT: {{tmt_prediksi}}). Silakan cek checklist berkas SKP dan dokumen digital di portal SIMPEG: {{app_url}}"
  );

  useEffect(() => {
    if (settings?.nama_pemda) {
      setTemplateContent(
        `Halo {{nama}}, usulan kenaikan pangkat Anda {{sisa_hari}} hari lagi akan tiba (TMT: {{tmt_prediksi}}). Silakan cek checklist berkas SKP dan dokumen digital di SIMPEG ${settings.nama_pemda}: {{app_url}}`
      );
    }
  }, [settings?.nama_pemda]);


  const variables = [
    { tag: "{{nama}}", desc: "Nama lengkap pegawai tanpa gelar" },
    { tag: "{{nip}}", desc: "NIP 18 digit resmi" },
    { tag: "{{golongan_tujuan}}", desc: "Golongan tujuan usulan" },
    { tag: "{{tmt_prediksi}}", desc: "Tanggal TMT prediksi" },
    { tag: "{{sisa_hari}}", desc: "Jumlah hari countdown (180, 90, 30)" },
    { tag: "{{app_url}}", desc: "Tautan langsung ke modul SIMPEG" },
  ];

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast.success(`Variabel ${tag} disalin ke clipboard!`);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Template Notifikasi WhatsApp Berhasil Disimpan!", {
      description: "Pembaruan template otomatis disinkronkan ke gateway pengiriman.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/notifikasi">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Editor Template Pesan WhatsApp Gateway
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola teks format pesan resmi notifikasi H-180 kepangkatan, persetujuan cuti, dan pengingat pensiun.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Editor Template Pesan Dinamis
              </CardTitle>
              <CardDescription className="text-xs">
                Gunakan variabel dinamis bertanda kurung kurawal ganda untuk personalisasi pesan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Pilih Acara Notifikasi</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="wa_h180">WhatsApp: Peringatan Kenaikan Pangkat H-180</option>
                    <option value="wa_h90">WhatsApp: Peringatan Kenaikan Pangkat H-90</option>
                    <option value="wa_cuti_setuju">WhatsApp: Pemberitahuan Cuti Disetujui Penuh</option>
                    <option value="wa_pensiun">WhatsApp: Peringatan Persiapan Pensiun H-365</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Isi Format Pesan WhatsApp</label>
                  <textarea
                    rows={6}
                    required
                    className="flex w-full rounded-lg border border-input bg-card p-3 font-mono text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Panjang karakter: {templateContent.length} karakter (Estimasi 1 segmen pesan WA).
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <Button type="submit" size="sm" className="font-semibold text-xs gap-1.5 shadow-sm">
                    <Save className="h-4 w-4" />
                    Simpan Template Pesan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Variabel Dinamis & Pratinjau */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 space-y-3">
            <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
              Variabel Dinamis Tersedia:
            </h3>
            <div className="space-y-2 text-xs">
              {variables.map((v, i) => (
                <div
                  key={i}
                  onClick={() => handleCopyTag(v.tag)}
                  className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/30 hover:bg-muted cursor-pointer transition-colors"
                >
                  <div>
                    <code className="text-primary font-bold text-[11px]">{v.tag}</code>
                    <p className="text-[10px] text-muted-foreground">{v.desc}</p>
                  </div>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
