"use client";

import { useState, useEffect, useCallback } from "react";
import { MasterReferensi, MasterKategoriInfo } from "@/types";
import { masterService, MASTER_KATEGORI_LIST } from "@/services/master.service";

// Fallback data bawaan jika offline atau Supabase belum selesai memuat
export const DEFAULT_MASTER_REFERENSI: MasterReferensi[] = [
  // 1. Status Pegawai
  { id: "sp-1", kategori: "status_pegawai", kode: "aktif", nama: "Aktif", urutan: 1, badge_color: "emerald", is_active: true, is_system: true },
  { id: "sp-2", kategori: "status_pegawai", kode: "cuti_besar", nama: "Cuti Besar", urutan: 2, badge_color: "amber", is_active: true, is_system: true },
  { id: "sp-3", kategori: "status_pegawai", kode: "diberhentikan", nama: "Diberhentikan", urutan: 3, badge_color: "rose", is_active: true, is_system: true },
  { id: "sp-4", kategori: "status_pegawai", kode: "pensiun", nama: "Pensiun", urutan: 4, badge_color: "blue", is_active: true, is_system: true },
  { id: "sp-5", kategori: "status_pegawai", kode: "meninggal", nama: "Meninggal Dunia", urutan: 5, badge_color: "slate", is_active: true, is_system: true },

  // 2. Status Cuti
  { id: "sc-1", kategori: "status_cuti", kode: "draft", nama: "Draft", urutan: 1, badge_color: "slate", is_active: true, is_system: true },
  { id: "sc-2", kategori: "status_cuti", kode: "diajukan", nama: "Diajukan", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "sc-3", kategori: "status_cuti", kode: "disetujui_atasan", nama: "Disetujui Atasan", urutan: 3, badge_color: "cyan", is_active: true, is_system: true },
  { id: "sc-4", kategori: "status_cuti", kode: "disetujui_kepala_pd", nama: "Disetujui Kepala PD", urutan: 4, badge_color: "emerald", is_active: true, is_system: true },
  { id: "sc-5", kategori: "status_cuti", kode: "ditolak", nama: "Ditolak", urutan: 5, badge_color: "rose", is_active: true, is_system: true },
  { id: "sc-6", kategori: "status_cuti", kode: "dibatalkan", nama: "Dibatalkan", urutan: 6, badge_color: "slate", is_active: true, is_system: true },
  { id: "sc-7", kategori: "status_cuti", kode: "selesai", nama: "Selesai", urutan: 7, badge_color: "emerald", is_active: true, is_system: true },

  // 3. Status Workflow
  { id: "sw-1", kategori: "status_workflow", kode: "draft", nama: "Draft", urutan: 1, badge_color: "slate", is_active: true, is_system: true },
  { id: "sw-2", kategori: "status_workflow", kode: "diajukan", nama: "Diajukan", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "sw-3", kategori: "status_workflow", kode: "verifikasi", nama: "Dalam Verifikasi", urutan: 3, badge_color: "amber", is_active: true, is_system: true },
  { id: "sw-4", kategori: "status_workflow", kode: "disetujui", nama: "Disetujui", urutan: 4, badge_color: "emerald", is_active: true, is_system: true },
  { id: "sw-5", kategori: "status_workflow", kode: "ditolak", nama: "Ditolak", urutan: 5, badge_color: "rose", is_active: true, is_system: true },
  { id: "sw-6", kategori: "status_workflow", kode: "selesai", nama: "Selesai", urutan: 6, badge_color: "teal", is_active: true, is_system: true },

  // 4. Jenis Disiplin
  { id: "jd-1", kategori: "jenis_disiplin", kode: "ringan", nama: "Tingkat Ringan", urutan: 1, badge_color: "amber", is_active: true, is_system: true },
  { id: "jd-2", kategori: "jenis_disiplin", kode: "sedang", nama: "Tingkat Sedang", urutan: 2, badge_color: "orange", is_active: true, is_system: true },
  { id: "jd-3", kategori: "jenis_disiplin", kode: "berat", nama: "Tingkat Berat", urutan: 3, badge_color: "rose", is_active: true, is_system: true },

  // 5. Status Absensi
  { id: "sa-1", kategori: "status_absensi", kode: "hadir", nama: "Hadir", urutan: 1, badge_color: "emerald", is_active: true, is_system: true },
  { id: "sa-2", kategori: "status_absensi", kode: "terlambat", nama: "Terlambat", urutan: 2, badge_color: "amber", is_active: true, is_system: true },
  { id: "sa-3", kategori: "status_absensi", kode: "izin", nama: "Izin", urutan: 3, badge_color: "blue", is_active: true, is_system: true },
  { id: "sa-4", kategori: "status_absensi", kode: "sakit", nama: "Sakit", urutan: 4, badge_color: "cyan", is_active: true, is_system: true },
  { id: "sa-5", kategori: "status_absensi", kode: "cuti", nama: "Cuti", urutan: 5, badge_color: "violet", is_active: true, is_system: true },
  { id: "sa-6", kategori: "status_absensi", kode: "alpha", nama: "Alpha", urutan: 6, badge_color: "rose", is_active: true, is_system: true },
  { id: "sa-7", kategori: "status_absensi", kode: "dinas_luar", nama: "Dinas Luar", urutan: 7, badge_color: "indigo", is_active: true, is_system: true },

  // 6. Status SKP
  { id: "sskp-1", kategori: "status_skp", kode: "draft", nama: "Draft Rencana", urutan: 1, badge_color: "slate", is_active: true, is_system: true },
  { id: "sskp-2", kategori: "status_skp", kode: "ditetapkan", nama: "Ditetapkan", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "sskp-3", kategori: "status_skp", kode: "dinilai", nama: "Sedang Dinilai", urutan: 3, badge_color: "amber", is_active: true, is_system: true },
  { id: "sskp-4", kategori: "status_skp", kode: "final", nama: "Final Disahkan", urutan: 4, badge_color: "emerald", is_active: true, is_system: true },

  // 7. Status Perangkat Daerah
  { id: "spd-1", kategori: "status_pd", kode: "aktif", nama: "Aktif", urutan: 1, badge_color: "emerald", is_active: true, is_system: true },
  { id: "spd-2", kategori: "status_pd", kode: "nonaktif", nama: "Non-Aktif", urutan: 2, badge_color: "slate", is_active: true, is_system: true },

  // 8. Jenis Jabatan
  { id: "jj-1", kategori: "jenis_jabatan", kode: "struktural", nama: "Struktural", urutan: 1, badge_color: "indigo", is_active: true, is_system: true },
  { id: "jj-2", kategori: "jenis_jabatan", kode: "fungsional", nama: "Fungsional", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "jj-3", kategori: "jenis_jabatan", kode: "pelaksana", nama: "Pelaksana", urutan: 3, badge_color: "cyan", is_active: true, is_system: true },

  // 9. Jenis Kelamin
  { id: "jk-1", kategori: "jenis_kelamin", kode: "L", nama: "Laki-Laki", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "jk-2", kategori: "jenis_kelamin", kode: "P", nama: "Perempuan", urutan: 2, badge_color: "rose", is_active: true, is_system: true },

  // 10. Status Kepegawaian
  { id: "skp-1", kategori: "status_kepegawaian", kode: "PNS", nama: "PNS", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "skp-2", kategori: "status_kepegawaian", kode: "PPPK", nama: "PPPK", urutan: 2, badge_color: "teal", is_active: true, is_system: true },

  // 11. Jenis Usulan Kenaikan Pangkat
  { id: "jup-1", kategori: "jenis_usulan_pangkat", kode: "reguler", nama: "Reguler", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "jup-2", kategori: "jenis_usulan_pangkat", kode: "pilihan", nama: "Pilihan", urutan: 2, badge_color: "indigo", is_active: true, is_system: true },
  { id: "jup-3", kategori: "jenis_usulan_pangkat", kode: "kgb", nama: "Kenaikan Gaji Berkala (KGB)", urutan: 3, badge_color: "emerald", is_active: true, is_system: true },

  // 12. Jenis Mutasi
  { id: "jm-1", kategori: "jenis_mutasi", kode: "mutasi", nama: "Mutasi", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "jm-2", kategori: "jenis_mutasi", kode: "rotasi", nama: "Rotasi", urutan: 2, badge_color: "amber", is_active: true, is_system: true },
  { id: "jm-3", kategori: "jenis_mutasi", kode: "promosi", nama: "Promosi", urutan: 3, badge_color: "emerald", is_active: true, is_system: true },

  // 13. Predikat Kinerja SKP
  { id: "pskp-1", kategori: "predikat_skp", kode: "Sangat Baik", nama: "Sangat Baik", urutan: 1, badge_color: "emerald", is_active: true, is_system: true },
  { id: "pskp-2", kategori: "predikat_skp", kode: "Baik", nama: "Baik", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "pskp-3", kategori: "predikat_skp", kode: "Cukup", nama: "Cukup", urutan: 3, badge_color: "amber", is_active: true, is_system: true },
  { id: "pskp-4", kategori: "predikat_skp", kode: "Kurang", nama: "Kurang", urutan: 4, badge_color: "orange", is_active: true, is_system: true },
  { id: "pskp-5", kategori: "predikat_skp", kode: "Sangat Kurang", nama: "Sangat Kurang", urutan: 5, badge_color: "rose", is_active: true, is_system: true },

  // 14. Aspek SKP
  { id: "askp-1", kategori: "aspek_skp", kode: "kuantitas", nama: "Kuantitas", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "askp-2", kategori: "aspek_skp", kode: "kualitas", nama: "Kualitas", urutan: 2, badge_color: "emerald", is_active: true, is_system: true },
  { id: "askp-3", kategori: "aspek_skp", kode: "waktu", nama: "Waktu", urutan: 3, badge_color: "amber", is_active: true, is_system: true },
  { id: "askp-4", kategori: "aspek_skp", kode: "biaya", nama: "Biaya", urutan: 4, badge_color: "violet", is_active: true, is_system: true },

  // 15. Jenis Cuti
  { id: "jc-1", kategori: "jenis_cuti", kode: "tahunan", nama: "Cuti Tahunan", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "jc-2", kategori: "jenis_cuti", kode: "besar", nama: "Cuti Besar", urutan: 2, badge_color: "indigo", is_active: true, is_system: true },
  { id: "jc-3", kategori: "jenis_cuti", kode: "sakit", nama: "Cuti Sakit", urutan: 3, badge_color: "amber", is_active: true, is_system: true },
  { id: "jc-4", kategori: "jenis_cuti", kode: "melahirkan", nama: "Cuti Melahirkan", urutan: 4, badge_color: "rose", is_active: true, is_system: true },
  { id: "jc-5", kategori: "jenis_cuti", kode: "alasan_penting", nama: "Cuti Alasan Penting", urutan: 5, badge_color: "orange", is_active: true, is_system: true },
  { id: "jc-6", kategori: "jenis_cuti", kode: "di_luar_tanggungan", nama: "Cuti di Luar Tanggungan", urutan: 6, badge_color: "slate", is_active: true, is_system: true },

  // 16. Jenis Kompetensi
  { id: "jkom-1", kategori: "jenis_kompetensi", kode: "Manajerial", nama: "Manajerial", urutan: 1, badge_color: "indigo", is_active: true, is_system: true },
  { id: "jkom-2", kategori: "jenis_kompetensi", kode: "Sosio Kultural", nama: "Sosio Kultural", urutan: 2, badge_color: "teal", is_active: true, is_system: true },
  { id: "jkom-3", kategori: "jenis_kompetensi", kode: "Teknis", nama: "Teknis", urutan: 3, badge_color: "blue", is_active: true, is_system: true },

  // 17. Status Hukuman
  { id: "sh-1", kategori: "status_hukuman", kode: "aktif", nama: "Aktif", urutan: 1, badge_color: "rose", is_active: true, is_system: true },
  { id: "sh-2", kategori: "status_hukuman", kode: "berakhir", nama: "Berakhir", urutan: 2, badge_color: "emerald", is_active: true, is_system: true },

  // 18. Status Pensiun Checklist
  { id: "spc-1", kategori: "status_pensiun_checklist", kode: "belum", nama: "Belum", urutan: 1, badge_color: "slate", is_active: true, is_system: true },
  { id: "spc-2", kategori: "status_pensiun_checklist", kode: "proses", nama: "Proses", urutan: 2, badge_color: "amber", is_active: true, is_system: true },
  { id: "spc-3", kategori: "status_pensiun_checklist", kode: "lengkap", nama: "Lengkap", urutan: 3, badge_color: "emerald", is_active: true, is_system: true },

  // 19. Kategori Dokumen
  { id: "kd-1", kategori: "kategori_dokumen", kode: "SK CPNS/PNS", nama: "SK CPNS/PNS", urutan: 1, badge_color: "blue", is_active: true, is_system: true },
  { id: "kd-2", kategori: "kategori_dokumen", kode: "SK Pangkat", nama: "SK Pangkat", urutan: 2, badge_color: "indigo", is_active: true, is_system: true },
  { id: "kd-3", kategori: "kategori_dokumen", kode: "SK Jabatan", nama: "SK Jabatan", urutan: 3, badge_color: "violet", is_active: true, is_system: true },
  { id: "kd-4", kategori: "kategori_dokumen", kode: "Ijazah", nama: "Ijazah", urutan: 4, badge_color: "teal", is_active: true, is_system: true },
  { id: "kd-5", kategori: "kategori_dokumen", kode: "KTP", nama: "KTP", urutan: 5, badge_color: "cyan", is_active: true, is_system: true },
  { id: "kd-6", kategori: "kategori_dokumen", kode: "Sertifikat", nama: "Sertifikat", urutan: 6, badge_color: "emerald", is_active: true, is_system: true },
  { id: "kd-7", kategori: "kategori_dokumen", kode: "Surat Cuti", nama: "Surat Cuti", urutan: 7, badge_color: "amber", is_active: true, is_system: true },
  { id: "kd-8", kategori: "kategori_dokumen", kode: "Lainnya", nama: "Lainnya", urutan: 8, badge_color: "slate", is_active: true, is_system: true },

  // 20. Status TTD Dokumen
  { id: "sttd-1", kategori: "status_ttd_dokumen", kode: "belum", nama: "Belum", urutan: 1, badge_color: "slate", is_active: true, is_system: true },
  { id: "sttd-2", kategori: "status_ttd_dokumen", kode: "internal", nama: "Internal", urutan: 2, badge_color: "amber", is_active: true, is_system: true },
  { id: "sttd-3", kategori: "status_ttd_dokumen", kode: "tte", nama: "TTE BSrE", urutan: 3, badge_color: "emerald", is_active: true, is_system: true },

  // 21. Kategori Notifikasi
  { id: "kn-1", kategori: "kategori_notifikasi", kode: "Kepangkatan", nama: "Kepangkatan", urutan: 1, badge_color: "indigo", is_active: true, is_system: true },
  { id: "kn-2", kategori: "kategori_notifikasi", kode: "Cuti", nama: "Cuti", urutan: 2, badge_color: "blue", is_active: true, is_system: true },
  { id: "kn-3", kategori: "kategori_notifikasi", kode: "Disiplin", nama: "Disiplin", urutan: 3, badge_color: "rose", is_active: true, is_system: true },
  { id: "kn-4", kategori: "kategori_notifikasi", kode: "Kinerja", nama: "Kinerja", urutan: 4, badge_color: "amber", is_active: true, is_system: true },
  { id: "kn-5", kategori: "kategori_notifikasi", kode: "Pensiun", nama: "Pensiun", urutan: 5, badge_color: "teal", is_active: true, is_system: true },
  { id: "kn-6", kategori: "kategori_notifikasi", kode: "Sistem", nama: "Sistem", urutan: 6, badge_color: "slate", is_active: true, is_system: true },
];

// Global in-memory cache
let globalMasterDataCache: MasterReferensi[] = [...DEFAULT_MASTER_REFERENSI];
let globalListeners: Array<(data: MasterReferensi[]) => void> = [];

const notifyListeners = () => {
  globalListeners.forEach((listener) => listener([...globalMasterDataCache]));
};

export function useMasterReferensi(kategoriFilter?: string) {
  const [items, setItems] = useState<MasterReferensi[]>(globalMasterDataCache);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync dengan global listener
  useEffect(() => {
    const listener = (newData: MasterReferensi[]) => {
      setItems(newData);
    };
    globalListeners.push(listener);

    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener);
    };
  }, []);

  // Fetch dari database saat mount
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await masterService.getAllReferensi(false);
      if (data && data.length > 0) {
        // Merge Supabase data with fallbacks to guarantee all 20 categories exist
        const map = new Map<string, MasterReferensi>();
        DEFAULT_MASTER_REFERENSI.forEach((item) => {
          map.set(`${item.kategori}:${item.kode}`, item);
        });
        data.forEach((item) => {
          map.set(`${item.kategori}:${item.kode}`, item);
        });
        const merged = Array.from(map.values()).sort((a, b) => {
          if (a.kategori === b.kategori) return a.urutan - b.urutan;
          return a.kategori.localeCompare(b.kategori);
        });
        globalMasterDataCache = merged;
        notifyListeners();
      }
    } catch (err) {
      console.warn("Menggunakan cache master referensi lokal:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Helper methods
  const getByKategori = useCallback(
    (kategori: string, onlyActive: boolean = true): MasterReferensi[] => {
      return items
        .filter((item) => item.kategori === kategori && (!onlyActive || item.is_active))
        .sort((a, b) => a.urutan - b.urutan);
    },
    [items]
  );

  const getOptions = useCallback(
    (kategori: string, onlyActive: boolean = true) => {
      return getByKategori(kategori, onlyActive).map((item) => ({
        value: item.kode,
        label: item.nama,
        badge_color: item.badge_color,
      }));
    },
    [getByKategori]
  );

  const getLabel = useCallback(
    (kategori: string, kode: string, fallback?: string): string => {
      const match = items.find(
        (item) => item.kategori === kategori && item.kode.toLowerCase() === (kode || "").toLowerCase()
      );
      return match ? match.nama : fallback || kode;
    },
    [items]
  );

  const getBadgeColor = useCallback(
    (kategori: string, kode: string, fallback: string = "slate"): string => {
      const match = items.find(
        (item) => item.kategori === kategori && item.kode.toLowerCase() === (kode || "").toLowerCase()
      );
      return match?.badge_color || fallback;
    },
    [items]
  );

  const getItem = useCallback(
    (kategori: string, kode: string): MasterReferensi | undefined => {
      return items.find(
        (item) => item.kategori === kategori && item.kode.toLowerCase() === (kode || "").toLowerCase()
      );
    },
    [items]
  );

  // Filter items jika dipanggil dengan kategoriFilter
  const filteredItems = kategoriFilter
    ? items.filter((item) => item.kategori === kategoriFilter)
    : items;

  return {
    items: filteredItems,
    allItems: items,
    kategoriList: MASTER_KATEGORI_LIST,
    loading,
    refresh,
    getByKategori,
    getOptions,
    getLabel,
    getBadgeColor,
    getItem,
  };
}
