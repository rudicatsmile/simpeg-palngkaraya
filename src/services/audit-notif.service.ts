"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notifikasi, AuditLog, PerubahanDataPegawai } from "@/types";

export const notifikasiService = {
  async getAll(): Promise<Notifikasi[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifikasi")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Gagal mengambil notifikasi:", error);
      return [];
    }
    return data || [];
  },

  async markAllAsRead(): Promise<void> {
    const supabase = createClient();
    await supabase.from("notifikasi").update({ dibaca_at: new Date().toISOString() }).is("dibaca_at", null);
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = createClient();
    await supabase.from("notifikasi").update({ dibaca_at: new Date().toISOString() }).eq("id", id);
  },
};

export const auditService = {
  async getAll(limit = 50): Promise<AuditLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Gagal mengambil audit log:", error);
      return [];
    }
    return data || [];
  },
};

export const perubahanDataService = {
  async getAll(pegawaiId?: string): Promise<PerubahanDataPegawai[]> {
    const supabase = createClient();
    let query = supabase
      .from("perubahan_data_pegawai")
      .select("*, pegawai:pegawai_id(nama_lengkap, nip)")
      .order("diajukan_at", { ascending: false });

    if (pegawaiId) query = query.eq("pegawai_id", pegawaiId);

    const { data, error } = await query;
    if (error) {
      console.error("Gagal mengambil perubahan data:", error);
      return [];
    }
    return (data || []).map((row) => ({
      ...row,
      pegawai_nama: row.pegawai?.nama_lengkap || "Nama Pegawai",
      pegawai_nip: row.pegawai?.nip || "-",
    }));
  },
  async updateStatus(id: string, status: "disetujui" | "ditolak", diputuskanOleh = "Operator BKPSDM"): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from("perubahan_data_pegawai")
      .update({
        status,
        diputuskan_oleh: diputuskanOleh,
        diputuskan_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Gagal update status perubahan data:", error);
      return false;
    }
    return true;
  },
};

export function useNotifikasiList() {
  const [data, setData] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notifikasiService.getAll().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useAuditLogList(limit = 50) {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.getAll(limit).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [limit]);

  return { data, loading };
}

export function usePerubahanDataList(pegawaiId?: string) {
  const [data, setData] = useState<PerubahanDataPegawai[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    perubahanDataService.getAll(pegawaiId).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [pegawaiId]);

  return { data, loading };
}
