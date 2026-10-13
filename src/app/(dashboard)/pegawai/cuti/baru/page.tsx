"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

export default function AjukanCutiBaruPage() {
  const router = useRouter();

  const [jenisCuti, setJenisCuti] = useState("tahunan");
  const [tanggalMulai, setTanggalMulai] = useState("2025-08-12");
  const [tanggalSelesai, setTanggalSelesai] = useState("2025-08-14");
  const [alasan, setAlasan] = useState("");
  const [alamatCuti, setAlamatCuti] = useState("Jl. Merdeka No. 45, Kota Nusantara");
  const [fileSurat, setFileSurat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kalkulasi hari kerja (mengecualikan Sabtu = 6 dan Minggu = 0)
  const calculateWorkDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (start > end) return 0;

    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const workDays = calculateWorkDays(tanggalMulai, tanggalSelesai);
  const sisaCutiSaatIni = 9;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (workDays <= 0) {
      toast.error("Tanggal selesai harus sama atau setelah tanggal mulai!");
      return;
    }

    if (jenisCuti === "tahunan" && workDays > sisaCutiSaatIni) {
      toast.error(`Jumlah hari kerja (${workDays} hari) melebihi sisa cuti tahunan Anda (${sisaCutiSaatIni} hari)!`);
      return;
    }

    if (jenisCuti === "sakit" && workDays > 2 && !fileSurat) {
      toast.error("Cuti sakit lebih dari 2 hari kerja wajib melampirkan surat keterangan dokter!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Permohonan Cuti Berhasil Diajukan!", {
        description: `Pengajuan cuti selama ${workDays} hari kerja telah diteruskan ke Atasan Langsung untuk diverifikasi.`,
      });
      router.push("/pegawai/cuti");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/pegawai/cuti">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Formulir Permohonan Cuti ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Kalkulator hari kerja otomatis mengecualikan hari Sabtu, Minggu, dan hari libur nasional.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Input */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Rincian Permohonan Cuti
              </CardTitle>
              <CardDescription className="text-xs">
                Pastikan data yang diisi telah benar sebelum menekan tombol kirim usulan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Jenis Cuti yang Diajukan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={jenisCuti}
                    onChange={(e) => setJenisCuti(e.target.value)}
                  >
                    <option value="tahunan">Cuti Tahunan (Sisa: 9 Hari)</option>
                    <option value="sakit">Cuti Sakit</option>
                    <option value="alasan_penting">Cuti Karena Alasan Penting</option>
                    <option value="melahirkan">Cuti Melahirkan</option>
                    <option value="besar">Cuti Besar</option>
                    <option value="di_luar_tanggungan">Cuti di Luar Tanggungan Negara</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">
                      Tanggal Mulai Cuti <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="date"
                      required
                      value={tanggalMulai}
                      onChange={(e) => setTanggalMulai(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">
                      Tanggal Selesai Cuti <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="date"
                      required
                      value={tanggalSelesai}
                      onChange={(e) => setTanggalSelesai(e.target.value)}
                    />
                  </div>
                </div>

                {/* Box Kalkulasi Hari Kerja Otomatis */}
                <div className="rounded-xl border border-primary/20 bg-secondary/50 p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">Perhitungan Hari Kerja Efektif:</span>
                    <p className="text-[11px] text-muted-foreground">
                      Akhir pekan (Sabtu-Minggu) otomatis dikecualikan.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-heading text-primary tabular-nums">
                      {workDays} Hari Kerja
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Alasan Permohonan Cuti <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Uraikan keperluan Anda secara jelas..."
                    className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Alamat Selama Menjalankan Cuti <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Alamat domisili atau tujuan..."
                    value={alamatCuti}
                    onChange={(e) => setAlamatCuti(e.target.value)}
                  />
                </div>

                {/* Unggah Dokumen Pendukung jika Cuti Sakit */}
                {jenisCuti === "sakit" && (
                  <div className="space-y-1.5 rounded-lg border border-border p-3 bg-muted/20">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary" />
                      Surat Keterangan Dokter (Wajib jika &gt; 2 hari)
                    </label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => setFileSurat(e.target.files?.[0]?.name || null)}
                    />
                    <p className="text-[11px] text-muted-foreground">Format PDF, JPG, maksimal 5 MB.</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto font-semibold gap-2">
                    <Send className="h-4 w-4" />
                    {loading ? "Memproses Permohonan..." : "Kirim Permohonan Cuti"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan & Aturan Cuti */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-sm text-foreground">
              Ketentuan Cuti ASN
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pengajuan cuti tahunan wajib diajukan minimal 3 hari kerja sebelum tanggal mulai.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cuti tahunan maksimal 12 hari kerja dalam tahun berjalan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Persetujuan diproses 2 tingkat: Atasan Langsung lalu Kepala Perangkat Daerah.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
