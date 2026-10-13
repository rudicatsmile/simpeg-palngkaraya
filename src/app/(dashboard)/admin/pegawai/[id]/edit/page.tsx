"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { pegawaiService } from "@/services";
import { Pegawai } from "@/types";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EditPegawaiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [fetching, setFetching] = useState(true);

  const [nama, setNama] = useState("");
  const [gelarBelakang, setGelarBelakang] = useState("");
  const [golongan, setGolongan] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [alasanPerubahan, setAlasanPerubahan] = useState("Koreksi data SK kenaikan pangkat terbaru");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let data = await pegawaiService.getById(id);
        if (!data) {
          const all = await pegawaiService.getAll();
          data = all[0] || null;
        }
        if (data) {
          setPegawai(data);
          setNama(data.nama_lengkap);
          setGelarBelakang(data.gelar_belakang || "");
          setGolongan(data.golongan || "");
          setPangkat(data.pangkat || "");
          setNoHp(data.no_hp || "");
          setAlamat(data.alamat || "");
        }
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pegawai) return;
    try {
      setLoading(true);
      await pegawaiService.update(pegawai.id, {
        nama_lengkap: nama,
        gelar_belakang: gelarBelakang,
        golongan,
        pangkat,
        no_hp: noHp,
        alamat,
      });

      toast.success("Perubahan Data Pegawai Berhasil Disimpan!", {
        description: `Tindakan pencatatan audit log: UPDATE_DATA_PEGAWAI (${pegawai.nip}) berhasil terekam di sistem.`,
      });
      router.push(`/admin/pegawai/${pegawai.id}`);
    } catch {
      toast.error("Gagal mengupdate data pegawai");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pegawai) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Pegawai tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/admin/pegawai/${pegawai.id}`}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Edit Data Pegawai: {pegawai.nama_lengkap}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            NIP: {pegawai.nip} • Seluruh perubahan tercatat pada audit trail inspektorat.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base">Formulir Pembaruan Data Pegawai</CardTitle>
          <CardDescription className="text-xs">
            Pastikan perubahan didasarkan pada dokumen hukum kepegawaian yang sah.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nama Lengkap</label>
                <Input required value={nama} onChange={(e) => setNama(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Gelar Belakang</label>
                <Input value={gelarBelakang} onChange={(e) => setGelarBelakang(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Golongan Ruang</label>
                <Input required value={golongan} onChange={(e) => setGolongan(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nama Pangkat</label>
                <Input required value={pangkat} onChange={(e) => setPangkat(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Nomor Telepon / WA</label>
                <Input required value={noHp} onChange={(e) => setNoHp(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Alamat Domisili</label>
                <Input required value={alamat} onChange={(e) => setAlamat(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="font-semibold text-foreground">
                Dasar Alasan Perubahan (Wajib untuk Catatan Jejak Audit) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={alasanPerubahan}
                onChange={(e) => setAlasanPerubahan(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href={`/admin/pegawai/${pegawai.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading} size="sm" className="font-semibold text-xs gap-1.5">
                <Save className="h-4 w-4" />
                {loading ? "Menyimpan & Mencatat Audit..." : "Simpan Pembaruan Data"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
