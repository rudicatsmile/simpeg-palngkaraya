-- ==============================================================================
-- PEMBERSIHAN TABEL AUTH.USERS DARI DATA INSERT RAW SQL
-- Jalankan skrip ini sekali di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avernwgzzwhugjdnmklx/sql/new
-- ==============================================================================

-- 1. Bersihkan tabel relasi publik terlebih dahulu
delete from public.user_roles where user_id::text like '01a1b1c1%';
update public.pegawai set user_id = null where user_id::text like '01a1b1c1%';

-- 2. Bersihkan tabel internal auth
delete from auth.identities where user_id::text like '01a1b1c1%';
delete from auth.users where id::text like '01a1b1c1%';

-- Selesai! Setelah ini dijalankan, agen akan otomatis membuat 7 akun
-- menggunakan Supabase Auth Admin API resmi.
