"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dokumen } from "@/types";

export function formatDokumen(row: any): Dokumen {
  return {
    id: row.id,
    pegawai_id: row.pegawai_id,
    kategori: row.kategori || "Lainnya",
    judul: row.judul || row.nama || "Dokumen Kepegawaian",
    storage_path: row.file_path || row.storage_path || `arsip/${row.id}.pdf`,
    versi: row.versi || 1,
    checksum: row.checksum || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status_persetujuan: row.status_persetujuan || "disetujui",
    ttd_status: row.ttd_status || "tte",
    created_at: row.created_at || new Date().toISOString(),
    pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
  };
}

export const dokumenService = {
  async getAll(pegawaiId?: string): Promise<Dokumen[]> {
    const supabase = createClient();
    let query = supabase
      .from("dokumen")
      .select("*, pegawai:pegawai_id(id, nama_lengkap, nip)")
      .order("created_at", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data dokumen:", error);
      return [];
    }
    return (data || []).map(formatDokumen);
  },

  async getById(id: string): Promise<Dokumen | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dokumen")
      .select("*, pegawai:pegawai_id(id, nama_lengkap, nip)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return formatDokumen(data);
  },

  async create(payload: any): Promise<Dokumen | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("dokumen").insert([payload]).select().single();
    if (error) {
      console.error("Gagal menyimpan dokumen:", error);
      throw error;
    }
    return formatDokumen(data);
  },
};

export function useDokumenList(pegawaiId?: string) {
  const [data, setData] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    dokumenService.getAll(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, [pegawaiId]);

  return { data, loading, refresh: fetch };
}
