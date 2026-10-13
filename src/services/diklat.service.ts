"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Diklat, PegawaiDiklat } from "@/types";

export const diklatService = {
  async getDiklat(): Promise<Diklat[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from("diklat").select("*").order("nama", { ascending: true });
    if (error) {
      console.error("Gagal mengambil data diklat:", error);
      return [];
    }
    return (data || []).map((d) => ({
      ...d,
      kompetensi_terkait: Array.isArray(d.kompetensi_terkait) ? d.kompetensi_terkait : [],
    }));
  },

  async getPegawaiDiklat(pegawaiId?: string): Promise<PegawaiDiklat[]> {
    const supabase = createClient();
    let query = supabase
      .from("pegawai_diklat")
      .select("*, pegawai:pegawai_id(id, nama_lengkap), diklat:diklat_id(id, nama, jenis, penyelenggara, jam_pelajaran)")
      .order("created_at", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil riwayat diklat pegawai:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
      diklat_nama: row.diklat?.nama || "Pelatihan Diklat",
      diklat: row.diklat,
    }));
  },

  async createPegawaiDiklat(payload: Partial<PegawaiDiklat>): Promise<PegawaiDiklat | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("pegawai_diklat").insert([payload]).select().single();
    if (error) {
      console.error("Gagal mengajukan usulan diklat:", error);
      throw error;
    }
    return data;
  },

  async updatePegawaiDiklatStatus(id: string, status: "disetujui" | "ditolak" | "selesai"): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("pegawai_diklat").update({ status }).eq("id", id);
    if (error) {
      console.error("Gagal memperbarui status diklat:", error);
      return false;
    }
    return true;
  },
};

export function useDiklatList() {
  const [data, setData] = useState<Diklat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    diklatService.getDiklat().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function usePegawaiDiklatList(pegawaiId?: string) {
  const [data, setData] = useState<PegawaiDiklat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    diklatService.getPegawaiDiklat(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pegawaiId]);

  return { data, loading };
}
