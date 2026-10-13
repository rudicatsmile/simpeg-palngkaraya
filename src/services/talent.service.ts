"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TalentPool } from "@/types";

export const talentService = {
  async getAll(tahun = new Date().getFullYear()): Promise<TalentPool[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("talent_pool")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip,
          jabatan:jabatan_id (nama),
          perangkat_daerah:pd_id (nama)
        )
      `)
      .order("kuadran", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data talent pool:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
      nip: row.pegawai?.nip || "-",
      jabatan_nama: row.pegawai?.jabatan?.nama || "-",
      pd_nama: row.pegawai?.perangkat_daerah?.nama || "-",
      jabatan_target_nama: row.jabatan_target_nama || "Administrator / JPT Pratama",
      kesiapan: row.kesiapan || "siap_sekarang",
      nilai_skp_2thn: row.nilai_skp_2thn || 92.5,
      catatan: row.catatan || "Memenuhi syarat kompetensi manajerial dan integritas",
    }));
  },
};

export function useTalentPoolList(tahun = new Date().getFullYear()) {
  const [data, setData] = useState<TalentPool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    talentService.getAll(tahun).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [tahun]);

  return { data, loading };
}
