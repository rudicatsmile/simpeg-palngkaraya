"use client";

import { useState, useEffect } from "react";
import { useDiklatList, usePegawaiDiklatList, diklatService } from "@/services";
import { GraduationCap, Award, Plus, Sparkles, CheckCircle2, Clock, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DiklatPegawaiPage() {
  const [isUsulanOpen, setIsUsulanOpen] = useState(false);
  const { data: diklatCatalog, loading: loadingCatalog } = useDiklatList();
  const { data: pegawaiDiklat, loading: loadingRiwayat } = usePegawaiDiklatList();
  const [selectedDiklatId, setSelectedDiklatId] = useState("");
  const [alasanUsulan, setAlasanUsulan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (diklatCatalog.length > 0 && !selectedDiklatId) {
      setSelectedDiklatId(diklatCatalog[0].id);
    }
  }, [diklatCatalog, selectedDiklatId]);

  const handleAjukanUsulan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiklatId) return;
    try {
      setIsSubmitting(true);
      await diklatService.createPegawaiDiklat({
        diklat_id: selectedDiklatId,
        status: "diajukan",
        catatan: alasanUsulan,
      });
      setIsUsulanOpen(false);
      setAlasanUsulan("");
      toast.success("Usulan Pelatihan Berhasil Diajukan!", {
        description: "Usulan diklat diteruskan ke BKPSDM untuk diverifikasi dalam alokasi anggaran pelatihan.",
      });
    } catch {
      toast.error("Gagal mengajukan diklat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pengembangan Kompetensi & Diklat
          </h1>
          <p className="text-xs text-muted-foreground">
            Riwayat sertifikasi diklat, rekomendasi kompetensi jabatan, dan formulir usulan pelatihan mandiri.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsUsulanOpen(true)}
          className="gap-2 text-xs font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajukan Usulan Diklat Baru
        </Button>
      </div>

      {/* Rekomendasi Diklat Berbasis Aturan Gap Jabatan */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-primary font-heading">
              <Sparkles className="h-5 w-5" />
              Rekomendasi Pelatihan Otomatis (Rule-based Competency Gap)
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              Sesuai Jabatan Kasi Pembinaan SMP
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Berdasarkan analisis syarat kompetensi jabatan, berikut pelatihan yang disarankan untuk pengembangan karir Anda:
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">
                  Bimtek Penerapan SPBE & Transformasi Digital
                </span>
                <Badge variant="diajukan" className="text-[10px]">32 JP</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Penyelenggara: Kementerian PANRB & BKPSDM. Mendukung kompetensi manajerial tata kelola sistem pemerintahan berbasis elektronik.
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsUsulanOpen(true)}
                  className="text-xs w-full justify-center"
                >
                  Ajukan Mengikuti Bimtek Ini →
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">
                  Diklat Pengadaan Barang dan Jasa Pemerintah Level 1
                </span>
                <Badge variant="diajukan" className="text-[10px]">48 JP</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Penyelenggara: LKPP. Disyaratkan untuk pejabat pembuat komitmen (PPK) di dinas pendidikan.
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsUsulanOpen(true)}
                  className="text-xs w-full justify-center"
                >
                  Ajukan Mengikuti Diklat Ini →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Riwayat & Status Usulan Diklat */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Riwayat Pelatihan & Sertifikasi Pegawai
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar diklat yang telah selesai maupun usulan yang sedang dalam verifikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pelatihan / Bimtek</TableHead>
                <TableHead>Penyelenggara</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead className="text-right">Sertifikat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRiwayat ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2">Memuat riwayat diklat...</p>
                  </TableCell>
                </TableRow>
              ) : pegawaiDiklat.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada riwayat pelatihan atau sertifikasi tercatat.
                  </TableCell>
                </TableRow>
              ) : (
                pegawaiDiklat.map((dik) => (
                  <TableRow key={dik.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {dik.diklat_nama}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {dik.penyelenggara || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dik.status === "selesai"
                            ? "selesai"
                            : dik.status === "diajukan"
                            ? "diajukan"
                            : "menunggu"
                        }
                      >
                        {dik.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {dik.tanggal_selesai || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {dik.sertifikat_path ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success("Sertifikat PDF dibuka dari Storage!")}
                          className="text-xs h-7"
                        >
                          Lihat Sertifikat
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Menunggu verifikasi</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Usulan Diklat */}
      <Dialog open={isUsulanOpen} onOpenChange={setIsUsulanOpen}>
        <DialogHeader>
          <DialogTitle>Ajukan Usulan Mengikuti Pelatihan</DialogTitle>
          <DialogDescription>
            Pilih katalog diklat dan sertakan urgensi pengembangan kompetensi Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAjukanUsulan} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Katalog Pelatihan</label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedDiklatId}
              onChange={(e) => setSelectedDiklatId(e.target.value)}
            >
              {loadingCatalog ? (
                <option value="">Memuat katalog diklat...</option>
              ) : (
                diklatCatalog.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama} ({d.jam_pelajaran} JP - {d.penyelenggara})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Alasan & Urgensi Usulan</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan relevansi diklat terhadap pencapaian target kinerja Anda..."
              className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={alasanUsulan}
              onChange={(e) => setAlasanUsulan(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUsulanOpen(false)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-xs font-semibold gap-1.5">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Kirim Usulan Diklat
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
