"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePerangkatDaerahList, useJabatanList, pegawaiService } from "@/services";
import { ArrowLeft, UserPlus, Save, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TambahPegawaiBaruPage() {
  const router = useRouter();
  const { data: pdList, loading: loadingPd } = usePerangkatDaerahList();
  const { data: jabatanList, loading: loadingJabatan } = useJabatanList();

  const [nip, setNip] = useState("");
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [gelarDepan, setGelarDepan] = useState("");
  const [gelarBelakang, setGelarBelakang] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("L");
  const [statusKepegawaian, setStatusKepegawaian] = useState("PNS");
  const [golongan, setGolongan] = useState("III/a");
  const [pangkat, setPangkat] = useState("Penata Muda");
  const [pdId, setPdId] = useState("");
  const [jabatanId, setJabatanId] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pdList.length > 0 && !pdId) setPdId(pdList[0].id);
    if (jabatanList.length > 0 && !jabatanId) setJabatanId(jabatanList[0].id);
  }, [pdList, jabatanList, pdId, jabatanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nip.length !== 18) {
      toast.error("NIP wajib 18 digit numerik!");
      return;
    }

    try {
      setLoading(true);
      await pegawaiService.create({
        nip,
        nik,
        nama_lengkap: namaLengkap,
        gelar_depan: gelarDepan,
        gelar_belakang: gelarBelakang,
        tempat_lahir: tempatLahir,
        tanggal_lahir: tanggalLahir || "1990-01-01",
        jenis_kelamin: jenisKelamin,
        status_kepegawaian: statusKepegawaian,
        golongan,
        pangkat,
        pd_id: pdId,
        jabatan_id: jabatanId,
        email: email || `${nip}@nusantarajaya.go.id`,
        no_hp: noHp,
        alamat,
        status: "aktif",
      });

      toast.success("Pegawai Baru Berhasil Didaftarkan!", {
        description: `Data untuk ${namaLengkap} (NIP ${nip}) telah tersimpan di Supabase.`,
      });
      router.push("/admin/pegawai");
    } catch {
      toast.error("Gagal menambahkan pegawai baru");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pegawai">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Tambah Data Induk Pegawai Baru
          </h1>
          <p className="text-xs text-muted-foreground">
            Lengkapi data primer ASN sesuai surat keputusan pengangkatan resmi.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Formulir Perekaman ASN Baru
          </CardTitle>
          <CardDescription className="text-xs">
            Seluruh data wajib diisi dengan akurat sesuai berkas identitas resmi BKN.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Bagian Identitas */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-1">
                A. Identitas Diri
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    NIP (18 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    maxLength={18}
                    placeholder="Contoh: 199508142022031002"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    maxLength={16}
                    placeholder="320101xxxxxxxxxx"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="font-semibold text-foreground">Gelar Depan</label>
                  <Input
                    placeholder="Dr. / Drs. / Ir."
                    value={gelarDepan}
                    onChange={(e) => setGelarDepan(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-foreground">
                    Nama Lengkap (Tanpa Gelar) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Budi Santoso"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="font-semibold text-foreground">Gelar Belakang</label>
                  <Input
                    placeholder="S.E., M.M."
                    value={gelarBelakang}
                    onChange={(e) => setGelarBelakang(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Tempat Lahir <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Kota Lahir..."
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    required
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bagian Status Kepegawaian & Jabatan */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-1">
                B. Status Kepegawaian & Penempatan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Status Kedudukan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={statusKepegawaian}
                    onChange={(e) => setStatusKepegawaian(e.target.value)}
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (Pegawai Pemerintah Perjanjian Kerja)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Golongan Ruang <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Contoh: III/a"
                    value={golongan}
                    onChange={(e) => setGolongan(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Nama Pangkat <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Contoh: Penata Muda"
                    value={pangkat}
                    onChange={(e) => setPangkat(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Perangkat Daerah (Instansi) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={pdId}
                    onChange={(e) => setPdId(e.target.value)}
                  >
                    {pdList.map((pd) => (
                      <option key={pd.id} value={pd.id}>
                        {pd.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Jabatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={jabatanId}
                    onChange={(e) => setJabatanId(e.target.value)}
                  >
                    {jabatanList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} ({j.jenis})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bagian Kontak & Alamat */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-heading font-bold text-sm text-foreground border-b border-border pb-1">
                C. Kontak & Alamat Resmi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Email Resmi Instansi (@nusantarajaya.go.id) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="nama.pegawai@nusantarajaya.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="081234567890"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Alamat Domisili Tempat Tinggal <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Jl. Praja No. 12, Kelurahan / Kecamatan..."
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Link href="/admin/pegawai">
                <Button variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading} size="sm" className="font-semibold text-xs gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                {loading ? "Menyimpan Data..." : "Simpan Pegawai Baru & Kirim Undangan Aktivasi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
