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
  | "meninggal";

export type StatusCuti =
  | "draft"
  | "diajukan"
  | "disetujui_atasan"
  | "disetujui_kepala_pd"
  | "ditolak"
  | "dibatalkan"
  | "selesai";

export type StatusWorkflow =
  | "draft"
  | "diajukan"
  | "verifikasi"
  | "disetujui"
  | "ditolak"
  | "selesai";

export type JenisDisiplin = "ringan" | "sedang" | "berat";

export type StatusAbsensi =
  | "hadir"
  | "terlambat"
  | "izin"
  | "sakit"
  | "cuti"
  | "alpha"
  | "dinas_luar";

export type StatusSKP = "draft" | "ditetapkan" | "dinilai" | "final";

export type KesiapanTalenta =
  | "siap_sekarang"
  | "siap_1_2_tahun"
  | "siap_3_5_tahun";

export interface PerangkatDaerah {
  id: string;
  kode: string;
  nama: string;
  parent_id?: string | null;
  created_at: string;
}

export interface Jabatan {
  id: string;
  kode: string;
  nama: string;
  jenis: "struktural" | "fungsional" | "pelaksana";
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
  jenis_kelamin: "L" | "P";
  status_kepegawaian: "PNS" | "PPPK";
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
  jenis: "reguler" | "pilihan" | "kgb";
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
  jenis: "mutasi" | "rotasi" | "promosi";
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
  predikat?: "Sangat Baik" | "Baik" | "Cukup" | "Kurang" | "Sangat Kurang";
  targets: SKPTarget[];
}

export interface SKPTarget {
  id: string;
  skp_id: string;
  uraian: string;
  aspek: "kuantitas" | "kualitas" | "waktu" | "biaya";
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
  jenis: "tahunan" | "besar" | "sakit" | "melahirkan" | "alasan_penting" | "di_luar_tanggungan";
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
  jenis: "Manajerial" | "Sosio Kultural" | "Teknis";
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
  status: "aktif" | "berakhir";
  keterangan: string;
}

export interface PensiunChecklist {
  id: string;
  pegawai_id: string;
  pegawai_nama?: string;
  item: string;
  status: "belum" | "proses" | "lengkap";
  keterangan?: string;
}

export interface Dokumen {
  id: string;
  pegawai_id?: string;
  pegawai_nama?: string;
  kategori: "SK CPNS/PNS" | "SK Pangkat" | "SK Jabatan" | "Ijazah" | "KTP" | "Sertifikat" | "Surat Cuti" | "Lainnya";
  judul: string;
  storage_path: string;
  file_path?: string;
  versi: number;
  checksum: string;
  status_persetujuan: StatusWorkflow;
  ttd_status: "belum" | "internal" | "tte";
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
  kategori: "Kepangkatan" | "Cuti" | "Disiplin" | "Kinerja" | "Pensiun" | "Sistem";
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
