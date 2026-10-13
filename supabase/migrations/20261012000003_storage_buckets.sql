-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Migration: 20261012000003_storage_buckets.sql
-- Kepatuhan: Bab 10 PRD, Supabase Storage Private Buckets & Signed URLs
-- ==============================================================================

-- Buat 3 Bucket Privat
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('dokumen-pegawai', 'dokumen-pegawai', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']),
  ('foto-pegawai', 'foto-pegawai', false, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('sertifikat-diklat', 'sertifikat-diklat', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- RLS Storage Objects Policy
-- 1. dokumen-pegawai: hanya pemilik, atasan, admin, dan auditor yang dapat membaca
create policy "Akses dokumen pegawai privat"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'dokumen-pegawai'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin_or_super()
      or public.is_pimpinan_or_auditor()
    )
  );

create policy "Unggah dokumen pegawai"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'dokumen-pegawai'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin_or_super()
    )
  );

-- 2. foto-pegawai: dibaca authenticated (untuk avatar dashboard), diunggah pemilik/admin
create policy "Akses foto pegawai"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'foto-pegawai');

create policy "Unggah foto pegawai"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'foto-pegawai'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin_or_super()
    )
  );

-- 3. sertifikat-diklat: dibaca pemilik dan admin
create policy "Akses sertifikat diklat"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'sertifikat-diklat'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin_or_super()
    )
  );

create policy "Unggah sertifikat diklat"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sertifikat-diklat'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin_or_super()
    )
  );
