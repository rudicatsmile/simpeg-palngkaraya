"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UsulanKenaikanPangkat, RiwayatPangkat, AturanKepangkatan } from "@/types";

export function formatUsulanPangkat(row: any): UsulanKenaikanPangkat {
  return {
    id: row.id,
    pegawai_id: row.pegawai_id,
    jenis: row.jenis,
    golongan_tujuan: row.golongan_tujuan,
    tmt_usulan: row.tmt_usulan,
    status: row.status,
    checklist_status: typeof row.checklist_status === "object" && row.checklist_status !== null ? row.checklist_status : {},
    catatan: row.catatan || "",
    created_at: row.created_at,
    pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
    pegawai_nip: row.pegawai?.nip || "-",
    golongan_asal: row.pegawai?.golongan || "III/a",
    pangkat_asal: row.pegawai?.pangkat || "Penata Muda",
    pd_nama: row.pegawai?.perangkat_daerah?.nama || "Perangkat Daerah",
  };
}

export const kepangkatanService = {
  async getUsulan(pegawaiId?: string): Promise<UsulanKenaikanPangkat[]> {
    const supabase = createClient();
    let query = supabase
      .from("usulan_kenaikan_pangkat")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, golongan, pangkat, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .order("created_at", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil usulan kenaikan pangkat:", error);
      return [];
    }
    return (data || []).map(formatUsulanPangkat);
  },

  async getUsulanById(id: string): Promise<UsulanKenaikanPangkat | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("usulan_kenaikan_pangkat")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, golongan, pangkat, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("Gagal mengambil detail usulan pangkat:", error);
      return null;
    }
    return formatUsulanPangkat(data);
  },

  async updateUsulan(id: string, updates: Record<string, any>): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from("usulan_kenaikan_pangkat")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Gagal update usulan pangkat:", error);
      return false;
    }
    return true;
  },

  async getRiwayat(pegawaiId?: string): Promise<RiwayatPangkat[]> {
    const supabase = createClient();
    let query = supabase.from("riwayat_pangkat").select("*").order("tmt", { ascending: false });
    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil riwayat pangkat:", error);
      return [];
    }
    return data || [];
  },

  async getAturan(): Promise<AturanKepangkatan[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("aturan_kepangkatan")
      .select("*")
      .order("golongan_dari");

    if (error) {
      console.error("Gagal mengambil aturan kepangkatan:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      checklist: Array.isArray(row.checklist) ? row.checklist : [],
    }));
  },

  async updateAturan(id: string, updates: Partial<AturanKepangkatan>): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from("aturan_kepangkatan")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Gagal update aturan kepangkatan:", error);
      return false;
    }
    return true;
  },
};

export function useUsulanPangkatList(pegawaiId?: string) {
  const [data, setData] = useState<UsulanKenaikanPangkat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    kepangkatanService.getUsulan(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, [pegawaiId]);

  return { data, loading, refresh: fetch };
}

export function useRiwayatPangkatList(pegawaiId?: string) {
  const [data, setData] = useState<RiwayatPangkat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kepangkatanService.getRiwayat(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pegawaiId]);

  return { data, loading };
}

export function useAturanKepangkatanList() {
  const [data, setData] = useState<AturanKepangkatan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    kepangkatanService.getAturan().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, refresh: fetch };
}
