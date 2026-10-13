"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Cuti } from "@/types";

export function formatCuti(row: any): Cuti {
  return {
    id: row.id,
    pegawai_id: row.pegawai_id,
    jenis: row.jenis,
    tanggal_mulai: row.tanggal_mulai,
    tanggal_selesai: row.tanggal_selesai,
    jumlah_hari: row.jumlah_hari,
    alasan: row.alasan,
    status: row.status,
    dokumen_id: row.dokumen_id,
    created_at: row.created_at,
    pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
    pegawai_nip: row.pegawai?.nip || "-",
    pd_nama: row.pegawai?.perangkat_daerah?.nama || "Perangkat Daerah",
  };
}

export const cutiService = {
  async getAll(pegawaiId?: string): Promise<Cuti[]> {
    const supabase = createClient();
    let query = supabase
      .from("cuti")
      .select(`
        *,
        pegawai:pegawai_id (
          id, nama_lengkap, nip, pd_id,
          perangkat_daerah:pd_id (id, nama)
        )
      `)
      .order("created_at", { ascending: false });

    if (pegawaiId) {
      query = query.eq("pegawai_id", pegawaiId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil data cuti:", error);
      return [];
    }
    return (data || []).map(formatCuti);
  },

  async getById(id: string): Promise<Cuti | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cuti")
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
    return formatCuti(data);
  },

  async getSaldo(pegawaiId: string, tahun = new Date().getFullYear()): Promise<{ jatah: number; terpakai: number; sisa: number }> {
    const supabase = createClient();
    const { data } = await supabase
      .from("saldo_cuti")
      .select("jatah, terpakai")
      .eq("pegawai_id", pegawaiId)
      .eq("tahun", tahun)
      .maybeSingle();

    const jatah = data?.jatah ?? 12;
    const terpakai = data?.terpakai ?? 0;
    return {
      jatah,
      terpakai,
      sisa: Math.max(0, jatah - terpakai),
    };
  },

  async updateStatus(id: string, status: Cuti["status"], catatan?: string): Promise<Cuti | null> {
    const supabase = createClient();
    const updatePayload: any = { status };
    if (catatan) updatePayload.catatan = catatan;
    const { data, error } = await supabase.from("cuti").update(updatePayload).eq("id", id).select().single();
    if (error) {
      console.error("Gagal update status cuti:", error);
      throw error;
    }
    return data;
  },
};

export function useCutiList(pegawaiId?: string) {
  const [data, setData] = useState<Cuti[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    cutiService.getAll(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetch();
  }, [pegawaiId]);

  return { data, loading, refresh: fetch };
}

export function useSaldoCuti(pegawaiId?: string, tahun = new Date().getFullYear()) {
  const [saldo, setSaldo] = useState({ jatah: 12, terpakai: 0, sisa: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pegawaiId) {
      setLoading(false);
      return;
    }
    cutiService.getSaldo(pegawaiId, tahun).then((res) => {
      setSaldo(res);
      setLoading(false);
    });
  }, [pegawaiId, tahun]);

  return { saldo, loading };
}
