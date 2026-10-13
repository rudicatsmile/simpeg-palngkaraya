-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 1: MASTER MIGRATION (SKEMA, RLS, STORAGE, MATERIALIZED VIEWS)
-- Siap dieksekusi langsung di Supabase SQL Editor
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. EKSTENSI
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUM TYPES
do $$ begin
  create type role_enum as enum ('super_admin', 'operator', 'kepala_pd', 'atasan', 'pegawai', 'pimpinan', 'auditor');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type status_pegawai as enum ('aktif', 'cuti_besar', 'diberhentikan', 'pensiun', 'meninggal');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type status_cuti as enum ('draft', 'diajukan', 'disetujui_atasan', 'disetujui_kepala_pd', 'ditolak', 'dibatalkan', 'selesai');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type status_workflow as enum ('draft', 'diajukan', 'verifikasi', 'disetujui', 'ditolak', 'selesai');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type jenis_disiplin as enum ('ringan', 'sedang', 'berat');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type status_absensi as enum ('hadir', 'terlambat', 'izin', 'sakit', 'cuti', 'alpha', 'dinas_luar');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type status_skp as enum ('draft', 'ditetapkan', 'dinilai', 'final');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type kesiapan_talenta as enum ('siap_sekarang', 'siap_1_2_tahun', 'siap_3_5_tahun');
exception when duplicate_object then null;
end $$;

-- 3. TABEL PERANGKAT DAERAH & JABATAN
create table if not exists public.perangkat_daerah (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  parent_id uuid references public.perangkat_daerah(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.jabatan (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  jenis text not null check (jenis in ('struktural','fungsional','pelaksana')),
  eselon text,
  pd_id uuid references public.perangkat_daerah(id) on delete set null,
  syarat_kompetensi jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 4. USER ROLES & PEGAWAI
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role role_enum not null,
  pd_id uuid references public.perangkat_daerah(id) on delete cascade,
  unique (user_id, role, pd_id)
);

create table if not exists public.pegawai (
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
  pd_id uuid references public.perangkat_daerah(id) on delete set null,
  jabatan_id uuid references public.jabatan(id) on delete set null,
  atasan_id uuid references public.pegawai(id) on delete set null,
  status status_pegawai not null default 'aktif',
  tanggal_pensiun date,
  foto_path text,
  device_user_id text unique,
  qr_token uuid unique not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pegawai_pd on public.pegawai(pd_id);
create index if not exists idx_pegawai_atasan on public.pegawai(atasan_id);
create index if not exists idx_pegawai_status on public.pegawai(status);
create index if not exists idx_pegawai_nip on public.pegawai(nip);

-- 5. PERUBAHAN DATA MANDIRI
create table if not exists public.perubahan_data_pegawai (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  field text not null,
  nilai_lama jsonb,
  nilai_baru jsonb not null,
  status status_workflow not null default 'diajukan',
  diajukan_at timestamptz not null default now(),
  diputuskan_oleh uuid references auth.users(id),
  diputuskan_at timestamptz
);

-- 6. KEPANGKATAN
create table if not exists public.riwayat_pangkat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  golongan text not null,
  pangkat text not null,
  tmt date not null,
  nomor_sk text,
  tanggal_sk date,
  dokumen_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.aturan_kepangkatan (
  id uuid primary key default gen_random_uuid(),
  golongan_dari text not null,
  golongan_ke text not null,
  masa_tahun integer not null default 4 check (masa_tahun >= 0),
  masa_bulan integer not null default 0 check (masa_bulan between 0 and 11),
  berlaku_mulai date not null,
  berlaku_sampai date,
  checklist jsonb not null default '[]'::jsonb
);

create table if not exists public.usulan_kenaikan_pangkat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('reguler','pilihan','kgb')),
  golongan_tujuan text not null,
  tmt_usulan date not null,
  status status_workflow not null default 'draft',
  checklist_status jsonb not null default '{}'::jsonb,
  catatan text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- 7. MUTASI & FORMASI
create table if not exists public.mutasi (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('mutasi','rotasi','promosi')),
  pd_asal_id uuid references public.perangkat_daerah(id),
  pd_tujuan_id uuid references public.perangkat_daerah(id),
  jabatan_tujuan_id uuid references public.jabatan(id),
  alasan text not null,
  status status_workflow not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.formasi (
  id uuid primary key default gen_random_uuid(),
  pd_id uuid not null references public.perangkat_daerah(id) on delete cascade,
  jabatan_id uuid not null references public.jabatan(id) on delete cascade,
  tahun integer not null,
  kebutuhan integer not null check (kebutuhan >= 0),
  tersedia integer not null default 0 check (tersedia >= 0),
  unique (pd_id, jabatan_id, tahun)
);

create table if not exists public.lowongan_internal (
  id uuid primary key default gen_random_uuid(),
  jabatan_id uuid not null references public.jabatan(id) on delete cascade,
  deskripsi text not null,
  batas_daftar date not null,
  status text not null default 'buka' check (status in ('buka','tutup')),
  created_at timestamptz not null default now()
);

-- 8. KINERJA (SKP)
create table if not exists public.skp (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  tahun integer not null,
  status status_skp not null default 'draft',
  nilai_akhir numeric(5,2),
  predikat text,
  unique (pegawai_id, tahun)
);

create table if not exists public.skp_target (
  id uuid primary key default gen_random_uuid(),
  skp_id uuid not null references public.skp(id) on delete cascade,
  uraian text not null,
  aspek text not null check (aspek in ('kuantitas','kualitas','waktu','biaya')),
  target numeric not null,
  realisasi numeric not null default 0,
  bobot numeric(5,2) not null check (bobot > 0)
);

-- 9. ABSENSI
create table if not exists public.absensi (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  tanggal date not null,
  jam_masuk timestamptz,
  jam_pulang timestamptz,
  status status_absensi not null default 'hadir',
  sumber text not null check (sumber in ('perangkat','manual','impor')),
  device_id text,
  unique (pegawai_id, tanggal)
);

create index if not exists idx_absensi_tgl on public.absensi(tanggal);

-- 10. CUTI & SALDO
create table if not exists public.saldo_cuti (
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  tahun integer not null,
  jatah integer not null default 12,
  terpakai integer not null default 0 check (terpakai >= 0),
  primary key (pegawai_id, tahun)
);

create table if not exists public.cuti (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  jenis text not null check (jenis in ('tahunan','besar','sakit','melahirkan','alasan_penting','di_luar_tanggungan')),
  tanggal_mulai date not null,
  tanggal_selesai date not null check (tanggal_selesai >= tanggal_mulai),
  jumlah_hari integer not null check (jumlah_hari > 0),
  alasan text not null,
  status status_cuti not null default 'diajukan',
  dokumen_id uuid,
  created_at timestamptz not null default now()
);

-- 11. DIKLAT & KOMPETENSI
create table if not exists public.diklat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jenis text not null,
  penyelenggara text not null,
  jam_pelajaran integer not null default 0,
  kompetensi_terkait jsonb not null default '[]'::jsonb
);

create table if not exists public.pegawai_diklat (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  diklat_id uuid not null references public.diklat(id) on delete cascade,
  status status_workflow not null default 'diajukan',
  tanggal_selesai date,
  sertifikat_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.kompetensi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  level_standar integer not null check (level_standar between 1 and 5)
);

create table if not exists public.pegawai_kompetensi (
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  kompetensi_id uuid not null references public.kompetensi(id) on delete cascade,
  level integer not null check (level between 1 and 5),
  tanggal_asesmen date not null,
  primary key (pegawai_id, kompetensi_id)
);

-- 12. HUKUMAN DISIPLIN & PENSIUN
create table if not exists public.hukuman_disiplin (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
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

create table if not exists public.pensiun_checklist (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  nama_syarat text not null,
  status_verifikasi boolean not null default false,
  dokumen_id uuid,
  catatan text,
  updated_at timestamptz not null default now()
);

-- 13. ARSIP DOKUMEN DIGITAL
create table if not exists public.dokumen (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  kategori text not null check (kategori in ('sk_cpns','sk_pns','sk_pangkat','sk_jabatan','ijazah','transkrip','sertifikat','ktp','kk','lainnya')),
  judul text not null,
  file_path text not null,
  ukuran_bytes bigint not null,
  mime_type text not null,
  versi integer not null default 1,
  parent_id uuid references public.dokumen(id) on delete set null,
  diunggah_oleh uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- 14. TALENT POOL & SUKSESI
create table if not exists public.talent_pool (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references public.pegawai(id) on delete cascade,
  skor_kinerja numeric(5,2) not null,
  skor_potensi numeric(5,2) not null,
  kuadran integer not null check (kuadran between 1 and 9),
  kesiapan kesiapan_talenta not null default 'siap_sekarang',
  catatan text,
  tahun integer not null default extract(year from current_date),
  unique (pegawai_id, tahun)
);

-- 15. NOTIFIKASI & LOG DISPATCHER
create table if not exists public.notifikasi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  judul text not null,
  pesan text not null,
  tautan text,
  kategori text not null default 'umum',
  dibaca boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifikasi_log (
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

-- 16. WORKFLOW APPROVAL
create table if not exists public.workflow_approval (
  id uuid primary key default gen_random_uuid(),
  entitas_tipe text not null,
  entitas_id uuid not null,
  tahap integer not null,
  peran_penilai role_enum not null,
  penilai_id uuid references auth.users(id),
  status status_workflow not null default 'diajukan',
  catatan text,
  waktu_keputusan timestamptz,
  created_at timestamptz not null default now()
);

-- 17. AUDIT LOG (WORM / APPEND-ONLY)
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  aksi text not null,
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

create index if not exists idx_audit_created on public.audit_log(created_at desc);
create index if not exists idx_audit_aktor on public.audit_log(aktor_id);
create index if not exists idx_audit_tabel on public.audit_log(tabel);

-- 18. TRIGGER AUTOMATISASI TIMESTAMP
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pegawai_updated_at on public.pegawai;
create trigger trg_pegawai_updated_at
before update on public.pegawai
for each row execute function update_timestamp();

-- ==============================================================================
-- 19. FUNGSI HELPER RBAC & PD SCOPE
-- ==============================================================================
create or replace function public.has_role(user_uuid uuid, req_role role_enum)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = user_uuid and role = req_role
  );
end;
$$ language plpgsql security definer;

create or replace function public.pd_scope(user_uuid uuid)
returns uuid as $$
declare
  v_pd_id uuid;
begin
  select pd_id into v_pd_id
  from public.user_roles
  where user_id = user_uuid
  limit 1;
  return v_pd_id;
end;
$$ language plpgsql security definer;

create or replace function public.current_pegawai_id()
returns uuid as $$
declare
  v_pegawai_id uuid;
begin
  select id into v_pegawai_id
  from public.pegawai
  where user_id = auth.uid()
  limit 1;
  return v_pegawai_id;
end;
$$ language plpgsql security definer;

create or replace function public.is_atasan_of(target_pegawai_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.pegawai
    where id = target_pegawai_id and atasan_id = public.current_pegawai_id()
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_admin_or_super()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role in ('super_admin', 'operator')
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_pimpinan_or_auditor()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role in ('pimpinan', 'auditor')
  );
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- 20. AKTIFKAN RLS PADA SELURUH TABEL
-- ==============================================================================
alter table public.perangkat_daerah enable row level security;
alter table public.jabatan enable row level security;
alter table public.user_roles enable row level security;
alter table public.pegawai enable row level security;
alter table public.perubahan_data_pegawai enable row level security;
alter table public.riwayat_pangkat enable row level security;
alter table public.aturan_kepangkatan enable row level security;
alter table public.usulan_kenaikan_pangkat enable row level security;
alter table public.mutasi enable row level security;
alter table public.formasi enable row level security;
alter table public.lowongan_internal enable row level security;
alter table public.skp enable row level security;
alter table public.skp_target enable row level security;
alter table public.absensi enable row level security;
alter table public.saldo_cuti enable row level security;
alter table public.cuti enable row level security;
alter table public.diklat enable row level security;
alter table public.pegawai_diklat enable row level security;
alter table public.kompetensi enable row level security;
alter table public.pegawai_kompetensi enable row level security;
alter table public.hukuman_disiplin enable row level security;
alter table public.pensiun_checklist enable row level security;
alter table public.dokumen enable row level security;
alter table public.talent_pool enable row level security;
alter table public.notifikasi enable row level security;
alter table public.notifikasi_log enable row level security;
alter table public.workflow_approval enable row level security;
alter table public.audit_log enable row level security;

-- ==============================================================================
-- 21. RLS POLICIES (DROP & RECREATE AGAR IDEMPOTENT)
-- ==============================================================================

-- Perangkat Daerah & Jabatan (Publik/Authenticated Baca, Admin Tulis)
drop policy if exists "PD read all" on public.perangkat_daerah;
create policy "PD read all" on public.perangkat_daerah for select to authenticated using (true);

drop policy if exists "PD admin write" on public.perangkat_daerah;
create policy "PD admin write" on public.perangkat_daerah for all to authenticated using (public.is_admin_or_super());

drop policy if exists "Jabatan read all" on public.jabatan;
create policy "Jabatan read all" on public.jabatan for select to authenticated using (true);

drop policy if exists "Jabatan admin write" on public.jabatan;
create policy "Jabatan admin write" on public.jabatan for all to authenticated using (public.is_admin_or_super());

-- User Roles
drop policy if exists "Roles self read or admin" on public.user_roles;
create policy "Roles self read or admin" on public.user_roles for select to authenticated 
using (user_id = auth.uid() or public.is_admin_or_super() or public.is_pimpinan_or_auditor());

drop policy if exists "Roles admin write" on public.user_roles;
create policy "Roles admin write" on public.user_roles for all to authenticated 
using (public.is_admin_or_super());

-- Pegawai
drop policy if exists "Pegawai view policy" on public.pegawai;
create policy "Pegawai view policy" on public.pegawai for select to authenticated using (
  user_id = auth.uid()
  or atasan_id = public.current_pegawai_id()
  or (public.has_role(auth.uid(), 'kepala_pd') and pd_id = public.pd_scope(auth.uid()))
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Pegawai admin update" on public.pegawai;
create policy "Pegawai admin update" on public.pegawai for update to authenticated using (
  public.is_admin_or_super()
  or user_id = auth.uid()
);

drop policy if exists "Pegawai admin insert" on public.pegawai;
create policy "Pegawai admin insert" on public.pegawai for insert to authenticated with check (
  public.is_admin_or_super()
);

-- Cuti
drop policy if exists "Cuti view policy" on public.cuti;
create policy "Cuti view policy" on public.cuti for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or (public.has_role(auth.uid(), 'kepala_pd') and exists (select 1 from public.pegawai p where p.id = cuti.pegawai_id and p.pd_id = public.pd_scope(auth.uid())))
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Cuti create policy" on public.cuti;
create policy "Cuti create policy" on public.cuti for insert to authenticated with check (
  pegawai_id = public.current_pegawai_id() or public.is_admin_or_super()
);

drop policy if exists "Cuti update approval" on public.cuti;
create policy "Cuti update approval" on public.cuti for update to authenticated using (
  public.is_atasan_of(pegawai_id)
  or public.has_role(auth.uid(), 'kepala_pd')
  or public.is_admin_or_super()
);

-- Saldo Cuti
drop policy if exists "Saldo cuti read" on public.saldo_cuti;
create policy "Saldo cuti read" on public.saldo_cuti for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Saldo cuti write" on public.saldo_cuti;
create policy "Saldo cuti write" on public.saldo_cuti for all to authenticated using (
  public.is_admin_or_super()
);

-- Absensi
drop policy if exists "Absensi view policy" on public.absensi;
create policy "Absensi view policy" on public.absensi for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or (public.has_role(auth.uid(), 'kepala_pd') and exists (select 1 from public.pegawai p where p.id = absensi.pegawai_id and p.pd_id = public.pd_scope(auth.uid())))
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Absensi insert policy" on public.absensi;
create policy "Absensi insert policy" on public.absensi for insert to authenticated with check (
  pegawai_id = public.current_pegawai_id() or public.is_admin_or_super()
);

-- Dokumen
drop policy if exists "Dokumen view policy" on public.dokumen;
create policy "Dokumen view policy" on public.dokumen for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Dokumen insert policy" on public.dokumen;
create policy "Dokumen insert policy" on public.dokumen for insert to authenticated with check (
  pegawai_id = public.current_pegawai_id() or public.is_admin_or_super()
);

-- SKP Kinerja
drop policy if exists "SKP view policy" on public.skp;
create policy "SKP view policy" on public.skp for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or (public.has_role(auth.uid(), 'kepala_pd') and exists (select 1 from public.pegawai p where p.id = skp.pegawai_id and p.pd_id = public.pd_scope(auth.uid())))
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "SKP modify policy" on public.skp;
create policy "SKP modify policy" on public.skp for all to authenticated using (
  pegawai_id = public.current_pegawai_id() or public.is_atasan_of(pegawai_id) or public.is_admin_or_super()
);

-- Usulan Kenaikan Pangkat & Riwayat
drop policy if exists "Aturan pangkat read all" on public.aturan_kepangkatan;
create policy "Aturan pangkat read all" on public.aturan_kepangkatan for select to authenticated using (true);

drop policy if exists "Usulan pangkat view" on public.usulan_kenaikan_pangkat;
create policy "Usulan pangkat view" on public.usulan_kenaikan_pangkat for select to authenticated using (
  pegawai_id = public.current_pegawai_id()
  or public.is_atasan_of(pegawai_id)
  or (public.has_role(auth.uid(), 'kepala_pd') and exists (select 1 from public.pegawai p where p.id = usulan_kenaikan_pangkat.pegawai_id and p.pd_id = public.pd_scope(auth.uid())))
  or public.is_admin_or_super()
  or public.is_pimpinan_or_auditor()
);

drop policy if exists "Usulan pangkat write" on public.usulan_kenaikan_pangkat;
create policy "Usulan pangkat write" on public.usulan_kenaikan_pangkat for all to authenticated using (
  pegawai_id = public.current_pegawai_id() or public.is_admin_or_super()
);

-- Notifikasi
drop policy if exists "Notifikasi self read" on public.notifikasi;
create policy "Notifikasi self read" on public.notifikasi for select to authenticated using (user_id = auth.uid());

drop policy if exists "Notifikasi self update" on public.notifikasi;
create policy "Notifikasi self update" on public.notifikasi for update to authenticated using (user_id = auth.uid());

-- Audit Log (WORM: Select hanya Auditor/Admin, Insert authenticated, Tidak ada Update/Delete)
drop policy if exists "Audit log read auditor" on public.audit_log;
create policy "Audit log read auditor" on public.audit_log for select to authenticated using (
  public.has_role(auth.uid(), 'auditor') or public.has_role(auth.uid(), 'super_admin')
);

drop policy if exists "Audit log insert all" on public.audit_log;
create policy "Audit log insert all" on public.audit_log for insert to authenticated with check (true);

-- ==============================================================================
-- 22. SUPABASE STORAGE BUCKETS
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('dokumen-pegawai', 'dokumen-pegawai', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']),
  ('foto-pegawai', 'foto-pegawai', false, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('sertifikat-diklat', 'sertifikat-diklat', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

drop policy if exists "Akses dokumen pegawai privat" on storage.objects;
create policy "Akses dokumen pegawai privat" on storage.objects for select to authenticated using (
  bucket_id = 'dokumen-pegawai'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin_or_super()
    or public.is_pimpinan_or_auditor()
  )
);

drop policy if exists "Unggah dokumen pegawai" on storage.objects;
create policy "Unggah dokumen pegawai" on storage.objects for insert to authenticated with check (
  bucket_id = 'dokumen-pegawai'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin_or_super()
  )
);

drop policy if exists "Akses foto pegawai" on storage.objects;
create policy "Akses foto pegawai" on storage.objects for select to authenticated using (
  bucket_id = 'foto-pegawai'
);

drop policy if exists "Unggah foto pegawai" on storage.objects;
create policy "Unggah foto pegawai" on storage.objects for insert to authenticated with check (
  bucket_id = 'foto-pegawai'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin_or_super()
  )
);

drop policy if exists "Akses sertifikat diklat" on storage.objects;
create policy "Akses sertifikat diklat" on storage.objects for select to authenticated using (
  bucket_id = 'sertifikat-diklat'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin_or_super()
  )
);

drop policy if exists "Unggah sertifikat diklat" on storage.objects;
create policy "Unggah sertifikat diklat" on storage.objects for insert to authenticated with check (
  bucket_id = 'sertifikat-diklat'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin_or_super()
  )
);

-- ==============================================================================
-- 23. MATERIALIZED VIEWS AGREGAT
-- ==============================================================================
create materialized view if not exists mv_agregat_kepegawaian as
select
  count(*) as total_asn,
  count(*) filter (where status_kepegawaian = 'PNS') as total_pns,
  count(*) filter (where status_kepegawaian = 'PPPK') as total_pppk,
  count(*) filter (where status = 'aktif') as total_aktif,
  count(*) filter (where status = 'pensiun') as total_pensiun,
  count(*) filter (where tanggal_pensiun <= (current_date + interval '12 month') and status = 'aktif') as mendekati_pensiun_12_bln,
  now() as updated_at
from public.pegawai;

create unique index if not exists idx_mv_agregat on mv_agregat_kepegawaian(updated_at);

create materialized view if not exists mv_agregat_pd as
select
  pd.id as pd_id,
  pd.nama as pd_nama,
  count(p.id) as total_pegawai,
  count(p.id) filter (where p.status_kepegawaian = 'PNS') as total_pns,
  count(p.id) filter (where p.status_kepegawaian = 'PPPK') as total_pppk,
  now() as updated_at
from public.perangkat_daerah pd
left join public.pegawai p on p.pd_id = pd.id and p.status = 'aktif'
group by pd.id, pd.nama;

create unique index if not exists idx_mv_agregat_pd on mv_agregat_pd(pd_id);

create or replace function refresh_mat_views()
returns void as $$
begin
  refresh materialized view concurrently mv_agregat_kepegawaian;
  refresh materialized view concurrently mv_agregat_pd;
end;
$$ language plpgsql security definer;

-- Selesai File 1 (Master Migration)
