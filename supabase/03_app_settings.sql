-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 3: MIGRATION & SEED APP_SETTINGS (BRANDING & ATRIBUT APLIKASI BERANDA)
-- Siap dieksekusi langsung di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avernwgzzwhugjdnmklx/sql/new
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. TABEL APP_SETTINGS
create table if not exists public.app_settings (
  id text primary key default 'default',
  nama_aplikasi text not null default 'SIMPEG Daerah',
  nama_sub_aplikasi text not null default 'Kabupaten Nusantara Jaya',
  slogan text not null default 'Transformasi Digital Kepegawaian Terpadu',
  teks_perkenalan text not null default 'Kelola seluruh siklus hidup ASN mulai dari data induk, prediksi kenaikan pangkat tepat waktu, mutasi, penilaian kinerja SKP, hingga persiapan pensiun dalam satu ekosistem self-service yang aman dan prediktif.',
  nama_hak_cipta text default '© 2026 Pemerintah Kabupaten Nusantara Jaya. Hak Cipta Dilindungi Undang-Undang.',
  logo_url text,
  favicon_url text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);


-- 2. ROW LEVEL SECURITY (RLS)
alter table public.app_settings enable row level security;

-- Public/Anon boleh membaca konfigurasi aplikasi (agar beranda bisa merender atribut tanpa login)
drop policy if exists "app_settings_public_read" on public.app_settings;
create policy "app_settings_public_read"
  on public.app_settings
  for select
  using (true);

-- Hanya Administrator (super_admin atau operator) yang boleh mengupdate konfigurasi
drop policy if exists "app_settings_admin_update" on public.app_settings;
create policy "app_settings_admin_update"
  on public.app_settings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  )
  with check (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  );

-- Hanya Administrator yang boleh menginsert jika record belum ada
drop policy if exists "app_settings_admin_insert" on public.app_settings;
create policy "app_settings_admin_insert"
  on public.app_settings
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  );

-- 3. STORAGE BUCKET UNTUK ASSET APLIKASI (LOGO & FAVICON)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'app-assets',
  'app-assets',
  true,
  2097152, -- 2MB
  array['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/webp'];

-- Storage Policies untuk app-assets
drop policy if exists "app_assets_public_read" on storage.objects;
create policy "app_assets_public_read"
  on storage.objects
  for select
  using (bucket_id = 'app-assets');

drop policy if exists "app_assets_admin_insert" on storage.objects;
create policy "app_assets_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'app-assets'
    and exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  );

drop policy if exists "app_assets_admin_update" on storage.objects;
create policy "app_assets_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'app-assets'
    and exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  );

drop policy if exists "app_assets_admin_delete" on storage.objects;
create policy "app_assets_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'app-assets'
    and exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
      and ur.role in ('super_admin', 'operator')
    )
  );

-- 4. DEFAULT SEED VALUE
insert into public.app_settings (
  id,
  nama_aplikasi,
  nama_sub_aplikasi,
  slogan,
  teks_perkenalan,
  nama_hak_cipta,
  logo_url,
  favicon_url,
  updated_at
) values (
  'default',
  'SIMPEG Daerah',
  'Kabupaten Nusantara Jaya',
  'Transformasi Digital Kepegawaian Terpadu',
  'Kelola seluruh siklus hidup ASN mulai dari data induk, prediksi kenaikan pangkat tepat waktu, mutasi, penilaian kinerja SKP, hingga persiapan pensiun dalam satu ekosistem self-service yang aman dan prediktif.',
  '© 2026 Pemerintah Kabupaten Nusantara Jaya. Hak Cipta Dilindungi Undang-Undang.',
  null,
  null,
  now()
) on conflict (id) do nothing;

