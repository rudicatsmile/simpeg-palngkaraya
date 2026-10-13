"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useNotifikasiList, notifikasiService } from "@/services";
import { Notifikasi } from "@/types";
import { Bell, CheckCheck, Filter, ArrowRight, Award, Calendar, TrendingUp, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function NotifikasiPegawaiPage() {
  const [filterKat, setFilterKat] = useState<string>("Semua");
  const { data: dbNotif, loading } = useNotifikasiList();
  const [listNotif, setListNotif] = useState<Notifikasi[]>([]);

  useEffect(() => {
    if (dbNotif) setListNotif(dbNotif);
  }, [dbNotif]);

  const filtered = filterKat === "Semua" ? listNotif : listNotif.filter((n) => n.kategori === filterKat);

  const markAllRead = async () => {
    try {
      await notifikasiService.markAllAsRead();
      setListNotif((prev) => prev.map((n) => ({ ...n, dibaca_at: new Date().toISOString() })));
      toast.success("Semua notifikasi telah ditandai sebagai dibaca.");
    } catch {
      toast.error("Gagal menandai notifikasi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Pusat Pemberitahuan
          </h1>
          <p className="text-xs text-muted-foreground">
            Semua pengingat kenaikan pangkat, persetujuan cuti, dan evaluasi SKP Anda.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
          <CheckCheck className="h-4 w-4" />
          Tandai Semua Dibaca
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Semua", "Kepangkatan", "Cuti", "Kinerja", "Sistem"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterKat(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
              filterKat === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List Notifikasi */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              <p className="text-xs text-muted-foreground mt-2">Memuat notifikasi...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Tidak ada notifikasi untuk kategori {filterKat}.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !item.dibaca_at ? "bg-primary/5" : "hover:bg-muted/30"
                }`}
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {item.kategori}
                    </Badge>
                    {!item.dibaca_at && (
                      <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.pesan}
                  </p>
                </div>

                {item.tautan && (
                  <Link href={item.tautan} className="shrink-0">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                      Buka Halaman
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
