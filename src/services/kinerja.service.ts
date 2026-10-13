"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SKP } from "@/types";

export function formatSKP(row: any): SKP {
  return {
    id: row.id,
    pegawai_id: row.pegawai_id,
    tahun: row.tahun,
    status: row.status,
    nilai_akhir: row.nilai_akhir ? Number(row.nilai_akhir) : undefined,
    predikat: row.predikat || "-",
    pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
    pegawai_nip: row.pegawai?.nip || "-",
    pd_nama: row.pegawai?.perangkat_daerah?.nama || "Perangkat Daerah",
    targets: Array.isArray(row.targets) ? row.targets : [],
  };
}

export const kinerjaService = {
  async getSKP(pegawaiId?: string): Promise<SKP[]> {
    const supabase = createClient();
    let query = supabase
      .from("skp")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .order("tahun", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data SKP:", error);
      return [];
    }
    return (data || []).map(formatSKP);
  },

  async getById(id: string): Promise<SKP | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("skp")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return formatSKP(data);
  },

  async update(id: string, payload: any): Promise<SKP | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("skp")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Gagal update SKP:", error);
      throw error;
    }
    return data;
  },
};

export function useSKPList(pegawaiId?: string) {
  const [data, setData] = useState<SKP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    kinerjaService.getSKP(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, [pegawaiId]);

  return { data, loading, refresh: fetch };
}
