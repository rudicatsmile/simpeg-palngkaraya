-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 4: ALTER TABLE APP_SETTINGS (TAMBAH NAMA HAK CIPTA / COPYRIGHT)
-- Siap dieksekusi di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avernwgzzwhugjdnmklx/sql/new
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. Tambah kolom nama_hak_cipta ke tabel app_settings
alter table public.app_settings 
add column if not exists nama_hak_cipta text default '© 2026 Pemerintah Kabupaten Nusantara Jaya. Hak Cipta Dilindungi Undang-Undang.';

-- 2. Update baris default jika kolom masih kosong
update public.app_settings
set nama_hak_cipta = coalesce(
  nama_hak_cipta, 
  '© ' || extract(year from now())::text || ' ' || nama_sub_aplikasi || '. Hak Cipta Dilindungi Undang-Undang.'
)
where id = 'default';
