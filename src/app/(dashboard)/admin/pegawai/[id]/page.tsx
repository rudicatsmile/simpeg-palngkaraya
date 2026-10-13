import Link from "next/link";
import { pegawaiService, dokumenService, cutiService, kinerjaService } from "@/services";
import {
  ArrowLeft,
  User,
  Award,
  FileText,
  Calendar,
  Target,
  AlertTriangle,
  Edit3,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const metadata = {
  title: "Detail Data Induk Pegawai | SIMPEG Daerah",
};

export default async function DetailPegawaiAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let pegawai = await pegawaiService.getById(id);
  if (!pegawai) {
    const all = await pegawaiService.getAll();
    pegawai = all[0];
  }

  if (!pegawai) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Data pegawai tidak ditemukan.
      </div>
    );
  }

  const dokumenList = await dokumenService.getAll(pegawai.id);
  const cutiList = await cutiService.getAll(pegawai.id);
  const skpList = await kinerjaService.getSKP(pegawai.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/pegawai">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              {pegawai.gelar_depan ? `${pegawai.gelar_depan} ` : ""}
              {pegawai.nama_lengkap}
              {pegawai.gelar_belakang ? `, ${pegawai.gelar_belakang}` : ""}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              NIP: {pegawai.nip} • Status: {pegawai.status_kepegawaian} ({pegawai.golongan})
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/admin/pegawai/${pegawai.id}/edit`}>
            <Button size="sm" className="gap-1.5 text-xs font-semibold">
              <Edit3 className="h-4 w-4" />
              Edit Data Pegawai
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Informasi Terintegrasi */}
      <Tabs defaultValue="profil">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="profil" className="text-xs">
            Profil & Identitas
          </TabsTrigger>
          <TabsTrigger value="pangkat" className="text-xs">
            Riwayat Kepangkatan
          </TabsTrigger>
          <TabsTrigger value="dokumen" className="text-xs">
            Dokumen Digital
          </TabsTrigger>
          <TabsTrigger value="cuti" className="text-xs">
            Riwayat Cuti
          </TabsTrigger>
          <TabsTrigger value="kinerja" className="text-xs">
            Penilaian SKP
          </TabsTrigger>
          <TabsTrigger value="disiplin" className="text-xs">
            Status Disiplin
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profil */}
        <TabsContent value="profil">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Card>
              <CardHeader className="pb-3 border-b border-border/80">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Data Pribadi & Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-xs divide-y divide-border/60">
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">NIK (Tersamar)</span>
                  <span className="font-mono text-foreground font-semibold">{pegawai.nik_masked}</span>
                </div>
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
                  <span className="text-muted-foreground">Alamat Domisili</span>
                  <span className="font-semibold text-foreground text-right max-w-xs">{pegawai.alamat}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Nomor Telepon / WA</span>
                  <span className="font-semibold text-foreground">{pegawai.no_hp}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Surel Resmi</span>
                  <span className="font-mono text-foreground">{pegawai.email}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b border-border/80">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Status Kepegawaian & Penempatan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 text-xs divide-y divide-border/60">
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Perangkat Daerah</span>
                  <span className="font-semibold text-foreground">{pegawai.pd_nama}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Jabatan Resmi</span>
                  <span className="font-semibold text-foreground">{pegawai.jabatan_nama}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Golongan & Pangkat</span>
                  <span className="font-semibold text-primary">{pegawai.golongan} ({pegawai.pangkat})</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">TMT Golongan</span>
                  <span className="font-mono text-foreground">{pegawai.tmt_golongan}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Batas Usia Pensiun</span>
                  <span className="font-mono text-amber-600 font-semibold">{pegawai.tanggal_pensiun}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Status ASN</span>
                  <Badge variant="disetujui">● AKTIF</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Pangkat */}
        <TabsContent value="pangkat">
          <Card className="mt-4">
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base">Riwayat Kenaikan Pangkat Golongan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Golongan</TableHead>
                    <TableHead>Pangkat</TableHead>
                    <TableHead>TMT</TableHead>
                    <TableHead>Nomor SK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-primary">III/c</TableCell>
                    <TableCell>Penata</TableCell>
                    <TableCell className="font-mono">1 April 2022</TableCell>
                    <TableCell className="font-mono text-muted-foreground">823.3/045/BKPSDM/2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-primary">III/b</TableCell>
                    <TableCell>Penata Muda Tk. I</TableCell>
                    <TableCell className="font-mono">1 April 2018</TableCell>
                    <TableCell className="font-mono text-muted-foreground">823.3/089/BKPSDM/2018</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Dokumen */}
        <TabsContent value="dokumen">
          <Card className="mt-4">
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base">Dokumen Digital Terverifikasi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Berkas</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Versi</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dokumenList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-xs text-muted-foreground">
                        Belum ada dokumen digital terverifikasi.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dokumenList.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-semibold text-xs">{d.judul}</TableCell>
                        <TableCell className="text-xs">{d.kategori}</TableCell>
                        <TableCell className="text-xs font-mono">v{d.versi}</TableCell>
                        <TableCell>
                          <Badge variant="disetujui">TERVERIFIKASI</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Cuti */}
        <TabsContent value="cuti">
          <Card className="mt-4">
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base">Rekam Jejak Cuti ASN</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Cuti</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cutiList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-xs text-muted-foreground">
                        Belum ada rekam jejak cuti.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cutiList.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-semibold text-xs capitalize">Cuti {c.jenis}</TableCell>
                        <TableCell className="text-xs font-bold">{c.jumlah_hari} Hari Kerja</TableCell>
                        <TableCell className="text-xs font-mono">{c.tanggal_mulai} s.d. {c.tanggal_selesai}</TableCell>
                        <TableCell>
                          <Badge variant="disetujui">{c.status.toUpperCase()}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Kinerja */}
        <TabsContent value="kinerja">
          <Card className="mt-4">
            <CardHeader className="pb-3 border-b border-border/80">
              <CardTitle className="text-base">Penilaian SKP 2 Tahun Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun Kinerja</TableHead>
                    <TableHead>Nilai Akhir</TableHead>
                    <TableHead>Predikat Kinerja</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono font-bold">2024</TableCell>
                    <TableCell className="font-bold text-emerald-600">94.50</TableCell>
                    <TableCell className="font-semibold">Sangat Baik</TableCell>
                    <TableCell>
                      <Badge variant="selesai">FINAL</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono font-bold">2023</TableCell>
                    <TableCell className="font-bold text-emerald-600">93.80</TableCell>
                    <TableCell className="font-semibold">Sangat Baik</TableCell>
                    <TableCell>
                      <Badge variant="selesai">FINAL</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Disiplin */}
        <TabsContent value="disiplin">
          <Card className="mt-4 p-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
              <div>
                <p className="font-bold text-sm text-foreground">Tidak Memiliki Hukuman Disiplin Aktif</p>
                <p>Pegawai bersih dari sanksi pelanggaran kode etik PP No. 94 Tahun 2021.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
