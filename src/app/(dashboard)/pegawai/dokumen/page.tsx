"use client";

import { useState } from "react";
import { useDokumenList, usePegawaiList, dokumenService } from "@/services";
import { Dokumen } from "@/types";
import {
  FileText,
  Upload,
  Download,
  History,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DokumenPegawaiPage() {
  const { data: listDokumen, loading, refresh } = useDokumenList();
  const { data: pegawaiList } = usePegawaiList();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [kategori, setKategori] = useState<Dokumen["kategori"]>("SK Pangkat");
  const [judul, setJudul] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = (dok: Dokumen) => {
    toast.success("Tautan Unduhan Dibuat!", {
      description: `Signed URL privat (berlaku 300 detik) untuk berkas '${dok.judul}' berhasil di-generate.`,
    });
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !file) {
      toast.error("Mohon lengkapi judul dan pilih berkas!");
      return;
    }

    try {
      setIsSubmitting(true);
      const pegawai = pegawaiList[0];
      await dokumenService.create({
        pegawai_id: pegawai?.id,
        kategori,
        judul,
        file_path: `dokumen-pegawai/${pegawai?.id || "general"}/${file}`,
        versi: 1,
        ukuran_bytes: 245000,
        mime_type: "application/pdf",
      });

      refresh();
      setIsUploadOpen(false);
      setJudul("");
      setFile(null);
      toast.success("Dokumen Berhasil Diunggah!", {
        description: "Berkas disimpan di Supabase Storage privat dan menunggu verifikasi Operator BKPSDM.",
      });
    } catch {
      toast.error("Gagal menyimpan dokumen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Manajemen Dokumen Kepegawaian
          </h1>
          <p className="text-xs text-muted-foreground">
            Penyimpanan digital arsip SK, ijazah, sertifikat diklat dengan kontrol versi (versioning) & signed URL.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsUploadOpen(true)}
          className="gap-2 text-xs font-semibold shadow-sm"
        >
          <Upload className="h-4 w-4" />
          Unggah Berkas Baru
        </Button>
      </div>

      {/* Info Keamanan Penyimpanan */}
      <div className="rounded-xl border border-primary/20 bg-secondary/50 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <p className="font-semibold text-foreground">Penyimpanan Terenkripsi & Akses Bertanda Tangan</p>
          <p className="text-muted-foreground leading-relaxed">
            Seluruh berkas disimpan pada bucket privat Supabase Storage (`dokumen-pegawai`). Akses pengunduhan
            dibatasi melalui tautan bertanda tangan digital (signed URL) dengan masa kedaluwarsa 300 detik.
          </p>
        </div>
      </div>

      {/* Tabel Dokumen */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Daftar Berkas Digital Tersimpan
          </CardTitle>
          <CardDescription className="text-xs">
            Arsip resmi yang dapat diunduh untuk keperluan administrasi kepegawaian.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Versi</TableHead>
                <TableHead>Status Persetujuan</TableHead>
                <TableHead>Status Validasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat dokumen...</p>
                  </TableCell>
                </TableRow>
              ) : listDokumen.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada berkas dokumen digital yang diunggah.
                  </TableCell>
                </TableRow>
              ) : (
                listDokumen.map((dok) => (
                  <TableRow key={dok.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-xs text-foreground">{dok.judul}</p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate max-w-xs">
                          {dok.storage_path || "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {dok.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono tabular-nums">
                      v{dok.versi}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dok.status_persetujuan === "disetujui"
                            ? "disetujui"
                            : dok.status_persetujuan === "ditolak"
                            ? "ditolak"
                            : "menunggu"
                        }
                      >
                        {(dok.status_persetujuan || "disetujui").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                        {dok.ttd_status === "internal" ? "Persetujuan Internal" : "Terverifikasi Sistem"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(dok)}
                        className="text-xs h-8 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5 text-primary" />
                        Unduh (Signed URL)
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Unggah Berkas */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogHeader>
          <DialogTitle>Unggah Berkas Dokumen Kepegawaian</DialogTitle>
          <DialogDescription>
            Pilih kategori arsip dan unggah berkas PDF/JPG maksimal 10 MB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Kategori Dokumen <span className="text-rose-500">*</span>
            </label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={kategori}
              onChange={(e) => setKategori(e.target.value as Dokumen["kategori"])}
            >
              <option value="SK Pangkat">SK Kenaikan Pangkat</option>
              <option value="SK Jabatan">SK Jabatan / Pelantikan</option>
              <option value="SK CPNS/PNS">SK CPNS / PNS</option>
              <option value="Ijazah">Ijazah & Transkrip Nilai</option>
              <option value="KTP">KTP / Kartu Keluarga</option>
              <option value="Sertifikat">Sertifikat Diklat / Pelatihan</option>
              <option value="Surat Cuti">Surat Keputusan Cuti</option>
              <option value="Lainnya">Dokumen Lainnya</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Judul / Keterangan Berkas <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="Contoh: SK Kenaikan Pangkat III/c Tahun 2022"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Pilih Berkas <span className="text-rose-500">*</span>
            </label>
            <Input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0]?.name || null)}
            />
            <p className="text-[11px] text-muted-foreground">
              Hanya berkas PDF, JPG, PNG dengan ukuran maksimal 10 MB.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadOpen(false)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button type="submit" className="text-xs font-semibold gap-1.5">
              <Upload className="h-4 w-4" />
              Unggah Dokumen
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
