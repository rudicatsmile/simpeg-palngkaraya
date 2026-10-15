"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PerangkatDaerah, Jabatan, Formasi, LowonganInternal, AturanKepangkatan, MasterReferensi, MasterKategoriInfo } from "@/types";

export const MASTER_KATEGORI_LIST: MasterKategoriInfo[] = [
  { kategori: "status_pegawai", nama: "Status Pegawai", deskripsi: "Status aktif, cuti besar, pensiun, dsb." },
  { kategori: "status_cuti", nama: "Status Cuti", deskripsi: "Tahapan alur permohonan cuti ASN" },
  { kategori: "status_workflow", nama: "Status Workflow", deskripsi: "Alur verifikasi & approval layanan mandiri" },
  { kategori: "jenis_disiplin", nama: "Tingkat Disiplin", deskripsi: "Tingkat hukuman disiplin ASN (ringan/sedang/berat)" },
  { kategori: "status_absensi", nama: "Status Kehadiran", deskripsi: "Kategori rekam kehadiran harian pegawai" },
  { kategori: "status_skp", nama: "Status Kinerja SKP", deskripsi: "Tahapan penyusunan hingga finalisasi SKP" },
  { kategori: "status_pd", nama: "Status Perangkat Daerah", deskripsi: "Status operasional unit kerja instansi" },
  { kategori: "jenis_jabatan", nama: "Jenis Jabatan", deskripsi: "Klasifikasi struktural, fungsional, dan pelaksana" },
  { kategori: "jenis_kelamin", nama: "Jenis Kelamin", deskripsi: "Kategori jenis kelamin pegawai" },
  { kategori: "status_kepegawaian", nama: "Status Kepegawaian", deskripsi: "Status ikatan kerja ASN (PNS / PPPK)" },
  { kategori: "jenis_usulan_pangkat", nama: "Jenis Usulan Pangkat", deskripsi: "Kategori kenaikan pangkat (reguler, pilihan, KGB)" },
  { kategori: "jenis_mutasi", nama: "Jenis Mutasi", deskripsi: "Jenis perpindahan jabatan / unit kerja" },
  { kategori: "predikat_skp", nama: "Predikat Kinerja SKP", deskripsi: "Capaian evaluasi predikat kinerja akhir" },
  { kategori: "aspek_skp", nama: "Aspek Target SKP", deskripsi: "Aspek penilaian sasaran kinerja pegawai" },
  { kategori: "jenis_cuti", nama: "Jenis Cuti ASN", deskripsi: "Macam hak cuti ASN beserta aturan dasarnya" },
  { kategori: "jenis_kompetensi", nama: "Kategori Kompetensi", deskripsi: "Kelompok kompetensi manajerial, sosio kultural, teknis" },
  { kategori: "status_hukuman", nama: "Status Hukuman Disiplin", deskripsi: "Masa berlaku hukuman disiplin" },
  { kategori: "status_pensiun_checklist", nama: "Status Syarat Pensiun", deskripsi: "Status verifikasi kelengkapan berkas pensiun" },
  { kategori: "kategori_dokumen", nama: "Kategori Dokumen Digital", deskripsi: "Klasifikasi arsip digital berkas ASN" },
  { kategori: "status_ttd_dokumen", nama: "Status Tanda Tangan", deskripsi: "Status legalitas tanda tangan dokumen" },
  { kategori: "kategori_notifikasi", nama: "Kategori Notifikasi", deskripsi: "Topik pesan pemberitahuan sistem" },
];

export const masterService = {
  // Master Referensi Universal
  async getAllReferensi(onlyActive: boolean = false): Promise<MasterReferensi[]> {
    const supabase = createClient();
    let query = supabase
      .from("master_referensi")
      .select("*")
      .order("kategori", { ascending: true })
      .order("urutan", { ascending: true });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Gagal mengambil master referensi dari database:", error.message);
      return [];
    }
    return data || [];
  },

  async getReferensiByKategori(kategori: string, onlyActive: boolean = true): Promise<MasterReferensi[]> {
    const supabase = createClient();
    let query = supabase
      .from("master_referensi")
      .select("*")
      .eq("kategori", kategori)
      .order("urutan", { ascending: true });

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn(`Gagal mengambil master referensi untuk kategori ${kategori}:`, error.message);
      return [];
    }
    return data || [];
  },

  async createReferensi(
    payload: Omit<MasterReferensi, "id" | "created_at" | "updated_at">
  ): Promise<{ success: boolean; data?: MasterReferensi; error?: string }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("master_referensi")
      .insert({
        kategori: payload.kategori,
        kode: payload.kode.trim().toLowerCase().replace(/\s+/g, "_"),
        nama: payload.nama.trim(),
        deskripsi: payload.deskripsi || "",
        urutan: payload.urutan || 0,
        badge_color: payload.badge_color || "slate",
        is_active: payload.is_active ?? true,
        is_system: payload.is_system ?? false,
        metadata: payload.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Gagal menambah master referensi:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  },

  async updateReferensi(
    id: string,
    payload: Partial<MasterReferensi>
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase
      .from("master_referensi")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Gagal memperbarui master referensi:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteReferensi(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    // Cek apakah item sistem
    const { data: item } = await supabase
      .from("master_referensi")
      .select("is_system")
      .eq("id", id)
      .single();

    if (item?.is_system) {
      return {
        success: false,
        error: "Item referensi bawaan sistem tidak boleh dihapus. Anda hanya dapat menonaktifkannya.",
      };
    }

    const { error } = await supabase.from("master_referensi").delete().eq("id", id);
    if (error) {
      console.error("Gagal menghapus master referensi:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async toggleActiveReferensi(
    id: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateReferensi(id, { is_active: isActive });
  },
  async getPerangkatDaerah(onlyActive: boolean = true): Promise<PerangkatDaerah[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("perangkat_daerah")
      .select("*")
      .order("kode", { ascending: true });

    if (error) {
      console.error("Gagal mengambil perangkat daerah:", error);
      return [];
    }

    const items: PerangkatDaerah[] = (data || []).map((row) => ({
      id: row.id,
      kode: row.kode || "",
      nama: row.nama || "",
      parent_id: row.parent_id,
      status: row.status || "aktif",
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at,
    }));

    if (onlyActive) {
      return items.filter((row) => row.status === "aktif");
    }

    return items;
  },

  async getPerangkatDaerahById(id: string): Promise<PerangkatDaerah | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("perangkat_daerah")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Gagal mengambil perangkat daerah by ID:", error);
      return null;
    }

    return {
      id: data.id,
      kode: data.kode || "",
      nama: data.nama || "",
      parent_id: data.parent_id,
      status: data.status || "aktif",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
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

export function usePerangkatDaerahList(onlyActive: boolean = true) {
  const [data, setData] = useState<PerangkatDaerah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    masterService.getPerangkatDaerah(onlyActive).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [onlyActive]);

  return { data, loading };
}

export async function getPerangkatDaerahList(onlyActive: boolean = true): Promise<PerangkatDaerah[]> {
  return masterService.getPerangkatDaerah(onlyActive);
}

export async function getActivePerangkatDaerah(): Promise<PerangkatDaerah[]> {
  return masterService.getPerangkatDaerah(true);
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
