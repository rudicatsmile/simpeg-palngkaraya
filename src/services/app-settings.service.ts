"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppSettings } from "@/types";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: "default",
  nama_aplikasi: "SIMPEG Daerah",
  nama_sub_aplikasi: "Kabupaten Nusantara Jaya",
  slogan: "Transformasi Digital Kepegawaian Terpadu",
  teks_perkenalan:
    "Kelola seluruh siklus hidup ASN mulai dari data induk, prediksi kenaikan pangkat tepat waktu, mutasi, penilaian kinerja SKP, hingga persiapan pensiun dalam satu ekosistem self-service yang aman dan prediktif.",
  logo_url: null,
  favicon_url: null,
};

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export const appSettingsService = {
  /**
   * Mengambil konfigurasi atribut aplikasi dari Supabase.
   * Fallback aman ke DEFAULT_APP_SETTINGS jika koneksi terganggu atau tabel belum dibuat.
   */
  async get(): Promise<AppSettings> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (error) {
        // Jika tabel belum ada atau RLS blok, return fallback default
        console.warn("Informasi app_settings menggunakan fallback default:", error.message);
        return DEFAULT_APP_SETTINGS;
      }

      if (!data) {
        return DEFAULT_APP_SETTINGS;
      }

      return {
        id: data.id || "default",
        nama_aplikasi: data.nama_aplikasi || DEFAULT_APP_SETTINGS.nama_aplikasi,
        nama_sub_aplikasi: data.nama_sub_aplikasi || DEFAULT_APP_SETTINGS.nama_sub_aplikasi,
        slogan: data.slogan || DEFAULT_APP_SETTINGS.slogan,
        teks_perkenalan: data.teks_perkenalan || DEFAULT_APP_SETTINGS.teks_perkenalan,
        logo_url: data.logo_url || null,
        favicon_url: data.favicon_url || null,
        updated_at: data.updated_at,
        updated_by: data.updated_by,
      };
    } catch (err) {
      console.error("Gagal mengambil app_settings:", err);
      return DEFAULT_APP_SETTINGS;
    }
  },

  /**
   * Memperbarui konfigurasi atribut aplikasi (Khusus Administrator).
   */
  async update(
    payload: Partial<Omit<AppSettings, "id" | "updated_at">>
  ): Promise<{ data: AppSettings | null; error: any }> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updateData = {
        id: "default",
        ...payload,
        updated_at: new Date().toISOString(),
        updated_by: user?.id || null,
      };

      const { data, error } = await supabase
        .from("app_settings")
        .upsert(updateData, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("Gagal memperbarui app_settings:", error);
        return { data: null, error };
      }

      // Trigger event storage agar tab/halaman lain dapat merefresh otomatis
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("app-settings-updated", { detail: data }));
      }

      return { data, error: null };
    } catch (err: any) {
      console.error("Terjadi kesalahan saat update app_settings:", err);
      return { data: null, error: err };
    }
  },

  /**
   * Mengupload file Logo atau Favicon ke Supabase Storage (bucket: app-assets)
   */
  async uploadAsset(
    file: File,
    type: "logo" | "favicon"
  ): Promise<{ publicUrl: string | null; error: string | null }> {
    // 1. Validasi Ukuran
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        publicUrl: null,
        error: `Ukuran file melebihi batas maksimal 2MB (Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      };
    }

    // 2. Validasi Tipe Mime
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        publicUrl: null,
        error: `Format file "${file.type}" tidak didukung. Harap unggah format PNG, JPG, SVG, WEBP, atau ICO.`,
      };
    }

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop()?.toLowerCase() || (type === "favicon" ? "ico" : "png");
      const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("app-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Gagal mengunggah file ke storage Supabase:", uploadError);
        return { publicUrl: null, error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from("app-assets")
        .getPublicUrl(filePath);

      return { publicUrl: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      console.error("Kesalahan upload asset:", err);
      return { publicUrl: null, error: err.message || "Gagal mengunggah asset" };
    }
  },
};

/**
 * React Hook untuk mengakses dan memantau atribut konfigurasi aplikasi secara reaktif.
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appSettingsService.get();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listener custom event untuk sinkronisasi instan antar komponen saat admin menyimpan data
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        fetchSettings();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("app-settings-updated", handleUpdate);
      return () => {
        window.removeEventListener("app-settings-updated", handleUpdate);
      };
    }
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };
}
