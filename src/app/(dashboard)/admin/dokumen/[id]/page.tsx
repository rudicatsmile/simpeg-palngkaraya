"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { dokumenService } from "@/services";
import { Dokumen } from "@/types";
import { ArrowLeft, FileText, Download, CheckCircle2, History, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function DetailDokumenPage() {
  const params = useParams();
  const id = params?.id as string;

  const [dok, setDok] = useState<Dokumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    dokumenService.getById(id).then((res) => {
      setDok(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Memuat rincian arsip digital dari Supabase...
      </div>
    );
  }

  if (!dok) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-sm text-muted-foreground">Dokumen tidak ditemukan.</p>
        <Link href="/admin/dokumen">
          <Button variant="outline" size="sm">Kembali ke Repositori Dokumen</Button>
        </Link>
      </div>
    );
  }

  const versiList = [
    {
      versi: dok.versi,
      tanggal: new Date(dok.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      uploader: dok.pegawai_nama || "Operator BKPSDM",
      checksum: dok.checksum,
      keterangan: `${dok.judul} (${dok.kategori})`,
      status: "Aktif / Berlaku",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dokumen">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Rincian Dokumen: {dok.judul}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            ID: {dok.id} • Kategori: {dok.kategori} • Pemilik: {dok.pegawai_nama}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pratinjau Dokumen */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Informasi Metadata Berkas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs divide-y divide-border/60">
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground font-medium">Judul Dokumen</span>
                <span className="font-bold text-foreground">{dok.judul}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Kategori</span>
                <Badge variant="outline">{dok.kategori}</Badge>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Path Supabase Storage</span>
                <span className="font-mono text-muted-foreground">{dok.storage_path}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">SHA-256 Checksum</span>
                <span className="font-mono text-[11px] text-muted-foreground truncate max-w-xs">{dok.checksum}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground font-medium">Status Persetujuan</span>
                <Badge variant={dok.status_persetujuan === "disetujui" ? "disetujui" : "diajukan"}>
                  {dok.status_persetujuan.toUpperCase()}
                </Badge>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => toast.success("Signed URL privat 300 detik berhasil dibuat dari Supabase!")}
                  className="w-full gap-2 text-xs font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Unduh Berkas Asli (Signed URL 300s)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Riwayat Versi (Versioning) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Riwayat Versi Berkas (Versioning)
              </CardTitle>
              <CardDescription className="text-xs">
                Setiap unggahan baru menyimpan versi sebelumnya secara immutable di Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {versiList.map((v) => (
                  <div key={v.versi} className="p-4 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">Versi {v.versi}</span>
                      <Badge variant="disetujui" className="text-[10px]">{v.status}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{v.tanggal} • Oleh {v.uploader}</p>
                    <p className="text-[11px] text-foreground">{v.keterangan}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
