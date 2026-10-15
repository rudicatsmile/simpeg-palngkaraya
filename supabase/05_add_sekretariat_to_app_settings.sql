-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 5: ALTER TABLE APP_SETTINGS (TAMBAH INFORMASI SEKRETARIAT & KONTAK)
-- Siap dieksekusi di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avernwgzzwhugjdnmklx/sql/new
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. Tambah 5 kolom informasi sekretariat ke tabel public.app_settings
alter table public.app_settings 
add column if not exists nama_sekretariat text default 'Sekretariat BKPSDM',
add column if not exists alamat_sekretariat text default 'Jl. Praja Prajamukti No. 1, Kompleks Perkantoran Pemkab Nusantara Jaya',
add column if not exists telepon_sekretariat text default '(021) 8765-4321 / 0812-3456-7890',
add column if not exists email_sekretariat text default 'bkpsdm@nusantarajaya.go.id',
add column if not exists jam_operasional_sekretariat text default 'Senin - Jumat: 07.30 - 16.00 WIB';

-- 2. Update baris data default jika kolom masih bernilai NULL
update public.app_settings
set 
  nama_sekretariat = coalesce(nama_sekretariat, 'Sekretariat BKPSDM'),
  alamat_sekretariat = coalesce(alamat_sekretariat, 'Jl. Praja Prajamukti No. 1, Kompleks Perkantoran Pemkab Nusantara Jaya'),
  telepon_sekretariat = coalesce(telepon_sekretariat, '(021) 8765-4321 / 0812-3456-7890'),
  email_sekretariat = coalesce(email_sekretariat, 'bkpsdm@nusantarajaya.go.id'),
  jam_operasional_sekretariat = coalesce(jam_operasional_sekretariat, 'Senin - Jumat: 07.30 - 16.00 WIB')
where id = 'default';
