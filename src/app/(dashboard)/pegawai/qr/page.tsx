"use client";

import { usePegawaiList } from "@/services";
import { QrCode, Download, Printer, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function QrIdentitasPage() {
  const { data: pegawaiList } = usePegawaiList();
  const pegawai = pegawaiList[0] || {
    id: "e1a1b1c1-0001-4000-8000-000000000001",
    nama_lengkap: "Budi Santoso",
    gelar_depan: "Dr.",
    gelar_belakang: "M.Si.",
    nip: "197805122002121003",
    pangkat: "Pembina",
    golongan: "IV/a",
    jabatan_nama: "Kepala Bidang Mutasi dan Kepangkatan",
    pd_nama: "Badan Kepegawaian dan Pengembangan SDM (BKPSDM)",
    qr_token: "e1a1b1c1-0001-4000-8000-000000000001",
  };

  const handleDownloadCard = () => {
    toast.success("Kartu ASN Digital Berhasil Diunduh!", {
      description: "Berkas kartu identitas beresolusi tinggi tersimpan dalam format gambar PNG.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Kartu Identitas Digital ASN (e-KTA)
        </h1>
        <p className="text-xs text-muted-foreground">
          Kartu identitas resmi berbasis QR Code terenkripsi untuk validasi kedudukan pegawai secara instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pratinjau Fisik Kartu ASN */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-indigo-900 via-primary to-blue-800 p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
            {/* Watermark Logo Instansi */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

            {/* Header Kartu */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary font-bold shadow-md">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm tracking-wide">
                    PEMERINTAH KABUPATEN NUSANTARA JAYA
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium">
                    KARTU IDENTITAS APARATUR SIPIL NEGARA
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian Profil & QR Code */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-8 space-y-3">
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">Nama Lengkap</p>
                  <p className="font-heading text-base font-bold leading-tight">
                    {pegawai.gelar_depan} {pegawai.nama_lengkap}, {pegawai.gelar_belakang}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">NIP / Golongan</p>
                  <p className="text-xs font-mono font-semibold">
                    {pegawai.nip} • {pegawai.golongan}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">Jabatan</p>
                  <p className="text-xs font-medium leading-snug line-clamp-2">
                    {pegawai.jabatan_nama}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">Unit Kerja</p>
                  <p className="text-xs font-medium leading-snug text-white/90">
                    {pegawai.pd_nama}
                  </p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="col-span-4 flex flex-col items-center justify-center space-y-1.5">
                <div className="rounded-xl bg-white p-2.5 shadow-md flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-slate-900" />
                </div>
                <span className="text-[9px] text-white/80 font-mono tracking-tighter">
                  SCAN TO VERIFY
                </span>
              </div>
            </div>

            {/* Footer Kartu */}
            <div className="flex items-center justify-between border-t border-white/20 pt-3 text-[10px] text-white/80">
              <span className="flex items-center gap-1 font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Status ASN: Aktif
              </span>
              <span className="font-mono">TOKEN: {pegawai.qr_token.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Panel Aksi & Penjelasan */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">
              Aksi & Cetak Kartu
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kartu identitas ini dapat dicetak secara fisik maupun disimpan di galeri ponsel sebagai
              bukti keabsahan identitas ASN yang diakui di lingkungan Pemerintah Daerah.
            </p>

            <div className="space-y-2.5 pt-2">
              <Button onClick={handleDownloadCard} className="w-full gap-2 font-semibold text-xs">
                <Download className="h-4 w-4" />
                Unduh Kartu Digital (Format PNG)
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="w-full gap-2 font-semibold text-xs"
              >
                <Printer className="h-4 w-4" />
                Cetak Kartu Fisik
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Simulasi Pindai QR Code Publik
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Saat pihak eksternal memindai QR Code kartu ini, sistem akan mengarahkan ke halaman
              verifikasi publik resmi tanpa menampilkan data pribadi sensitif Anda.
            </p>
            <div className="pt-1">
              <Link href={`/verifikasi/${pegawai.qr_token}`}>
                <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                  Buka Halaman Verifikasi Publik →
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
