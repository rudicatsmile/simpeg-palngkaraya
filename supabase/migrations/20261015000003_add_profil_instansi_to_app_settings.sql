-- ==============================================================================
-- E-SIMPEG DAERAH
-- MIGRATION: 20261015000003_add_profil_instansi_to_app_settings.sql
-- ==============================================================================

-- 1. Tambah Kolom Profil Instansi Pemda, Kontak, Waktu & Keamanan ke public.app_settings
alter table public.app_settings
  add column if not exists nama_pemda text default 'Pemerintah Kota Palangkaraya',
  add column if not exists singkatan_bkd text default 'BKPSDM Kota Palangkaraya',
  add column if not exists nama_bkd text default 'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)',
  add column if not exists alamat_kantor text default 'Jl. Tjilik Riwut No. 98, Palangka Raya 73112',
  add column if not exists email_dinas text default 'bkpsdm@palangkaraya.go.id',
  add column if not exists no_telepon text default '(0536) 3221234',
  add column if not exists whatsapp_helpdesk text default '0812-3456-7890',
  add column if not exists situs_web text default 'https://bkpsdm.palangkaraya.go.id',
  add column if not exists zona_waktu text default 'WIB (Asia/Jakarta, UTC+7)',
  add column if not exists format_tanggal text default 'DD/MM/YYYY',
  add column if not exists tahun_anggaran text default '2026',
  add column if not exists toleransi_keterlambatan_menit text default '15',
  add column if not exists auto_lock_session_menit text default '30',
  add column if not exists enforce_mfa_admin boolean default true,
  add column if not exists instansi_config jsonb default '{}'::jsonb;

-- 2. Pastikan Baris Record 'default' Memiliki Nilai
insert into public.app_settings (id, nama_aplikasi, nama_sub_aplikasi)
values ('default', 'SIMPEG', 'Kota Palangkaraya')
on conflict (id) do nothing;

update public.app_settings
set 
  nama_pemda = coalesce(nama_pemda, case when nama_sub_aplikasi is not null then 'Pemerintah ' || nama_sub_aplikasi else 'Pemerintah Kota Palangkaraya' end),
  singkatan_bkd = coalesce(singkatan_bkd, case when nama_sub_aplikasi is not null then 'BKPSDM ' || nama_sub_aplikasi else 'BKPSDM Kota Palangkaraya' end),
  nama_bkd = coalesce(nama_bkd, 'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)'),
  alamat_kantor = coalesce(alamat_kantor, alamat_sekretariat, 'Jl. Tjilik Riwut No. 98, Palangka Raya 73112'),
  email_dinas = coalesce(email_dinas, email_sekretariat, 'bkpsdm@palangkaraya.go.id'),
  no_telepon = coalesce(no_telepon, telepon_sekretariat, '(0536) 3221234'),
  whatsapp_helpdesk = coalesce(whatsapp_helpdesk, '0812-3456-7890'),
  situs_web = coalesce(situs_web, 'https://bkpsdm.palangkaraya.go.id'),
  zona_waktu = coalesce(zona_waktu, 'WIB (Asia/Jakarta, UTC+7)'),
  format_tanggal = coalesce(format_tanggal, 'DD/MM/YYYY'),
  tahun_anggaran = coalesce(tahun_anggaran, '2026'),
  toleransi_keterlambatan_menit = coalesce(toleransi_keterlambatan_menit, '15'),
  auto_lock_session_menit = coalesce(auto_lock_session_menit, '30'),
  enforce_mfa_admin = coalesce(enforce_mfa_admin, true),
  instansi_config = coalesce(instansi_config, '{}'::jsonb)
where id = 'default';

-- 3. Row Level Security Policy agar user terautentikasi dapat mengupdate
drop policy if exists "app_settings_write_auth" on public.app_settings;
create policy "app_settings_write_auth"
  on public.app_settings
  for all
  to authenticated
  using (true)
  with check (true);
