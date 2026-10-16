export type RoleEnum =
  | "super_admin"
  | "operator"
  | "kepala_pd"
  | "atasan"
  | "pegawai"
  | "pimpinan"
  | "auditor";

export type UserRole =
  | "admin"
  | "super_admin"
  | "operator"
  | "operator_pd"
  | "kepala_pd"
  | "atasan"
  | "pegawai"
  | "pimpinan"
  | "pimpinan_tinggi"
  | "auditor";

export type StatusPegawai =
  | "aktif"
  | "cuti_besar"
  | "diberhentikan"
  | "pensiun"
  | "meninggal"
  | (string & {});

export type StatusCuti =
  | "draft"
  | "diajukan"
  | "disetujui_atasan"
  | "disetujui_kepala_pd"
  | "ditolak"
  | "dibatalkan"
  | "selesai"
  | (string & {});

export type StatusWorkflow =
  | "draft"
  | "diajukan"
  | "verifikasi"
  | "disetujui"
  | "ditolak"
  | "selesai"
  | (string & {});

export type JenisDisiplin = "ringan" | "sedang" | "berat" | (string & {});

export type StatusAbsensi =
  | "hadir"
  | "terlambat"
  | "izin"
  | "sakit"
  | "cuti"
  | "alpha"
  | "dinas_luar"
  | (string & {});

export type StatusSKP = "draft" | "ditetapkan" | "dinilai" | "final" | (string & {});

export type KesiapanTalenta =
  | "siap_sekarang"
  | "siap_1_2_tahun"
  | "siap_3_5_tahun";

export interface PerangkatDaerah {
  id: string;
  kode: string;
  nama: string;
  parent_id?: string | null;
  status?: "aktif" | "nonaktif" | string;
  created_at: string;
  updated_at?: string;
}


export interface Jabatan {
  id: string;
  kode: string;
  nama: string;
  jenis: "struktural" | "fungsional" | "pelaksana" | (string & {});
  eselon?: string | null;
  pd_id?: string | null;
  syarat_kompetensi: string[];
  created_at: string;
}

export interface Pegawai {
  id: string;
  user_id?: string;
  nip: string;
  nik_masked: string;
  nama_lengkap: string;
  nama?: string;
  gelar_depan?: string;
  gelar_belakang?: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: "L" | "P" | (string & {});
  status_kepegawaian: "PNS" | "PPPK" | (string & {});
  golongan: string;
  pangkat: string;
  tmt_golongan: string;
  tmt_cpns?: string;
  tmt_pns?: string;
  pendidikan_terakhir: string;
  alamat: string;
  no_hp: string;
  email: string;
  pd_id: string;
  pd_nama?: string;
  jabatan_id: string;
  jabatan_nama?: string;
  atasan_id?: string | null;
  atasan_nama?: string;
  status: StatusPegawai;
  tanggal_pensiun: string;
  foto_path?: string;
  device_user_id?: string;
  qr_token: string;
  created_at: string;
  updated_at: string;
  pd?: { id?: string; nama?: string };
  jabatan?: { id?: string; nama?: string; jenis?: string };
  golongan_obj?: { id?: string; nama?: string; pangkat?: string };
}

export interface PerubahanDataPegawai {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  field: string;
  nilai_lama: string;
  nilai_baru: string;
  status: StatusWorkflow;
  diajukan_at: string;
  diputuskan_oleh?: string;
  diputuskan_at?: string;
}

export interface RiwayatPangkat {
  id: string;
  pegawai_id: string;
  golongan: string;
  pangkat: string;
  tmt: string;
  nomor_sk: string;
  tanggal_sk: string;
}

export interface UsulanKenaikanPangkat {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  pegawai_nip?: string;
  nip?: string;
  pd_nama?: string;
  golongan_asal: string;
  golongan_tujuan: string;
  pangkat_asal?: string;
  jenis: "reguler" | "pilihan" | "kgb" | (string & {});
  tmt_usulan: string;
  status: StatusWorkflow;
  checklist_status: {
    skp_baik?: boolean;
    diklat_sesuai?: boolean;
    disiplin_bersih?: boolean;
    sk_terakhir?: boolean;
    [key: string]: boolean | undefined;
  };
  catatan?: string;
  created_at: string;
}

export interface AturanKepangkatan {
  id: string;
  golongan_dari: string;
  golongan_ke: string;
  masa_tahun: number;
  masa_bulan: number;
  berlaku_mulai: string;
  checklist: string[];
}

export interface Mutasi {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  nip?: string;
  jenis: "mutasi" | "rotasi" | "promosi" | (string & {});
  pd_asal_id: string;
  pd_asal_nama: string;
  pd_tujuan_id: string;
  pd_tujuan_nama: string;
  jabatan_tujuan_id: string;
  jabatan_tujuan_nama: string;
  alasan: string;
  status: StatusWorkflow;
  created_at: string;
}

export interface Formasi {
  id: string;
  pd_id: string;
  pd_nama: string;
  jabatan_id: string;
  jabatan_nama: string;
  tahun: number;
  kebutuhan: number;
  tersedia: number;
}

export interface LowonganInternal {
  id: string;
  jabatan_id: string;
  jabatan_nama: string;
  pd_nama: string;
  deskripsi: string;
  batas_daftar: string;
  status: "buka" | "tutup";
  jumlah_pelamar?: number;
}

export interface SKP {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  pegawai_nip?: string;
  pd_nama?: string;
  tahun: number;
  status: StatusSKP;
  nilai_akhir?: number;
  predikat?: "Sangat Baik" | "Baik" | "Cukup" | "Kurang" | "Sangat Kurang" | (string & {});
  targets: SKPTarget[];
}

export interface SKPTarget {
  id: string;
  skp_id: string;
  uraian: string;
  aspek: "kuantitas" | "kualitas" | "waktu" | "biaya" | (string & {});
  target: number;
  realisasi: number;
  satuan: string;
  bobot: number;
}

export interface Absensi {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  pegawai_nip?: string;
  pd_nama?: string;
  nip?: string;
  tanggal: string;
  jam_masuk?: string;
  jam_pulang?: string;
  status: StatusAbsensi;
  sumber: "perangkat" | "manual" | "impor";
  device_id?: string;
}

export interface Cuti {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  pegawai_nip?: string;
  nip?: string;
  pd_nama?: string;
  jenis: "tahunan" | "besar" | "sakit" | "melahirkan" | "alasan_penting" | "di_luar_tanggungan" | (string & {});
  tanggal_mulai: string;
  tanggal_selesai: string;
  jumlah_hari: number;
  alasan: string;
  status: StatusCuti;
  dokumen_id?: string;
  created_at: string;
}

export interface SaldoCuti {
  pegawai_id: string;
  tahun: number;
  jatah: number;
  terpakai: number;
  sisa: number;
}

export interface Diklat {
  id: string;
  nama: string;
  jenis: string;
  penyelenggara: string;
  jam_pelajaran: number;
  kompetensi_terkait: string[];
}

export interface PegawaiDiklat {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  diklat_id: string;
  diklat_nama: string;
  penyelenggara: string;
  status: StatusWorkflow;
  tanggal_selesai?: string;
  sertifikat_path?: string;
  catatan?: string;
  diklat?: Diklat;
}

export interface Kompetensi {
  id: string;
  nama: string;
  jenis: "Manajerial" | "Sosio Kultural" | "Teknis" | (string & {});
}

export interface HukumanDisiplin {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  nip?: string;
  jenis: JenisDisiplin;
  pasal: string;
  tanggal_keputusan: string;
  tmt: string;
  masa_berlaku_bulan: number;
  dampak_pangkat: boolean;
  dampak_jabatan: boolean;
  status: "aktif" | "berakhir" | (string & {});
  keterangan: string;
}

export interface PensiunChecklist {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  item: string;
  status: "belum" | "proses" | "lengkap" | (string & {});
  keterangan?: string;
}

export interface Dokumen {
  id: string;
  pegawai_id?: string;
  pegawai_nama?: string;
  kategori: "SK CPNS/PNS" | "SK Pangkat" | "SK Jabatan" | "Ijazah" | "KTP" | "Sertifikat" | "Surat Cuti" | "Lainnya" | (string & {});
  judul: string;
  storage_path: string;
  file_path?: string;
  versi: number;
  checksum: string;
  status_persetujuan: StatusWorkflow;
  ttd_status: "belum" | "internal" | "tte" | (string & {});
  uploaded_by?: string;
  created_at: string;
}

export interface TalentPool {
  id: string;
  pegawai_id: string;
  pegawai_nama: string;
  nip: string;
  pd_nama: string;
  jabatan_target_id: string;
  jabatan_target_nama: string;
  kesiapan: KesiapanTalenta;
  nilai_skp_2thn: string;
  catatan: string;
}

export interface Notifikasi {
  id: string;
  user_id: string;
  kategori: "Kepangkatan" | "Cuti" | "Disiplin" | "Kinerja" | "Pensiun" | "Sistem" | (string & {});
  judul: string;
  pesan: string;
  tautan?: string;
  dibaca_at?: string | null;
  dibaca?: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_id?: string;
  actor_nama: string;
  aksi: string;
  entitas: string;
  entitas_id: string;
  sebelum?: Record<string, any>;
  sesudah?: Record<string, any>;
  ip: string;
  user_agent: string;
  created_at: string;
}

export interface AppSettings {
  id: string;
  nama_aplikasi: string;
  nama_sub_aplikasi: string;
  slogan: string;
  teks_perkenalan: string;
  nama_hak_cipta?: string;
  nama_sekretariat?: string;
  alamat_sekretariat?: string;
  telepon_sekretariat?: string;
  email_sekretariat?: string;
  jam_operasional_sekretariat?: string;
  logo_url: string | null;
  favicon_url: string | null;

  // Profil Pemda & BKPSDM
  nama_pemda?: string;
  singkatan_bkd?: string;
  nama_bkd?: string;
  alamat_kantor?: string;
  email_dinas?: string;
  no_telepon?: string;
  whatsapp_helpdesk?: string;
  situs_web?: string;

  // Waktu, Regional & Keamanan
  zona_waktu?: string;
  format_tanggal?: string;
  tahun_anggaran?: string;
  toleransi_keterlambatan_menit?: string;
  auto_lock_session_menit?: string;
  enforce_mfa_admin?: boolean;
  instansi_config?: Record<string, any>;

  // Template & Label Banner Kepangkatan
  label_early_warning_kp?: string;
  template_prediksi_tmt?: string;
  label_menuju_golongan?: string;
  label_jenis_usulan?: string;
  label_countdown_kp?: string;
  label_subteks_tmt?: string;
  label_judul_checklist_kp?: string;

  updated_at?: string;
  updated_by?: string | null;
}

export interface MasterReferensi {
  id: string;
  kategori: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  urutan: number;
  badge_color?: string;
  is_active: boolean;
  is_system?: boolean;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface MasterKategoriInfo {
  kategori: string;
  nama: string;
  deskripsi: string;
  count?: number;
}
