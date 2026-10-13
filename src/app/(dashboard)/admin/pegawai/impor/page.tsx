"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function ImporPegawaiCsvPage() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const previewRows = [
    {
      baris: 1,
      nip: "199407122020121004",
      nama: "Rahmat Hidayat, S.Kom.",
      golongan: "III/a",
      pd: "Dinas Komunikasi & Informatika",
      statusValidasi: "Valid",
      keterangan: "Siap diimpor",
    },
    {
      baris: 2,
      nip: "199105202019032007",
      nama: "Nurul Aini, S.Pd.",
      golongan: "IX",
      pd: "Dinas Pendidikan dan Kebudayaan",
      statusValidasi: "Valid",
      keterangan: "Siap diimpor",
    },
    {
      baris: 3,
      nip: "198901152014", // Salah: Kurang dari 18 digit
      nama: "Bambang Kurniawan, S.T.",
      golongan: "III/b",
      pd: "Dinas Pekerjaan Umum",
      statusValidasi: "Error",
      keterangan: "NIP tidak valid (wajib 18 digit)",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(true);
      toast.info("Berkas CSV Terdeteksi!", {
        description: "Menampilkan 3 baris pratinjau hasil parsing data.",
      });
    }
  };

  const handleProsesImpor = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Impor Data Selesai!", {
        description: "2 baris data berhasil diimpor, 1 baris gagal validasi (NIP invalid).",
      });
    }, 800);
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
            Impor Data Induk Pegawai (Bulk CSV)
          </h1>
          <p className="text-xs text-muted-foreground">
            Unggah berkas spreadsheet CSV untuk menambahkan data ASN dalam jumlah banyak sekaligus.
          </p>
        </div>
      </div>

      {/* Area Unggah Berkas & Format CSV */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-3 hover:border-primary/50 transition-colors bg-muted/10">
              <Upload className="h-10 w-10 mx-auto text-primary" />
              <div className="space-y-1">
                <p className="font-semibold text-xs text-foreground">
                  Pilih file CSV dari komputer Anda
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Maksimal ukuran file 15 MB dengan format UTF-8 CSV
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full max-w-xs mx-auto text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-5 space-y-3 text-xs text-muted-foreground">
            <span className="font-bold text-foreground block">Format Kolom Wajib CSV:</span>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>nip (18 digit numerik)</li>
              <li>nama_lengkap (tanpa gelar)</li>
              <li>gelar_depan, gelar_belakang</li>
              <li>status_kepegawaian (PNS / PPPK)</li>
              <li>golongan (contoh: III/a)</li>
              <li>email_resmi (@nusantarajaya.go.id)</li>
            </ul>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Template CSV berhasil diunduh!")}
                className="w-full text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh Template CSV
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Pratinjau Tabel Validasi Baris */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Pratinjau & Validasi Baris Data
              </CardTitle>
              <CardDescription className="text-xs">
                Periksa status keabsahan data sebelum mengeksekusi penyimpanan ke pangkalan data.
              </CardDescription>
            </div>
            <Button
              size="sm"
              disabled={loading}
              onClick={handleProsesImpor}
              className="text-xs font-semibold gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "Memproses Impor..." : "Proses Impor Data Valid"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Baris</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Nama Pegawai</TableHead>
                <TableHead>Golongan</TableHead>
                <TableHead>Perangkat Daerah</TableHead>
                <TableHead>Status Validasi</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((r) => (
                <TableRow key={r.baris}>
                  <TableCell className="font-mono text-xs">{r.baris}</TableCell>
                  <TableCell className="font-mono text-xs">{r.nip}</TableCell>
                  <TableCell className="font-semibold text-xs">{r.nama}</TableCell>
                  <TableCell className="text-xs font-semibold text-primary">{r.golongan}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.pd}</TableCell>
                  <TableCell>
                    <Badge variant={r.statusValidasi === "Valid" ? "disetujui" : "ditolak"}>
                      {r.statusValidasi.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.keterangan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
