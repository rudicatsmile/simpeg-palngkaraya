"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { HukumanDisiplin, Mutasi } from "@/types";

export const disiplinService = {
  async getAll(pegawaiId?: string): Promise<HukumanDisiplin[]> {
    const supabase = createClient();
    let query = supabase
      .from("hukuman_disiplin")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .order("tanggal_sk", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data disiplin:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
      pegawai_nip: row.pegawai?.nip || "-",
      pd_nama: row.pegawai?.perangkat_daerah?.nama || "Perangkat Daerah",
    }));
  },
};

export const mutasiService = {
  async getAll(pegawaiId?: string): Promise<Mutasi[]> {
    const supabase = createClient();
    let query = supabase
      .from("mutasi")
      .select(`
        *,
        pegawai:pegawai_id (id, nama_lengkap, nip),
        pd_asal:pd_asal_id (id, nama),
        pd_tujuan:pd_tujuan_id (id, nama),
        jabatan_tujuan:jabatan_tujuan_id (id, nama)
      `)
      .order("created_at", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data mutasi:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
      pegawai_nip: row.pegawai?.nip || "-",
      pd_asal_nama: row.pd_asal?.nama || "-",
      pd_tujuan_nama: row.pd_tujuan?.nama || "-",
      jabatan_tujuan_nama: row.jabatan_tujuan?.nama || "-",
    }));
  },

  async create(payload: any): Promise<Mutasi | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("mutasi").insert([payload]).select().single();
    if (error) {
      console.error("Gagal menambahkan usulan mutasi:", error);
      throw error;
    }
    return data;
  },
};

export function useDisiplinList(pegawaiId?: string) {
  const [data, setData] = useState<HukumanDisiplin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    disiplinService.getAll(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pegawaiId]);

  return { data, loading };
}

export function useMutasiList(pegawaiId?: string) {
  const [data, setData] = useState<Mutasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutasiService.getAll(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pegawaiId]);

  return { data, loading };
}
