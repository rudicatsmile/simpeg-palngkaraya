-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 6: MASTER DATA PERANGKAT DAERAH (STATUS & REUSABILITY)
-- Siap dieksekusi di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avernwgzzwhugjdnmklx/sql/new
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. Buat tabel perangkat_daerah jika belum ada
create table if not exists public.perangkat_daerah (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  nama text not null,
  parent_id uuid references public.perangkat_daerah(id) on delete set null,
  status text not null default 'aktif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Tambah kolom status dan updated_at jika tabel sudah ada tapi belum memiliki kolom tersebut
alter table public.perangkat_daerah 
  add column if not exists status text not null default 'aktif',
  add column if not exists updated_at timestamptz not null default now();

-- 3. Tambahkan constraint check untuk kolom status (aktif / nonaktif)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'perangkat_daerah_status_check'
  ) then
    alter table public.perangkat_daerah 
      add constraint perangkat_daerah_status_check check (status in ('aktif', 'nonaktif'));
  end if;
end $$;

-- 4. Pastikan data yang ada memiliki status 'aktif' dan updated_at
update public.perangkat_daerah 
set 
  status = coalesce(status, 'aktif'),
  updated_at = coalesce(updated_at, now())
where status is null or updated_at is null;

-- 5. Seed Data Awal Master Perangkat Daerah (7 Unit Kerja Utama)
insert into public.perangkat_daerah (id, kode, nama, status, created_at, updated_at) values
  ('d1a1b1c1-0001-4000-8000-000000000001', 'PD-01', 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)', 'aktif', now(), now()),
  ('d1a1b1c1-0002-4000-8000-000000000002', 'PD-02', 'Dinas Pendidikan dan Kebudayaan', 'aktif', now(), now()),
  ('d1a1b1c1-0003-4000-8000-000000000003', 'PD-03', 'Dinas Kesehatan', 'aktif', now(), now()),
  ('d1a1b1c1-0004-4000-8000-000000000004', 'PD-04', 'Dinas Pekerjaan Umum dan Penataan Ruang', 'aktif', now(), now()),
  ('d1a1b1c1-0005-4000-8000-000000000005', 'PD-05', 'Badan Perencanaan Pembangunan Daerah (Bappeda)', 'aktif', now(), now()),
  ('d1a1b1c1-0006-4000-8000-000000000006', 'PD-06', 'Inspektorat Daerah', 'aktif', now(), now()),
  ('d1a1b1c1-0007-4000-8000-000000000007', 'PD-07', 'Sekretariat Daerah', 'aktif', now(), now())
on conflict (id) do update set
  nama = excluded.nama,
  kode = excluded.kode,
  status = coalesce(public.perangkat_daerah.status, excluded.status),
  updated_at = now();

-- 6. Row Level Security (RLS) Policy
alter table public.perangkat_daerah enable row level security;

drop policy if exists "PD read all" on public.perangkat_daerah;
create policy "PD read all" on public.perangkat_daerah 
  for select to authenticated, anon 
  using (true);

drop policy if exists "PD admin write" on public.perangkat_daerah;
create policy "PD admin write" on public.perangkat_daerah 
  for all to authenticated 
  using (true) 
  with check (true);
