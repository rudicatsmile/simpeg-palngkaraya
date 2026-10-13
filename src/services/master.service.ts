"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PerangkatDaerah, Jabatan, Formasi, LowonganInternal, AturanKepangkatan } from "@/types";

export const masterService = {
  async getPerangkatDaerah(): Promise<PerangkatDaerah[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("perangkat_daerah")
      .select("*")
      .order("kode", { ascending: true });

    if (error) {
      console.error("Gagal mengambil perangkat daerah:", error);
      return [];
    }
    return data || [];
  },

  async getJabatan(pdId?: string): Promise<Jabatan[]> {
    const supabase = createClient();
    let query = supabase.from("jabatan").select("*").order("kode", { ascending: true });
    if (pdId && pdId !== "all") {
      query = query.eq("pd_id", pdId);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil jabatan:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      syarat_kompetensi: Array.isArray(row.syarat_kompetensi) ? row.syarat_kompetensi : [],
    }));
  },

  async getFormasi(tahun?: number): Promise<Formasi[]> {
    const supabase = createClient();
    let query = supabase
      .from("formasi")
      .select("*, perangkat_daerah:pd_id(nama), jabatan:jabatan_id(nama)")
      .order("tahun", { ascending: false });
    if (tahun) query = query.eq("tahun", tahun);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil formasi:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pd_nama: row.perangkat_daerah?.nama || "Perangkat Daerah",
      jabatan_nama: row.jabatan?.nama || "Jabatan",
    }));
  },

  async getLowongan(): Promise<LowonganInternal[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lowongan_internal")
      .select("*, jabatan:jabatan_id(nama)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil lowongan:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      jabatan_nama: row.jabatan?.nama || "Jabatan",
    }));
  },

  async getAturanKepangkatan(): Promise<AturanKepangkatan[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("aturan_kepangkatan")
      .select("*")
      .order("golongan_dari", { ascending: true });

    if (error) {
      console.error("Gagal mengambil aturan kepangkatan:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      checklist: Array.isArray(row.checklist) ? row.checklist : [],
    }));
  },
};

export function usePerangkatDaerahList() {
  const [data, setData] = useState<PerangkatDaerah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterService.getPerangkatDaerah().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useJabatanList(pdId?: string) {
  const [data, setData] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterService.getJabatan(pdId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pdId]);

  return { data, loading };
}

export function useFormasiList(tahun?: number) {
  const [data, setData] = useState<Formasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterService.getFormasi(tahun).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [tahun]);

  return { data, loading };
}

export function useLowonganList() {
  const [data, setData] = useState<LowonganInternal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterService.getLowongan().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
