"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { kepangkatanService } from "@/services";
import { UsulanKenaikanPangkat } from "@/types";
import { ArrowLeft, Award, CheckCircle2, Clock, FileCheck, ShieldCheck, Save, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DetailUsulanPangkatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [usulan, setUsulan] = useState<UsulanKenaikanPangkat | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Record<string, any>>({});
  const [catatan, setCatatan] = useState("");
  const [status, setStatus] = useState("diajukan");

  useEffect(() => {
    if (!id) return;
    kepangkatanService.getUsulanById(id).then((data) => {
      if (data) {
        setUsulan(data);
        setChecklist((data.checklist_status as any) || {});
        setCatatan(data.catatan || "");
        setStatus(data.status || "diajukan");
      }
      setLoading(false);
    });
  }, [id]);

  const handleTetapkan = async () => {
    if (!id) return;
    const ok = await kepangkatanService.updateUsulan(id, {
      status: "disetujui",
      checklist_status: checklist,
      catatan,
    });

    if (ok) {
      setStatus("disetujui");
      toast.success("Kenaikan Pangkat Ditetapkan!", {
        description: `SK kenaikan pangkat untuk ${usulan?.pegawai_nama} menuju Gol. ${usulan?.golongan_tujuan} resmi ditetapkan di database Supabase.`,
      });
      router.push("/admin/kepangkatan");
    } else {
      toast.error("Gagal menetapkan usulan kenaikan pangkat.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Memuat berkas usulan kenaikan pangkat dari Supabase...
      </div>
    );
  }

  if (!usulan) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-sm text-muted-foreground">Berkas usulan tidak ditemukan.</p>
        <Link href="/admin/kepangkatan">
          <Button variant="outline" size="sm">Kembali ke Daftar Kepangkatan</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/kepangkatan">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Verifikasi Usulan Kenaikan Pangkat: {usulan.pegawai_nama}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            NIP: {usulan.pegawai_nip || "-"} • Kenaikan Pangkat Menuju Golongan {usulan.golongan_tujuan}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Checklist Persyaratan Digital */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                Checklist Verifikasi Kelengkapan Syarat Dokumen
              </CardTitle>
              <CardDescription className="text-xs">
                Periksa kesesuaian dokumen digital terhadap aturan masa kerja kepegawaian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">1. Penilaian Kinerja (SKP) 2 Tahun Terakhir</p>
                  <p className="text-[11px] text-muted-foreground">Minimal predikat Baik</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!checklist.skp_baik}
                  onChange={(e) => setChecklist({ ...checklist, skp_baik: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">2. Sertifikat Diklat Penjenjangan / Struktural</p>
                  <p className="text-[11px] text-muted-foreground">Pelatihan Kepemimpinan Pengawas / Teknis terverifikasi</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!checklist.diklat_sesuai}
                  onChange={(e) => setChecklist({ ...checklist, diklat_sesuai: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">3. Surat Bebas Hukuman Disiplin</p>
                  <p className="text-[11px] text-muted-foreground">Tidak sedang menjalani hukuman disiplin sedang/berat</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!checklist.disiplin_bersih}
                  onChange={(e) => setChecklist({ ...checklist, disiplin_bersih: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">4. Salinan Sah SK Kenaikan Pangkat Terakhir</p>
                  <p className="text-[11px] text-muted-foreground">SK Pangkat sebelumnya tersimpan di pangkalan data</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!checklist.sk_terakhir}
                  onChange={(e) => setChecklist({ ...checklist, sk_terakhir: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-foreground">Catatan Verifikator Operator BKPSDM:</label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Ringkasan & Tombol Penetapan SK */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-sm text-foreground">
              Aksi Penetapan Usulan
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Golongan Asal: <strong>{usulan.golongan_asal}</strong></p>
              <p>• Golongan Tujuan: <strong>{usulan.golongan_tujuan}</strong></p>
              <p>• TMT Usulan: <strong>{usulan.tmt_usulan}</strong></p>
              <p>• Status Saat Ini: <Badge variant="diajukan">{status.toUpperCase()}</Badge></p>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleTetapkan}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Tetapkan & Terbitkan SK Pangkat
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
