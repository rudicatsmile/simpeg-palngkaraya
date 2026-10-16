import { createClient } from "@/lib/supabase/client";
import { AppSettings } from "@/types";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: "default",
  nama_aplikasi: "SIMPEG",
  nama_sub_aplikasi: "Kota Palangkaraya",
  slogan: "Transformasi Pengelolaan Digital Kepegawaian",
  teks_perkenalan:
    "Kelola seluruh siklus hidup ASN mulai dari data induk, prediksi kenaikan pangkat tepat waktu, mutasi, penilaian kinerja SKP, hingga persiapan pensiun dalam satu ekosistem self-service yang aman dan prediktif.",
  nama_hak_cipta: "© 2026 Pemerintah Kota Palangkaraya. Hak Cipta Dilindungi Undang-Undang.",
  nama_sekretariat: "Sekretariat BKPSDM",
  alamat_sekretariat: "Jl. Tjilik Riwut No. 98, Kompleks Perkantoran Pemkot Palangkaraya 73112",
  telepon_sekretariat: "(0536) 3221234 / 0812-3456-7890",
  email_sekretariat: "bkpsdm@palangkaraya.go.id",
  jam_operasional_sekretariat: "Senin - Jumat: 07.30 - 16.00 WIB",
  logo_url: null,
  favicon_url: null,

  // Profil Pemda & BKPSDM
  nama_pemda: "Pemerintah Kota Palangkaraya",
  singkatan_bkd: "BKPSDM Kota Palangkaraya",
  nama_bkd: "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)",
  alamat_kantor: "Jl. Tjilik Riwut No. 98, Kompleks Perkantoran Pemkot Palangkaraya 73112",
  email_dinas: "bkpsdm@palangkaraya.go.id",
  no_telepon: "(0536) 3221234",
  whatsapp_helpdesk: "0812-3456-7890",
  situs_web: "https://bkpsdm.palangkaraya.go.id",

  // Waktu & Keamanan
  zona_waktu: "WIB (Asia/Jakarta, UTC+7)",
  format_tanggal: "DD/MM/YYYY",
  tahun_anggaran: "2026",
  toleransi_keterlambatan_menit: "15",
  auto_lock_session_menit: "30",
  enforce_mfa_admin: true,
  instansi_config: {},

  // Template & Label Banner Kepangkatan
  label_early_warning_kp: "Status Early Warning: {fase} Kenaikan Pangkat",
  template_prediksi_tmt: "Prediksi TMT Kenaikan Pangkat: {tmt}",
  label_menuju_golongan: "Menuju Golongan",
  label_jenis_usulan: "Jenis Usulan",
  label_countdown_kp: "{hari} Hari Lagi",
  label_subteks_tmt: "TMT Terhitung Mulai Tanggal",
  label_judul_checklist_kp: "Checklist Kelengkapan Syarat Berkas Administrasi:",
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

      // Periksa apakah ada cache lokal (jika migration SQL belum dijalankan di Supabase)
      let localCache: any = {};
      if (typeof window !== "undefined") {
        try {
          const cached = window.localStorage.getItem("esimpeg_app_settings_local_cache");
          if (cached) localCache = JSON.parse(cached);
        } catch {}
      }

      if (error || !data) {
        return {
          ...DEFAULT_APP_SETTINGS,
          ...localCache,
        };
      }

      const defaultCopyright = `© ${new Date().getFullYear()} ${
        data.nama_sub_aplikasi || DEFAULT_APP_SETTINGS.nama_sub_aplikasi
      }. Hak Cipta Dilindungi Undang-Undang.`;

      const cfg = data.instansi_config || {};

      return {
        id: data.id || "default",
        nama_aplikasi: data.nama_aplikasi || DEFAULT_APP_SETTINGS.nama_aplikasi,
        nama_sub_aplikasi: data.nama_sub_aplikasi || DEFAULT_APP_SETTINGS.nama_sub_aplikasi,
        slogan: data.slogan || DEFAULT_APP_SETTINGS.slogan,
        teks_perkenalan: data.teks_perkenalan || DEFAULT_APP_SETTINGS.teks_perkenalan,
        nama_hak_cipta: data.nama_hak_cipta || defaultCopyright,
        nama_sekretariat: data.nama_sekretariat || DEFAULT_APP_SETTINGS.nama_sekretariat,
        alamat_sekretariat: data.alamat_sekretariat || DEFAULT_APP_SETTINGS.alamat_sekretariat,
        telepon_sekretariat: data.telepon_sekretariat || DEFAULT_APP_SETTINGS.telepon_sekretariat,
        email_sekretariat: data.email_sekretariat || DEFAULT_APP_SETTINGS.email_sekretariat,
        jam_operasional_sekretariat:
          data.jam_operasional_sekretariat || DEFAULT_APP_SETTINGS.jam_operasional_sekretariat,
        logo_url: data.logo_url || null,
        favicon_url: data.favicon_url || null,

        // Profil Pemda & BKPSDM
        nama_pemda:
          data.nama_pemda ||
          localCache.nama_pemda ||
          localCache.namaPemda ||
          cfg.namaPemda ||
          (data.nama_sub_aplikasi ? `Pemerintah ${data.nama_sub_aplikasi}` : undefined) ||
          DEFAULT_APP_SETTINGS.nama_pemda,
        singkatan_bkd:
          data.singkatan_bkd ||
          localCache.singkatan_bkd ||
          localCache.singkatanBkd ||
          cfg.singkatanBkd ||
          (data.nama_sub_aplikasi ? `BKPSDM ${data.nama_sub_aplikasi}` : undefined) ||
          DEFAULT_APP_SETTINGS.singkatan_bkd,
        nama_bkd:
          data.nama_bkd ||
          localCache.nama_bkd ||
          localCache.namaBkd ||
          cfg.namaBkd ||
          DEFAULT_APP_SETTINGS.nama_bkd,
        alamat_kantor:
          data.alamat_kantor ||
          localCache.alamat_kantor ||
          localCache.alamat ||
          cfg.alamat ||
          data.alamat_sekretariat ||
          DEFAULT_APP_SETTINGS.alamat_kantor,
        email_dinas:
          data.email_dinas ||
          localCache.email_dinas ||
          localCache.emailDinas ||
          cfg.emailDinas ||
          data.email_sekretariat ||
          DEFAULT_APP_SETTINGS.email_dinas,
        no_telepon:
          data.no_telepon ||
          localCache.no_telepon ||
          localCache.noTelepon ||
          cfg.noTelepon ||
          data.telepon_sekretariat ||
          DEFAULT_APP_SETTINGS.no_telepon,
        whatsapp_helpdesk:
          data.whatsapp_helpdesk ||
          localCache.whatsapp_helpdesk ||
          localCache.whatsappHelpdesk ||
          cfg.whatsappHelpdesk ||
          DEFAULT_APP_SETTINGS.whatsapp_helpdesk,
        situs_web:
          data.situs_web ||
          localCache.situs_web ||
          localCache.situsWeb ||
          cfg.situsWeb ||
          DEFAULT_APP_SETTINGS.situs_web,

        // Waktu & Keamanan
        zona_waktu:
          data.zona_waktu ||
          localCache.zona_waktu ||
          localCache.zonaWaktu ||
          cfg.zonaWaktu ||
          DEFAULT_APP_SETTINGS.zona_waktu,
        format_tanggal:
          data.format_tanggal ||
          localCache.format_tanggal ||
          localCache.formatTanggal ||
          cfg.formatTanggal ||
          DEFAULT_APP_SETTINGS.format_tanggal,
        tahun_anggaran:
          data.tahun_anggaran ||
          localCache.tahun_anggaran ||
          localCache.tahunAnggaran ||
          cfg.tahunAnggaran ||
          DEFAULT_APP_SETTINGS.tahun_anggaran,
        toleransi_keterlambatan_menit:
          data.toleransi_keterlambatan_menit ||
          localCache.toleransi_keterlambatan_menit ||
          localCache.toleransiKeterlambatanMenit ||
          cfg.toleransiKeterlambatanMenit ||
          DEFAULT_APP_SETTINGS.toleransi_keterlambatan_menit,
        auto_lock_session_menit:
          data.auto_lock_session_menit ||
          localCache.auto_lock_session_menit ||
          localCache.autoLockSessionMenit ||
          cfg.autoLockSessionMenit ||
          DEFAULT_APP_SETTINGS.auto_lock_session_menit,
        enforce_mfa_admin:
          data.enforce_mfa_admin !== undefined
            ? data.enforce_mfa_admin
            : localCache.enforce_mfa_admin !== undefined
            ? localCache.enforce_mfa_admin
            : cfg.enforceMfaAdmin !== undefined
            ? cfg.enforceMfaAdmin
            : DEFAULT_APP_SETTINGS.enforce_mfa_admin,
        instansi_config: cfg,

        // Template & Label Banner Kepangkatan
        label_early_warning_kp:
          data.label_early_warning_kp ||
          localCache.label_early_warning_kp ||
          cfg.label_early_warning_kp ||
          DEFAULT_APP_SETTINGS.label_early_warning_kp,
        template_prediksi_tmt:
          data.template_prediksi_tmt ||
          localCache.template_prediksi_tmt ||
          cfg.template_prediksi_tmt ||
          DEFAULT_APP_SETTINGS.template_prediksi_tmt,
        label_menuju_golongan:
          data.label_menuju_golongan ||
          localCache.label_menuju_golongan ||
          cfg.label_menuju_golongan ||
          DEFAULT_APP_SETTINGS.label_menuju_golongan,
        label_jenis_usulan:
          data.label_jenis_usulan ||
          localCache.label_jenis_usulan ||
          cfg.label_jenis_usulan ||
          DEFAULT_APP_SETTINGS.label_jenis_usulan,
        label_countdown_kp:
          data.label_countdown_kp ||
          localCache.label_countdown_kp ||
          cfg.label_countdown_kp ||
          DEFAULT_APP_SETTINGS.label_countdown_kp,
        label_subteks_tmt:
          data.label_subteks_tmt ||
          localCache.label_subteks_tmt ||
          cfg.label_subteks_tmt ||
          DEFAULT_APP_SETTINGS.label_subteks_tmt,
        label_judul_checklist_kp:
          data.label_judul_checklist_kp ||
          localCache.label_judul_checklist_kp ||
          cfg.label_judul_checklist_kp ||
          DEFAULT_APP_SETTINGS.label_judul_checklist_kp,

        updated_at: data.updated_at,
        updated_by: data.updated_by,
      };
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  },

  /**
   * Memperbarui konfigurasi atribut aplikasi (Khusus Administrator).
   */
  async update(
    payload: Partial<Omit<AppSettings, "id" | "updated_at">>
  ): Promise<{ data: AppSettings | null; error: any; needsMigration?: boolean }> {
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

      // 1. Coba update langsung ke database Supabase
      const { data, error } = await supabase
        .from("app_settings")
        .upsert(updateData, { onConflict: "id" })
        .select()
        .single();

      if (!error && data) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("esimpeg_app_settings_local_cache");
          window.dispatchEvent(new CustomEvent("app-settings-updated", { detail: data }));
        }
        return { data, error: null };
      }

      // 2. Jika kolom baru belum ada di Supabase (misal belum menjalankan migration 08)
      if (
        error &&
        (error.code === "PGRST204" ||
          error.code === "42703" ||
          error.message?.toLowerCase().includes("column") ||
          error.message?.toLowerCase().includes("schema cache"))
      ) {
        console.warn(
          "Kolom profil belum terdaftar di schema Supabase. Menyimpan ke kolom standar & cache lokal...",
          error.message
        );

        // Simpan kolom-kolom standar yang sudah ada di tabel app_settings
        const fallbackPayload: Record<string, any> = {
          id: "default",
          updated_at: new Date().toISOString(),
          updated_by: user?.id || null,
        };

        if (payload.nama_aplikasi) fallbackPayload.nama_aplikasi = payload.nama_aplikasi;
        if (payload.nama_sub_aplikasi) fallbackPayload.nama_sub_aplikasi = payload.nama_sub_aplikasi;
        if (payload.slogan) fallbackPayload.slogan = payload.slogan;
        if (payload.teks_perkenalan) fallbackPayload.teks_perkenalan = payload.teks_perkenalan;
        if (payload.nama_hak_cipta) fallbackPayload.nama_hak_cipta = payload.nama_hak_cipta;
        if (payload.nama_sekretariat) fallbackPayload.nama_sekretariat = payload.nama_sekretariat;
        if (payload.logo_url !== undefined) fallbackPayload.logo_url = payload.logo_url;
        if (payload.favicon_url !== undefined) fallbackPayload.favicon_url = payload.favicon_url;

        // Sinkronisasi data kontak ke kolom sekretariat yang sudah ada
        if (payload.alamat_kantor) fallbackPayload.alamat_sekretariat = payload.alamat_kantor;
        if (payload.email_dinas) fallbackPayload.email_sekretariat = payload.email_dinas;
        if (payload.no_telepon) fallbackPayload.telepon_sekretariat = payload.no_telepon;

        // Simpan field banner kepangkatan ke instansi_config sebagai fallback
        fallbackPayload.instansi_config = {
          label_early_warning_kp: payload.label_early_warning_kp,
          template_prediksi_tmt: payload.template_prediksi_tmt,
          label_menuju_golongan: payload.label_menuju_golongan,
          label_jenis_usulan: payload.label_jenis_usulan,
          label_countdown_kp: payload.label_countdown_kp,
          label_subteks_tmt: payload.label_subteks_tmt,
          label_judul_checklist_kp: payload.label_judul_checklist_kp,
        };

        const { data: fallbackData } = await supabase
          .from("app_settings")
          .upsert(fallbackPayload, { onConflict: "id" })
          .select()
          .single();

        // Simpan seluruh data ke localStorage agar data tidak hilang saat refresh
        if (typeof window !== "undefined") {
          const cached = {
            ...payload,
            updated_at: new Date().toISOString(),
          };
          window.localStorage.setItem("esimpeg_app_settings_local_cache", JSON.stringify(cached));
          window.dispatchEvent(
            new CustomEvent("app-settings-updated", {
              detail: { ...(fallbackData || {}), ...cached },
            })
          );
        }

        const merged = await appSettingsService.get();
        return { data: merged, error: null, needsMigration: true };
      }

      console.error("Gagal memperbarui app_settings:", error);
      return { data: null, error };
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
