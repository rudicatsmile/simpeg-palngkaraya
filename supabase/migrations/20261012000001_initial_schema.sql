-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Migration: 20261012000001_initial_schema.sql
-- Kepatuhan: Bab 10 PRD, Supabase PostgreSQL, RLS, Audit Logging, & Enkripsi
-- ==============================================================================

-- Aktifkan ekstensi yang diperlukan
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 1. ENUM TYPES
-- ==============================================================================
create type role_enum as enum (
  'super_admin',
  'operator',
  'kepala_pd',
  'atasan',
  'pegawai',
  'pimpinan',
  'auditor'
);

create type status_pegawai as enum (
  'aktif',
  'cuti_besar',
  'diberhentikan',
  'pensiun',
  'meninggal'
);

create type status_cuti as enum (
  'draft',
  'diajukan',
  'disetujui_atasan',
  'disetujui_kepala_pd',
  'ditolak',
  'dibatalkan',
  'selesai'
);

create type status_workflow as enum (
  'draft',
  'diajukan',
  'verifikasi',
  'disetujui',
  'ditolak',
  'selesai'
);

create type jenis_disiplin as enum (
  'ringan',
  'sedang',
  'berat'
);

create type status_absensi as enum (
  'hadir',
  'terlambat',
  'izin',
  'sakit',
  'cuti',
  'alpha',
  'dinas_luar'
);

create type status_skp as enum (
  'draft',
  'ditetapkan',
  'dinilai',
  'final'
);

create type kesiapan_talenta as enum (
  'siap_sekarang',
  'siap_1_2_tahun',
  'siap_3_5_tahun'
);

-- ==============================================================================
-- 2. PERANGKAT DAERAH & JABATAN
-- ==============================================================================
create table perangkat_daerah (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  parent_id uuid references perangkat_daerah(id) on delete set null,
  created_at timestamptz not null default now()
);

create table jabatan (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  jenis text not null check (jenis in ('struktural','fungsional','pelaksana')),
  eselon text,
  pd_id uuid references perangkat_daerah(id) on delete set null,
  syarat_kompetensi jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 3. USER ROLES & DATA INDUK PEGAWAI
-- ==============================================================================
create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role role_enum not null,
  pd_id uuid references perangkat_daerah(id) on delete cascade,
  unique (user_id, role, pd_id)
);

create table pegawai (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  nip varchar(18) unique not null check (nip ~ '^[0-9]{18}$'),
  nik_masked text,
  nik_terenkripsi bytea,
  nama_lengkap text not null,
  gelar_depan text,
  gelar_belakang text,
  tempat_lahir text,
  tanggal_lahir date,
  jenis_kelamin char(1) check (jenis_kelamin in ('L','P')),
  status_kepegawaian text not null check (status_kepegawaian in ('PNS','PPPK')),
  golongan text,
  pangkat text,
  tmt_golongan date,
  tmt_cpns date,
  tmt_pns date,
  pendidikan_terakhir text,
  alamat text,
  no_hp varchar(15),
  email text,
  pd_id uuid references perangkat_daerah(id) on delete set null,
  jabatan_id uuid references jabatan(id) on delete set null,
  atasan_id uuid references pegawai(id) on delete set null,
  status status_pegawai not null default 'aktif',
  tanggal_pensiun date,
  foto_path text,
  device_user_id text unique,
  qr_token uuid unique not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_pegawai_pd on pegawai(pd_id);
create index idx_pegawai_atasan on pegawai(atasan_id);
create index idx_pegawai_status on pegawai(status);
create index idx_pegawai_nip on pegawai(nip);

-- ==============================================================================
-- 4. PERUBAHAN DATA MANDIRI
-- ==============================================================================
create table perubahan_data_pegawai (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  field text not null,
  nilai_lama jsonb,
  nilai_baru jsonb not null,
  status status_workflow not null default 'diajukan',
  diajukan_at timestamptz not null default now(),
  diputuskan_oleh uuid references auth.users(id),
  diputuskan_at timestamptz
);

-- ==============================================================================
-- 5. KEPANGKATAN
-- ==============================================================================
create table riwayat_pangkat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  golongan text not null,
  pangkat text not null,
  tmt date not null,
  nomor_sk text,
  tanggal_sk date,
  dokumen_id uuid,
  created_at timestamptz not null default now()
);

create table aturan_kepangkatan (
  id uuid primary key default gen_random_uuid(),
  golongan_dari text not null,
  golongan_ke text not null,
  masa_tahun integer not null default 4 check (masa_tahun >= 0),
  masa_bulan integer not null default 0 check (masa_bulan between 0 and 11),
  berlaku_mulai date not null,
  berlaku_sampai date,
  checklist jsonb not null default '[]'::jsonb
);

create table usulan_kenaikan_pangkat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('reguler','pilihan','kgb')),
  golongan_tujuan text not null,
  tmt_usulan date not null,
  status status_workflow not null default 'draft',
  checklist_status jsonb not null default '{}'::jsonb,
  catatan text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 6. MUTASI, FORMASI & LOWONGAN
-- ==============================================================================
create table mutasi (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('mutasi','rotasi','promosi')),
  pd_asal_id uuid references perangkat_daerah(id),
  pd_tujuan_id uuid references perangkat_daerah(id),
  jabatan_tujuan_id uuid references jabatan(id),
  alasan text not null,
  status status_workflow not null default 'draft',
  created_at timestamptz not null default now()
);

create table formasi (
  id uuid primary key default gen_random_uuid(),
  pd_id uuid not null references perangkat_daerah(id) on delete cascade,
  jabatan_id uuid not null references jabatan(id) on delete cascade,
  tahun integer not null,
  kebutuhan integer not null check (kebutuhan >= 0),
  tersedia integer not null default 0 check (tersedia >= 0),
  unique (pd_id, jabatan_id, tahun)
);

create table lowongan_internal (
  id uuid primary key default gen_random_uuid(),
  jabatan_id uuid not null references jabatan(id) on delete cascade,
  deskripsi text not null,
  batas_daftar date not null,
  status text not null default 'buka' check (status in ('buka','tutup')),
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 7. KINERJA (SKP)
-- ==============================================================================
create table skp (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  tahun integer not null,
  status status_skp not null default 'draft',
  nilai_akhir numeric(5,2),
  predikat text,
  unique (pegawai_id, tahun)
);

create table skp_target (
  id uuid primary key default gen_random_uuid(),
  skp_id uuid not null references skp(id) on delete cascade,
  uraian text not null,
  aspek text not null check (aspek in ('kuantitas','kualitas','waktu','biaya')),
  target numeric not null,
  realisasi numeric not null default 0,
  bobot numeric(5,2) not null check (bobot > 0)
);

-- ==============================================================================
-- 8. ABSENSI
-- ==============================================================================
create table absensi (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  tanggal date not null,
  jam_masuk timestamptz,
  jam_pulang timestamptz,
  status status_absensi not null default 'hadir',
  sumber text not null check (sumber in ('perangkat','manual','impor')),
  device_id text,
  unique (pegawai_id, tanggal)
);

create index idx_absensi_tgl on absensi(tanggal);

-- ==============================================================================
-- 9. CUTI & SALDO
-- ==============================================================================
create table saldo_cuti (
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  tahun integer not null,
  jatah integer not null default 12,
  terpakai integer not null default 0 check (terpakai >= 0),
  primary key (pegawai_id, tahun)
);

create table cuti (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('tahunan','besar','sakit','melahirkan','alasan_penting','di_luar_tanggungan')),
  tanggal_mulai date not null,
  tanggal_selesai date not null check (tanggal_selesai >= tanggal_mulai),
  jumlah_hari integer not null check (jumlah_hari > 0),
  alasan text not null,
  status status_cuti not null default 'diajukan',
  dokumen_id uuid,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 10. DIKLAT & KOMPETENSI
-- ==============================================================================
create table diklat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jenis text not null,
  penyelenggara text not null,
  jam_pelajaran integer not null default 0,
  kompetensi_terkait jsonb not null default '[]'::jsonb
);

create table pegawai_diklat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  diklat_id uuid not null references diklat(id) on delete cascade,
  status status_workflow not null default 'diajukan',
  tanggal_selesai date,
  sertifikat_path text,
  created_at timestamptz not null default now()
);

create table kompetensi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  level_standar integer not null check (level_standar between 1 and 5)
);

create table pegawai_kompetensi (
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  kompetensi_id uuid not null references kompetensi(id) on delete cascade,
  level integer not null check (level between 1 and 5),
  tanggal_asesmen date not null,
  primary key (pegawai_id, kompetensi_id)
);

-- ==============================================================================
-- 11. HUKUMAN DISIPLIN & PENSIUN
-- ==============================================================================
create table hukuman_disiplin (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  tingkat jenis_disiplin not null,
  jenis_hukuman text not null,
  alasan text not null,
  nomor_sk text not null,
  tanggal_sk date not null,
  tanggal_mulai date not null,
  tanggal_selesai date check (tanggal_selesai >= tanggal_mulai),
  pejabat_penetap text not null,
  status_aktif boolean not null default true,
  created_at timestamptz not null default now()
);

create table pensiun_checklist (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  nama_syarat text not null,
  status_verifikasi boolean not null default false,
  dokumen_id uuid,
  catatan text,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- 12. ARSIP DOKUMEN DIGITAL (VERSIONING DENGAN PARENT_ID)
-- ==============================================================================
create table dokumen (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  kategori text not null check (kategori in ('sk_cpns','sk_pns','sk_pangkat','sk_jabatan','ijazah','transkrip','sertifikat','ktp','kk','lainnya')),
  judul text not null,
  file_path text not null,
  ukuran_bytes bigint not null,
  mime_type text not null,
  versi integer not null default 1,
  parent_id uuid references dokumen(id) on delete set null,
  diunggah_oleh uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 13. TALENT POOL & SUKSESI
-- ==============================================================================
create table talent_pool (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references pegawai(id) on delete cascade,
  skor_kinerja numeric(5,2) not null,
  skor_potensi numeric(5,2) not null,
  kuadran integer not null check (kuadran between 1 and 9),
  kesiapan kesiapan_talenta not null default 'siap_sekarang',
  catatan text,
  tahun integer not null default extract(year from current_date),
  unique (pegawai_id, tahun)
);

-- ==============================================================================
-- 14. NOTIFIKASI & LOG DISPATCHER
-- ==============================================================================
create table notifikasi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  judul text not null,
  pesan text not null,
  tautan text,
  kategori text not null default 'umum',
  dibaca boolean not null default false,
  created_at timestamptz not null default now()
);

create table notifikasi_log (
  id uuid primary key default gen_random_uuid(),
  kanal text not null check (kanal in ('in_app','email','whatsapp')),
  penerima text not null,
  subjek text,
  pesan text not null,
  status text not null check (status in ('pending','sent','failed')),
  retry_count integer not null default 0,
  error_message text,
  dikirim_at timestamptz default now()
);

-- ==============================================================================
-- 15. WORKFLOW APPROVAL ENGINE
-- ==============================================================================
create table workflow_approval (
  id uuid primary key default gen_random_uuid(),
  entitas_tipe text not null, -- 'cuti', 'perubahan_data', 'kenaikan_pangkat', 'mutasi'
  entitas_id uuid not null,
  tahap integer not null, -- 1: atasan, 2: kepala_pd, 3: bkpsdm
  peran_penilai role_enum not null,
  penilai_id uuid references auth.users(id),
  status status_workflow not null default 'diajukan',
  catatan text,
  waktu_keputusan timestamptz,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 16. AUDIT TRAIL IMMUTABLE (WORM)
-- ==============================================================================
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  aksi text not null, -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'DOWNLOAD'
  tabel text not null,
  record_id uuid,
  sebelum jsonb,
  sesudah jsonb,
  aktor_id uuid references auth.users(id),
  aktor_nama text,
  aktor_role text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_audit_created on audit_log(created_at desc);
create index idx_audit_aktor on audit_log(aktor_id);
create index idx_audit_tabel on audit_log(tabel);

-- ==============================================================================
-- 17. TRIGGER AUTOMATISASI TIMESTAMP
-- ==============================================================================
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_pegawai_updated_at
before update on pegawai
for each row execute function update_timestamp();
