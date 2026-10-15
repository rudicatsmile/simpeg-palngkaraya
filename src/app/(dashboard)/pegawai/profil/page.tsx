"use client";

import { useState } from "react";
import Link from "next/link";
import { usePegawaiList } from "@/services";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Shield,
  Edit3,
  History,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProfilPegawaiPage() {
  const { data: pegawaiList } = usePegawaiList();
  const pegawai = pegawaiList[0] || {
    id: "e1a1b1c1-0001-4000-8000-000000000001",
    nama_lengkap: "Budi Santoso",
    gelar_depan: "Dr.",
    gelar_belakang: "M.Si.",
    nip: "197805122002121003",
    nik_masked: "350704******0002",
    pangkat: "Pembina",
    golongan: "IV/a",
    jabatan_nama: "Kepala Bidang Mutasi dan Kepangkatan",
    pd_nama: "Badan Kepegawaian dan Pengembangan SDM (BKPSDM)",
    tempat_lahir: "Palangkaraya",
    tanggal_lahir: "1978-05-12",
    jenis_kelamin: "L",
    status_kepegawaian: "PNS",
    tmt_golongan: "2022-04-01",
    tmt_cpns: "2002-12-01",
    tmt_pns: "2004-03-01",
    pendidikan_terakhir: "S3 Administrasi Publik",
    alamat: "Jl. Merdeka No. 45, Palangkaraya",
    no_hp: "081234567890",
    email: "budi.santoso@palangkaraya.go.id",
    status: "aktif",
    tanggal_pensiun: "2038-05-31",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState("Nomor WhatsApp / HP");
  const [oldValue, setOldValue] = useState(pegawai.no_hp);
  const [newValue, setNewValue] = useState("");
  const [alasan, setAlasan] = useState("");

  const openEditModal = (fieldName: string, curVal: string) => {
    setFieldToEdit(fieldName);
    setOldValue(curVal);
    setNewValue("");
    setAlasan("");
    setIsModalOpen(true);
  };

  const handleAjukanPerubahan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue) {
      toast.error("Nilai baru wajib diisi!");
      return;
    }

    setIsModalOpen(false);
    toast.success("Usulan Perubahan Data Berhasil Diajukan!", {
      description: `Usulan perubahan ${fieldToEdit} telah dikirim ke Atasan Langsung untuk diverifikasi.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Profil Pegawai ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Data identitas pokok, kepangkatan, dan status jabatan terdaftar di BKPSDM.
          </p>
        </div>
        <Link href="/pegawai/profil/riwayat-perubahan">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
            <History className="h-4 w-4" />
            Riwayat Usulan Perubahan Data
          </Button>
        </Link>
      </div>

      {/* Ringkasan Profil Card */}
      <Card className="overflow-hidden border-border shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary to-indigo-700" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="h-24 w-24 rounded-2xl bg-card border-4 border-card shadow-md flex items-center justify-center text-primary font-bold text-2xl">
                BS
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {pegawai.gelar_depan} {pegawai.nama_lengkap}, {pegawai.gelar_belakang}
                  </h2>
                  <Badge variant="disetujui">● {pegawai.status.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  NIP: {pegawai.nip} • NIK: {pegawai.nik_masked}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal("Nomor WhatsApp / HP", pegawai.no_hp)}
                className="text-xs gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5 text-primary" />
                Update Data Kontak
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Perangkat Daerah:</span>
              <p className="font-semibold text-foreground">{pegawai.pd_nama}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Jabatan Saat Ini:</span>
              <p className="font-semibold text-foreground">{pegawai.jabatan_nama}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Atasan Langsung:</span>
              <p className="font-semibold text-foreground">{pegawai.atasan_nama}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Rincian: Data Pribadi & Data Kepegawaian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Data Pribadi */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Data Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs divide-y divide-border/60">
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Tempat, Tanggal Lahir</span>
              <span className="font-semibold text-foreground">
                {pegawai.tempat_lahir}, {pegawai.tanggal_lahir}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Jenis Kelamin</span>
              <span className="font-semibold text-foreground">
                {pegawai.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Pendidikan Terakhir</span>
              <span className="font-semibold text-foreground text-right max-w-[200px]">
                {pegawai.pendidikan_terakhir}
              </span>
            </div>
            <div className="flex justify-between items-start pt-2">
              <span className="text-muted-foreground">Alamat Domisili</span>
              <div className="text-right">
                <span className="font-semibold text-foreground block max-w-[220px]">
                  {pegawai.alamat}
                </span>
                <button
                  onClick={() => openEditModal("Alamat Domisili", pegawai.alamat)}
                  className="text-[11px] text-primary hover:underline font-medium mt-0.5"
                >
                  Ajukan Koreksi
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Nomor Telepon / WA</span>
              <div className="text-right">
                <span className="font-semibold text-foreground block">{pegawai.no_hp}</span>
                <button
                  onClick={() => openEditModal("Nomor WhatsApp / HP", pegawai.no_hp)}
                  className="text-[11px] text-primary hover:underline font-medium mt-0.5"
                >
                  Ajukan Koreksi
                </button>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Surel Resmi Instansi</span>
              <span className="font-semibold text-foreground font-mono">{pegawai.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Data Kepegawaian & Karir */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/80">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Data Kepegawaian & Pangkat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs divide-y divide-border/60">
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Status Kedudukan</span>
              <span className="font-semibold text-foreground">{pegawai.status_kepegawaian}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Golongan & Pangkat</span>
              <span className="font-semibold text-foreground">
                {pegawai.golongan} ({pegawai.pangkat})
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">TMT Golongan Terakhir</span>
              <span className="font-semibold text-foreground font-mono">{pegawai.tmt_golongan}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">TMT CPNS / PNS</span>
              <span className="font-semibold text-foreground font-mono">
                {pegawai.tmt_cpns} / {pegawai.tmt_pns}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Proyeksi Tanggal Pensiun</span>
              <span className="font-semibold text-foreground font-mono text-amber-600">
                {pegawai.tanggal_pensiun}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Kartu QR Digital</span>
              <Link href="/pegawai/qr" className="text-primary hover:underline font-semibold">
                Lihat Kartu Identitas →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Dialog Ajukan Perubahan Mandiri */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Pengajuan Perubahan Data Mandiri</DialogTitle>
          <DialogDescription>
            Sesuai aturan Bab 6, perubahan data pribadi tidak langsung tersimpan melainkan masuk
            antrean persetujuan Atasan Langsung dan verifikasi Operator BKPSDM.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAjukanPerubahan} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Bidang / Kolom Data</label>
            <Input disabled value={fieldToEdit} className="bg-muted" />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Nilai Saat Ini (Lama)</label>
            <Input disabled value={oldValue} className="bg-muted" />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">
              Nilai Baru yang Diusulkan <span className="text-rose-500">*</span>
            </label>
            <Input
              required
              placeholder="Masukkan nilai baru..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">
              Alasan Pengajuan Perubahan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Tuliskan alasan perubahan data (misal: perpindahan domisili)..."
              className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Kirim Usulan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
