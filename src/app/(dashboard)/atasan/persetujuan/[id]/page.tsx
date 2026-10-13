"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { cutiService } from "@/services";
import { Cuti } from "@/types";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, Send, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DetailPersetujuanAtasanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [usulan, setUsulan] = useState<Cuti | null>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        let data = await cutiService.getById(id);
        if (!data) {
          const list = await cutiService.getAll();
          data = list[0] || null;
        }
        setUsulan(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSetujui = async () => {
    if (!usulan) return;
    try {
      setIsSubmitting(true);
      await cutiService.updateStatus(usulan.id, "disetujui_atasan", catatan);
      toast.success("Usulan Berhasil Disetujui!", {
        description: `Rekomendasi persetujuan dengan catatan '${catatan || "Disetujui tanpa catatan"}' telah diteruskan ke Kepala PD.`,
      });
      router.push("/atasan/persetujuan");
    } catch {
      toast.error("Gagal menyetujui usulan cuti");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTolak = async () => {
    if (!usulan) return;
    if (!catatan) {
      toast.error("Alasan penolakan wajib dituliskan pada kolom catatan telaah!");
      return;
    }
    try {
      setIsSubmitting(true);
      await cutiService.updateStatus(usulan.id, "ditolak", catatan);
      toast.error("Usulan Ditolak!", {
        description: "Penolakan telah dicatat dan notifikasi telah dikirimkan ke pegawai yang bersangkutan.",
      });
      router.push("/atasan/persetujuan");
    } catch {
      toast.error("Gagal menolak usulan cuti");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!usulan) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Data usulan cuti tidak ditemukan.
      </div>
    );
  }

  const status = usulan.status;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/atasan/persetujuan">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Rincian & Telaah Usulan Permohonan
          </h1>
          <p className="text-xs text-muted-foreground">
            Periksa data pemohon dan berikan pertimbangan administratif sebelum memutuskan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Rincian Permohonan */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Informasi Usulan Cuti
                </CardTitle>
                <Badge variant="menunggu">{status.replace(/_/g, " ").toUpperCase()}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs divide-y divide-border/60">
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Nama Pemohon</span>
                <span className="font-bold text-foreground">{usulan.pegawai_nama}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">NIP Terdaftar</span>
                <span className="font-mono text-foreground font-semibold">{usulan.nip}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Perangkat Daerah</span>
                <span className="font-semibold text-foreground">{usulan.pd_nama}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Jenis Cuti</span>
                <span className="font-semibold text-foreground capitalize">
                  Cuti {usulan.jenis}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Durasi Hari Kerja</span>
                <span className="font-bold text-primary text-sm tabular-nums">
                  {usulan.jumlah_hari} Hari Kerja
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Rentang Tanggal</span>
                <span className="font-mono text-foreground">
                  {usulan.tanggal_mulai} s.d. {usulan.tanggal_selesai}
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-muted-foreground font-medium">Alasan / Urgensi:</span>
                <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg leading-relaxed">
                  "{usulan.alasan}"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Form Telaah & Keputusan */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Pertimbangan Atasan Langsung
              </CardTitle>
              <CardDescription className="text-xs">
                Masukkan catatan pembinaan atau disposisi resmi untuk bawahan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Catatan / Rekomendasi Disposisi:
                </label>
                <textarea
                  rows={4}
                  placeholder="Contoh: Disetujui, pekerjaan didelegasikan ke Kasubbag Umum..."
                  className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleSetujui}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Setujui Permohonan (Teruskan ke Kepala PD)
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleTolak}
                  className="w-full font-semibold gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Tolak Permohonan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
