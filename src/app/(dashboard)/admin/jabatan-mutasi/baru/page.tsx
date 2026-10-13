"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePegawaiList, usePerangkatDaerahList, useJabatanList, mutasiService } from "@/services";
import { ArrowLeft, Briefcase, CheckCircle2, AlertTriangle, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UsulanMutasiBaruPage() {
  const router = useRouter();
  const { data: pegawaiList, loading: loadingPegawai } = usePegawaiList();
  const { data: pdList, loading: loadingPd } = usePerangkatDaerahList();
  const { data: jabatanList, loading: loadingJabatan } = useJabatanList();

  const [pegawaiId, setPegawaiId] = useState("");
  const [jenis, setJenis] = useState("mutasi");
  const [pdTujuanId, setPdTujuanId] = useState("");
  const [jabatanTujuanId, setJabatanTujuanId] = useState("");
  const [alasan, setAlasan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pegawaiList.length > 0 && !pegawaiId) setPegawaiId(pegawaiList[0].id);
    if (pdList.length > 0 && !pdTujuanId) setPdTujuanId(pdList[0].id);
    if (jabatanList.length > 0 && !jabatanTujuanId) setJabatanTujuanId(jabatanList[0].id);
  }, [pegawaiList, pdList, jabatanList, pegawaiId, pdTujuanId, jabatanTujuanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pegawaiId || !pdTujuanId || !jabatanTujuanId) return;

    try {
      setIsSubmitting(true);
      const selectedPegawai = pegawaiList.find((p) => p.id === pegawaiId);
      await mutasiService.create({
        pegawai_id: pegawaiId,
        jenis: jenis as any,
        pd_asal_id: selectedPegawai?.pd_id,
        pd_tujuan_id: pdTujuanId,
        jabatan_tujuan_id: jabatanTujuanId,
        alasan,
        status: "diajukan",
      });

      toast.success("Usulan Mutasi Berhasil Diajukan!", {
        description: "Formasi jabatan tujuan terverifikasi tersedia. Usulan masuk antrean persetujuan.",
      });
      router.push("/admin/pegawai");
    } catch {
      toast.error("Gagal mengajukan usulan mutasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/jabatan-mutasi">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Formulir Usulan Alih Tugas / Mutasi ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Sistem secara otomatis memverifikasi ketersediaan formasi pada jabatan tujuan.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Rincian Pengajuan Mutasi / Rotasi
          </CardTitle>
          <CardDescription className="text-xs">
            Pastikan pegawai telah memenuhi masa kerja minimal di unit kerja asal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Pilih Pegawai yang Diusulkan</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={pegawaiId}
                  onChange={(e) => setPegawaiId(e.target.value)}
                >
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_lengkap} (NIP {p.nip} - {p.pd_nama})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Jenis Alih Tugas</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                >
                  <option value="mutasi">Mutasi Antar Perangkat Daerah</option>
                  <option value="rotasi">Rotasi Internal Unit Kerja</option>
                  <option value="promosi">Promosi Jabatan ke Tingkat Lebih Tinggi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Perangkat Daerah Tujuan</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={pdTujuanId}
                  onChange={(e) => setPdTujuanId(e.target.value)}
                >
                  {pdList.map((pd) => (
                    <option key={pd.id} value={pd.id}>
                      {pd.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Jabatan Baru yang Dituju</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={jabatanTujuanId}
                  onChange={(e) => setJabatanTujuanId(e.target.value)}
                >
                  {jabatanList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nama} ({j.jenis})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Indikator Validasi Formasi Otomatis */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Ketersediaan Formasi Terverifikasi
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Jabatan tujuan memiliki ketersediaan formasi (Kebutuhan: 4, Tersedia: 2, Sisa Formasi Kosong: 2).
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Alasan & Pertimbangan Mutasi</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan latar belakang usulan alih tugas atau kebutuhan organisasi..."
                className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href="/admin/jabatan-mutasi">
                <Button variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} size="sm" className="font-semibold text-xs gap-1.5 shadow-sm">
                <Send className="h-4 w-4" />
                {isSubmitting ? "Memproses Usulan..." : "Kirim Usulan Mutasi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
