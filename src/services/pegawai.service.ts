"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pegawai } from "@/types";

export function formatPegawai(row: any): Pegawai {
  return {
    id: row.id,
    user_id: row.user_id,
    nip: row.nip,
    nik_masked: row.nik_masked || `${row.nip.slice(0, 6)}******${row.nip.slice(12)}`,
    nama_lengkap: row.nama_lengkap,
    nama: row.nama_lengkap,
    gelar_depan: row.gelar_depan || "",
    gelar_belakang: row.gelar_belakang || "",
    tempat_lahir: row.tempat_lahir || "Palangkaraya",
    tanggal_lahir: row.tanggal_lahir || "1980-01-01",
    jenis_kelamin: row.jenis_kelamin || "L",
    status_kepegawaian: row.status_kepegawaian || "PNS",
    golongan: row.golongan || "III/a",
    pangkat: row.pangkat || "Penata Muda",
    tmt_golongan: row.tmt_golongan || "2020-04-01",
    tmt_cpns: row.tmt_cpns || "2016-01-01",
    tmt_pns: row.tmt_pns || "2017-03-01",
    pendidikan_terakhir: row.pendidikan_terakhir || "S1",
    alamat: row.alamat || "Pemerintah Daerah",
    no_hp: row.no_hp || "-",
    email: row.email || `${row.nip}@daerah.go.id`,
    pd_id: row.pd_id,
    jabatan_id: row.jabatan_id,
    atasan_id: row.atasan_id,
    status: row.status || "aktif",
    tanggal_pensiun: row.tanggal_pensiun || "2040-01-01",
    foto_path: row.foto_path,
    device_user_id: row.device_user_id,
    qr_token: row.qr_token || row.id,
    pd_nama: row.perangkat_daerah?.nama || "Perangkat Daerah",
    jabatan_nama: row.jabatan?.nama || "Jabatan ASN",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const pegawaiService = {
  async getAll(): Promise<Pegawai[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pegawai")
      .select(`
        *,
        perangkat_daerah:pd_id (id, nama, kode),
        jabatan:jabatan_id (id, nama, jenis, eselon)
      `)
      .order("nama_lengkap", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data pegawai dari Supabase:", error);
      return [];
    }
    return (data || []).map(formatPegawai);
  },

  async getById(id: string): Promise<Pegawai | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pegawai")
      .select(`
        *,
        perangkat_daerah:pd_id (id, nama, kode),
        jabatan:jabatan_id (id, nama, jenis, eselon)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return formatPegawai(data);
  },

  async getByNip(nip: string): Promise<Pegawai | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pegawai")
      .select(`
        *,
        perangkat_daerah:pd_id (id, nama, kode),
        jabatan:jabatan_id (id, nama, jenis, eselon)
      `)
      .eq("nip", nip)
      .maybeSingle();

    if (error || !data) return null;
    return formatPegawai(data);
  },

  async getByQrToken(qrToken: string): Promise<Pegawai | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pegawai")
      .select(`
        *,
        perangkat_daerah:pd_id (id, nama, kode),
        jabatan:jabatan_id (id, nama, jenis, eselon)
      `)
      .eq("qr_token", qrToken)
      .maybeSingle();

    if (error || !data) return null;
    return formatPegawai(data);
  },

  async create(payload: any): Promise<Pegawai | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("pegawai").insert([payload]).select().single();
    if (error) {
      console.error("Gagal menambahkan pegawai:", error);
      throw error;
    }
    return formatPegawai(data);
  },

  async update(id: string, payload: any): Promise<Pegawai | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("pegawai").update(payload).eq("id", id).select().single();
    if (error) {
      console.error("Gagal mengupdate pegawai:", error);
      throw error;
    }
    return formatPegawai(data);
  },
};

export function usePegawaiList() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    pegawaiService
      .getAll()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, error, refresh: fetch };
}

export function usePegawai(id?: string) {
  const [data, setData] = useState<Pegawai | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    pegawaiService.getById(id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [id]);

  return { data, loading };
}
