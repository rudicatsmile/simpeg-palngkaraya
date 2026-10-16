-- ==============================================================================
-- E-SIMPEG DAERAH
-- MIGRATION: ALTER TABLE APP_SETTINGS (TAMBAH TEMPLATE & LABEL BANNER KEPANGKATAN)
-- ==============================================================================

alter table public.app_settings
  add column if not exists label_early_warning_kp text default 'Status Early Warning: {fase} Kenaikan Pangkat',
  add column if not exists template_prediksi_tmt text default 'Prediksi TMT Kenaikan Pangkat: {tmt}',
  add column if not exists label_menuju_golongan text default 'Menuju Golongan',
  add column if not exists label_jenis_usulan text default 'Jenis Usulan',
  add column if not exists label_countdown_kp text default '{hari} Hari Lagi',
  add column if not exists label_subteks_tmt text default 'TMT Terhitung Mulai Tanggal',
  add column if not exists label_judul_checklist_kp text default 'Checklist Kelengkapan Syarat Berkas Administrasi:';

update public.app_settings
set 
  label_early_warning_kp = coalesce(label_early_warning_kp, 'Status Early Warning: {fase} Kenaikan Pangkat'),
  template_prediksi_tmt = coalesce(template_prediksi_tmt, 'Prediksi TMT Kenaikan Pangkat: {tmt}'),
  label_menuju_golongan = coalesce(label_menuju_golongan, 'Menuju Golongan'),
  label_jenis_usulan = coalesce(label_jenis_usulan, 'Jenis Usulan'),
  label_countdown_kp = coalesce(label_countdown_kp, '{hari} Hari Lagi'),
  label_subteks_tmt = coalesce(label_subteks_tmt, 'TMT Terhitung Mulai Tanggal'),
  label_judul_checklist_kp = coalesce(label_judul_checklist_kp, 'Checklist Kelengkapan Syarat Berkas Administrasi:')
where id = 'default';

insert into public.aturan_kepangkatan (id, golongan_dari, golongan_ke, masa_tahun, masa_bulan, berlaku_mulai, checklist)
values (
  'c1a1b1c1-0004-4000-8000-000000000004',
  'IV/a',
  'IV/b',
  4,
  0,
  '2020-01-01',
  '["SK Pangkat Terakhir (IV/a) Lengkap Tersimpan di Storage", "Penilaian Kinerja (SKP) 2 Tahun Terakhir minimal Baik", "Sertifikat Pelatihan Kepemimpinan Pengawas (PKP) Terverifikasi", "Surat Bebas Hukuman Disiplin Tingkat Sedang/Berat (Aktif: Nihil)"]'::jsonb
)
on conflict (id) do update set
  checklist = excluded.checklist;
