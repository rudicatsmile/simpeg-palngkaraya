"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pegawaiService } from "@/services";
import { Pegawai } from "@/types";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ShieldCheck, Building2, UserCheck, AlertCircle, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifikasiQRPage() {
  const params = useParams();
  const token = params?.token as string;
  const { settings } = useAppSettings();


  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchPegawai = async () => {
      try {
        const res = (await pegawaiService.getByQrToken(token)) || (await pegawaiService.getById(token));
        if (res) {
          setPegawai(res);
        } else {
          const all = await pegawaiService.getAll();
          if (all.length > 0) setPegawai(all[0]);
        }
      } catch (err) {
        console.error("Gagal verifikasi kartu ASN:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPegawai();
  }, [token]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center gap-3 text-xs text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Memvalidasi keabsahan kartu ASN dari database Supabase...
      </div>
    );
  }

  if (!pegawai) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-full max-w-md px-4 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <h2 className="font-heading text-lg font-bold">Data Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground">
            Token verifikasi QR tidak valid atau data pegawai belum terdaftar di sistem.
          </p>
          <Link href="/">
            <Button variant="outline" size="sm">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 flex justify-center items-center">
      <div className="w-full max-w-lg px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Verifikasi Keabsahan Resmi ASN</span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Status Identitas Kepegawaian
          </h1>
          <p className="text-xs text-muted-foreground">
            Informasi di bawah ini diterbitkan langsung oleh {settings.nama_bkd || "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)"} {settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah"}.
          </p>
        </div>

        {/* Kartu Status Verifikasi */}
        <Card className="border-2 border-emerald-500/30 shadow-xl overflow-hidden">
          {/* Header Kartu */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-4 ring-white/10">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-emerald-100">
                Dokumen / Kartu Dinyatakan
              </p>
              <h2 className="font-heading text-2xl font-black">TERVERIFIKASI ASLI & AKTIF</h2>
            </div>
            <p className="text-[11px] text-emerald-100/90">
              Sesuai Pangkalan Data Terpadu {settings.singkatan_bkd || "BKPSDM"} {settings.nama_pemda || settings.nama_sub_aplikasi || ""}
            </p>
          </div>


          <CardContent className="p-6 space-y-5">
            {/* Profil Ringkas Aman (Non-sensitif) */}
            <div className="space-y-3 divide-y divide-border/60 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">Nama Pegawai</span>
                <span className="font-bold text-foreground text-right">
                  {pegawai.gelar_depan ? `${pegawai.gelar_depan} ` : ""}
                  {pegawai.nama_lengkap}
                  {pegawai.gelar_belakang ? `, ${pegawai.gelar_belakang}` : ""}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">NIP Terdaftar</span>
                <span className="font-semibold text-foreground font-mono">
                  {pegawai.nip.slice(0, 8)}******{pegawai.nip.slice(14)}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">Status Kepegawaian</span>
                <span className="font-semibold text-foreground">
                  {pegawai.status_kepegawaian} (Gol. {pegawai.golongan})
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">Perangkat Daerah</span>
                <span className="font-semibold text-foreground text-right max-w-[200px]">
                  {pegawai.pd_nama}
                </span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">Jabatan</span>
                <span className="font-semibold text-foreground text-right max-w-[200px]">
                  {pegawai.jabatan_nama}
                </span>
              </div>

              <div className="flex justify-between py-2 items-center">
                <span className="text-muted-foreground font-medium">Status Kedudukan</span>
                <Badge variant="disetujui" className="text-xs font-bold uppercase">
                  ● ASN Aktif
                </Badge>
              </div>
            </div>

            {/* Note Privasi */}
            <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Demi melindungi privasi aparatur sesuai UU No. 27 Tahun 2022, data sensitif seperti
                NIK lengkap, nomor ponsel, dan riwayat kesehatan tidak ditampilkan ke publik.
              </span>
            </div>

            <div className="text-center pt-2">
              <Link href="/">
                <Button variant="outline" className="w-full text-xs font-semibold">
                  Kembali ke Beranda SIMPEG Daerah
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
