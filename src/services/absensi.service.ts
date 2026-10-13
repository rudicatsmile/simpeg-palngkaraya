"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Absensi } from "@/types";

export function formatAbsensi(row: any): Absensi {
  return {
    id: row.id,
    pegawai_id: row.pegawai_id,
    tanggal: row.tanggal,
    jam_masuk: row.jam_masuk,
    jam_pulang: row.jam_pulang,
    status: row.status,
    sumber: row.sumber,
    device_id: row.device_id,
    pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
    pegawai_nip: row.pegawai?.nip || "-",
    pd_nama: row.pegawai?.perangkat_daerah?.nama || "Perangkat Daerah",
  };
}

export const absensiService = {
  async getAll(pegawaiId?: string, tanggal?: string): Promise<Absensi[]> {
    const supabase = createClient();
    let query = supabase
      .from("absensi")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .order("tanggal", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);
    if (tanggal) query = query.eq("tanggal", tanggal);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data absensi:", error);
      return [];
    }
    return (data || []).map(formatAbsensi);
  },
};

export function useAbsensiList(pegawaiId?: string, tanggal?: string) {
  const [data, setData] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    absensiService.getAll(pegawaiId, tanggal).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, [pegawaiId, tanggal]);

  return { data, loading, refresh: fetch };
}
