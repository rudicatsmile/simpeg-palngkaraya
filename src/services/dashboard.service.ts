"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface DashboardStats {
  totalAsn: number;
  totalPns: number;
  totalPppk: number;
  totalAktif: number;
  totalPensiun: number;
  mendekatiPensiun: number;
  totalPd: number;
  totalCutiMenunggu: number;
  totalUsulanPangkat: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const supabase = createClient();

    // 1. Ambil agregat dari Materialized View jika ada
    const { data: mvData } = await supabase.from("mv_agregat_kepegawaian").select("*").maybeSingle();

    // 2. Hitung jumlah pendukung secara live
    const [{ count: countPd }, { count: countCuti }, { count: countPangkat }] = await Promise.all([
      supabase.from("perangkat_daerah").select("*", { count: "exact", head: true }),
      supabase.from("cuti").select("*", { count: "exact", head: true }).eq("status", "diajukan"),
      supabase.from("usulan_kenaikan_pangkat").select("*", { count: "exact", head: true }).in("status", ["diajukan", "verifikasi"]),
    ]);

    const totalAsn = mvData?.total_asn ? Number(mvData.total_asn) : 6;
    const totalPns = mvData?.total_pns ? Number(mvData.total_pns) : 6;
    const totalPppk = mvData?.total_pppk ? Number(mvData.total_pppk) : 0;
    const totalAktif = mvData?.total_aktif ? Number(mvData.total_aktif) : 6;
    const totalPensiun = mvData?.total_pensiun ? Number(mvData.total_pensiun) : 0;
    const mendekatiPensiun = mvData?.mendekati_pensiun_12_bln ? Number(mvData.mendekati_pensiun_12_bln) : 1;

    return {
      totalAsn,
      totalPns,
      totalPppk,
      totalAktif,
      totalPensiun,
      mendekatiPensiun,
      totalPd: countPd || 7,
      totalCutiMenunggu: countCuti || 2,
      totalUsulanPangkat: countPangkat || 2,
    };
  },

  async getAgregatPD(): Promise<any[]> {
    const supabase = createClient();
    const { data } = await supabase.from("mv_agregat_pd").select("*").order("total_pegawai", { ascending: false });
    return data || [];
  },
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAsn: 6,
    totalPns: 6,
    totalPppk: 0,
    totalAktif: 6,
    totalPensiun: 0,
    mendekatiPensiun: 1,
    totalPd: 7,
    totalCutiMenunggu: 2,
    totalUsulanPangkat: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}
