"use client";

import { useDisiplinList } from "@/services";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { AlertTriangle, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminHukumanDisiplinPage() {
  const { data: list, loading: isLoading } = useDisiplinList();
  const { getLabel, getBadgeColor } = useMasterReferensi();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pencatatan & Penegakan Hukuman Disiplin ASN
          </h1>
          <p className="text-xs text-muted-foreground">
            Dampak hukuman terhadap penundaan kenaikan pangkat, kenaikan gaji berkala, dan penempatan jabatan.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => toast.info("Form pencatatan SK hukuman disiplin baru dibuka.")}
          className="gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Catat Hukuman Disiplin Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Daftar Catatan Disiplin Pegawai (PP 94 Tahun 2021)
          </CardTitle>
          <CardDescription className="text-xs">
            Hukuman yang masa berlakunya telah berakhir otomatis beralih status menjadi Tidak Aktif.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pegawai / NIP</TableHead>
                <TableHead>Tingkat Disiplin</TableHead>
                <TableHead>Dasar Pasal Pelanggaran</TableHead>
                <TableHead>TMT Keputusan</TableHead>
                <TableHead>Masa Berlaku</TableHead>
                <TableHead>Dampak Pangkat / Jabatan</TableHead>
                <TableHead className="text-right">Status Masa Berlaku</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Memuat data hukuman disiplin dari database...
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    Tidak ada catatan hukuman disiplin.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-foreground">{item.pegawai_nama || item.pegawai_id}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">NIP. {item.nip || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          getBadgeColor("jenis_disiplin", item.jenis) === "amber"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : getBadgeColor("jenis_disiplin", item.jenis) === "orange"
                            ? "bg-orange-50 text-orange-800 border-orange-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {getLabel("jenis_disiplin", item.jenis, item.jenis)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-foreground max-w-xs truncate">
                      {item.pasal}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.tmt}</TableCell>
                    <TableCell className="text-xs font-semibold tabular-nums">
                      {item.masa_berlaku_bulan} Bulan
                    </TableCell>
                    <TableCell className="text-xs">
                      {item.dampak_pangkat ? (
                        <span className="text-rose-600 font-semibold">Tunda Naik Pangkat</span>
                      ) : (
                        <span className="text-muted-foreground">Tidak Ada Dampak</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          item.status === "aktif"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {getLabel("status_hukuman", item.status, item.status === "aktif" ? "Masih Berlaku" : "Berakhir")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
