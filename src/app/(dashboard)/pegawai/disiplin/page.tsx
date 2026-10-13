"use client";

import { usePegawaiList, useDisiplinList } from "@/services";
import { AlertTriangle, ShieldCheck, CheckCircle2, FileText, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RiwayatDisiplinPage() {
  const { data: pegawaiList, loading: loadingPegawai } = usePegawaiList();
  const { data: disiplinList, loading: loadingDisiplin } = useDisiplinList();

  const pegawai = pegawaiList[0];
  const hukumanAktif = disiplinList.filter((d) => d.pegawai_id === pegawai?.id);

  if (loadingPegawai || loadingDisiplin) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isBersih = hukumanAktif.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Catatan & Riwayat Disiplin ASN
        </h1>
        <p className="text-xs text-muted-foreground">
          Status kepatuhan kode etik dan rekam jejak penegakan disiplin sesuai PP No. 94 Tahun 2021.
        </p>
      </div>

      {/* Kartu Status Bersih Disiplin */}
      <Card className={isBersih ? "border-2 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20" : "border-2 border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20"}>
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${isBersih ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600" : "bg-rose-100 dark:bg-rose-950 text-rose-600"}`}>
            {isBersih ? <ShieldCheck className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {isBersih ? "Tidak Memiliki Catatan Hukuman Disiplin Aktif" : "Memiliki Catatan Hukuman Disiplin"}
              </h2>
              <Badge variant={isBersih ? "disetujui" : "destructive"}>
                {isBersih ? "● Bersih / Tertib" : "● Dalam Pembinaan"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Pegawai atas nama <strong>{pegawai?.gelar_depan || ""} {pegawai?.nama_lengkap || "Pegawai"}{pegawai?.gelar_belakang ? `, ${pegawai.gelar_belakang}` : ""}</strong> berstatus{" "}
              {isBersih ? "bersih dan tidak sedang menjalani hukuman disiplin tingkat ringan, sedang, maupun berat. Hak kenaikan pangkat reguler dan kenaikan gaji berkala (KGB) tidak mengalami penundaan." : "tercatat sedang dalam masa sanksi disiplin."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Penjelasan Ketentuan Regulasi PP 94/2021 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <Card className="p-5 space-y-2 border-border">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            Hukuman Disiplin Ringan
          </span>
          <p className="text-muted-foreground leading-relaxed">
            Teguran lisan, teguran tertulis, atau pernyataan tidak puas secara tertulis. Berlaku selama 12 bulan dan tidak menunda kenaikan pangkat.
          </p>
        </Card>

        <Card className="p-5 space-y-2 border-border">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-rose-500">
            <AlertTriangle className="h-4 w-4" />
            Hukuman Disiplin Sedang
          </span>
          <p className="text-muted-foreground leading-relaxed">
            Pemotongan tunjangan kinerja sebesar 25% selama 6-12 bulan. Berdampak penundaan kenaikan pangkat selama masa berlakunya.
          </p>
        </Card>

        <Card className="p-5 space-y-2 border-border">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-rose-700">
            <AlertTriangle className="h-4 w-4" />
            Hukuman Disiplin Berat
          </span>
          <p className="text-muted-foreground leading-relaxed">
            Penurunan jabatan, pembebasan dari jabatan, atau pemberhentian dengan hormat tidak atas permintaan sendiri sebagai ASN.
          </p>
        </Card>
      </div>
    </div>
  );
}
