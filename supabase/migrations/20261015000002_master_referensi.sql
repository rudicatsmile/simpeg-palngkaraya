-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- MIGRATION: 20261015000002_master_referensi.sql
-- ==============================================================================

-- 1. Buat Tabel Master Referensi Universal
create table if not exists public.master_referensi (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,
  kode text not null,
  nama text not null,
  deskripsi text default '',
  urutan integer not null default 0,
  badge_color text default 'slate',
  is_active boolean not null default true,
  is_system boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_master_referensi_kategori_kode unique (kategori, kode)
);

create index if not exists idx_master_referensi_kategori on public.master_referensi(kategori);
create index if not exists idx_master_referensi_kategori_active on public.master_referensi(kategori, is_active);
create index if not exists idx_master_referensi_kategori_urutan on public.master_referensi(kategori, urutan asc);

create or replace function public.update_master_referensi_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_master_referensi_updated on public.master_referensi;
create trigger trg_master_referensi_updated
  before update on public.master_referensi
  for each row execute function public.update_master_referensi_timestamp();

alter table public.master_referensi enable row level security;

drop policy if exists "Master referensi read all" on public.master_referensi;
create policy "Master referensi read all" on public.master_referensi
  for select to public
  using (true);

drop policy if exists "Master referensi auth write" on public.master_referensi;
create policy "Master referensi auth write" on public.master_referensi
  for all to authenticated
  using (true)
  with check (true);

alter table public.perangkat_daerah drop constraint if exists perangkat_daerah_status_check;
alter table public.jabatan drop constraint if exists jabatan_jenis_check;
alter table public.pegawai drop constraint if exists pegawai_status_kepegawaian_check;
alter table public.pegawai drop constraint if exists pegawai_jenis_kelamin_check;
alter table public.usulan_kenaikan_pangkat drop constraint if exists usulan_kenaikan_pangkat_jenis_check;
alter table public.mutasi drop constraint if exists mutasi_jenis_check;
alter table public.skp_target drop constraint if exists skp_target_aspek_check;
alter table public.cuti drop constraint if exists cuti_jenis_check;
alter table public.dokumen drop constraint if exists dokumen_kategori_check;

-- Seed Data
insert into public.master_referensi (kategori, kode, nama, deskripsi, urutan, badge_color, is_system, metadata)
values
  -- Status Pegawai
  ('status_pegawai', 'aktif', 'Aktif', 'Pegawai aktif menjalankan tugas kedinasan', 1, 'emerald', true, '{"icon": "UserCheck"}'),
  ('status_pegawai', 'cuti_besar', 'Cuti Besar', 'Pegawai sedang dalam masa cuti besar', 2, 'amber', true, '{"icon": "Calendar"}'),
  ('status_pegawai', 'diberhentikan', 'Diberhentikan', 'Pegawai diberhentikan dengan hormat/tidak hormat', 3, 'rose', true, '{"icon": "UserX"}'),
  ('status_pegawai', 'pensiun', 'Pensiun', 'Pegawai telah purna tugas', 4, 'blue', true, '{"icon": "HeartHandshake"}'),
  ('status_pegawai', 'meninggal', 'Meninggal Dunia', 'Pegawai telah wafat', 5, 'slate', true, '{"icon": "Cross"}'),

  -- Status Cuti
  ('status_cuti', 'draft', 'Draft', 'Permohonan cuti masih dalam penyusunan pegawai', 1, 'slate', true, '{}'),
  ('status_cuti', 'diajukan', 'Diajukan', 'Permohonan cuti telah diajukan ke atasan langsung', 2, 'blue', true, '{}'),
  ('status_cuti', 'disetujui_atasan', 'Disetujui Atasan', 'Telah disetujui atasan langsung, menunggu Kepala PD', 3, 'cyan', true, '{}'),
  ('status_cuti', 'disetujui_kepala_pd', 'Disetujui Kepala PD', 'Telah disetujui Kepala Perangkat Daerah / BKPSDM', 4, 'emerald', true, '{}'),
  ('status_cuti', 'ditolak', 'Ditolak', 'Permohonan cuti ditolak dengan alasan tercatat', 5, 'rose', true, '{}'),
  ('status_cuti', 'dibatalkan', 'Dibatalkan', 'Permohonan cuti dibatalkan oleh pemohon', 6, 'slate', true, '{}'),
  ('status_cuti', 'selesai', 'Selesai', 'Masa cuti telah selesai dijalankan', 7, 'emerald', true, '{}'),

  -- Status Workflow
  ('status_workflow', 'draft', 'Draft', 'Berkas masih berbentuk draft awal', 1, 'slate', true, '{}'),
  ('status_workflow', 'diajukan', 'Diajukan', 'Berkas diajukan untuk proses verifikasi', 2, 'blue', true, '{}'),
  ('status_workflow', 'verifikasi', 'Dalam Verifikasi', 'Sedang diverifikasi tim penilai/verifikator', 3, 'amber', true, '{}'),
  ('status_workflow', 'disetujui', 'Disetujui', 'Usulan atau permohonan telah disetujui resmi', 4, 'emerald', true, '{}'),
  ('status_workflow', 'ditolak', 'Ditolak', 'Usulan ditolak dengan catatan perbaikan', 5, 'rose', true, '{}'),
  ('status_workflow', 'selesai', 'Selesai', 'Seluruh siklus workflow telah tuntas', 6, 'teal', true, '{}'),

  -- Jenis Disiplin
  ('jenis_disiplin', 'ringan', 'Tingkat Ringan', 'Pelanggaran disiplin ringan', 1, 'amber', true, '{"bobot": 1}'),
  ('jenis_disiplin', 'sedang', 'Tingkat Sedang', 'Pelanggaran disiplin sedang', 2, 'orange', true, '{"bobot": 2}'),
  ('jenis_disiplin', 'berat', 'Tingkat Berat', 'Pelanggaran disiplin berat', 3, 'rose', true, '{"bobot": 3}'),

  -- Status Absensi
  ('status_absensi', 'hadir', 'Hadir Tepat Waktu', 'Pegawai hadir sesuai jam kerja', 1, 'emerald', true, '{}'),
  ('status_absensi', 'terlambat', 'Terlambat Hadir', 'Hadir melebihi toleransi waktu', 2, 'amber', true, '{}'),
  ('status_absensi', 'izin', 'Izin Resmi', 'Izin tidak masuk kerja dengan surat izin sah', 3, 'blue', true, '{}'),
  ('status_absensi', 'sakit', 'Sakit', 'Tidak masuk kerja karena sakit dengan surat dokter', 4, 'cyan', true, '{}'),
  ('status_absensi', 'cuti', 'Cuti', 'Sedang dalam masa pelaksanaan cuti kerja resmi', 5, 'violet', true, '{}'),
  ('status_absensi', 'alpha', 'Tanpa Keterangan (Alpha)', 'Tidak hadir tanpa izin sah', 6, 'rose', true, '{}'),
  ('status_absensi', 'dinas_luar', 'Dinas Luar', 'Melaksanakan tugas kedinasan di luar kantor (SPT)', 7, 'indigo', true, '{}'),

  -- Status SKP
  ('status_skp', 'draft', 'Draft Rencana', 'Sasaran Kinerja Pegawai masih dalam penyusunan', 1, 'slate', true, '{}'),
  ('status_skp', 'ditetapkan', 'Ditetapkan', 'Sasaran SKP telah ditetapkan oleh penilai', 2, 'blue', true, '{}'),
  ('status_skp', 'dinilai', 'Sedang Dinilai', 'Realisasi sasaran sedang dalam tahap penilaian', 3, 'amber', true, '{}'),
  ('status_skp', 'final', 'Final Disahkan', 'Hasil penilaian SKP telah final dan disahkan', 4, 'emerald', true, '{}'),

  -- Status Perangkat Daerah
  ('status_pd', 'aktif', 'Aktif Beroperasi', 'Unit perangkat daerah aktif menjalankan fungsi', 1, 'emerald', true, '{}'),
  ('status_pd', 'nonaktif', 'Non-Aktif / Dilebur', 'Unit kerja telah dilikuidasi atau digabung', 2, 'slate', true, '{}'),

  -- Jenis Jabatan
  ('jenis_jabatan', 'struktural', 'Struktural', 'Jabatan manajerial kepemimpinan', 1, 'indigo', true, '{}'),
  ('jenis_jabatan', 'fungsional', 'Fungsional Tertentu', 'Jabatan keahlian dan keterampilan', 2, 'blue', true, '{}'),
  ('jenis_jabatan', 'pelaksana', 'Pelaksana Umum', 'Jabatan umum administrasi operasional', 3, 'cyan', true, '{}'),

  -- Jenis Kelamin
  ('jenis_kelamin', 'L', 'Laki-Laki', 'Jenis kelamin laki-laki', 1, 'blue', true, '{}'),
  ('jenis_kelamin', 'P', 'Perempuan', 'Jenis kelamin perempuan', 2, 'rose', true, '{}'),

  -- Status Kepegawaian
  ('status_kepegawaian', 'PNS', 'Pegawai Negeri Sipil (PNS)', 'Aparatur Sipil Negara PNS', 1, 'blue', true, '{}'),
  ('status_kepegawaian', 'PPPK', 'Pegawai Pemerintah dengan Perjanjian Kerja (PPPK)', 'Aparatur Sipil Negara PPPK', 2, 'teal', true, '{}'),

  -- Jenis Usulan Kenaikan Pangkat
  ('jenis_usulan_pangkat', 'reguler', 'Kenaikan Pangkat Reguler', 'Kenaikan pangkat berkala 4 tahunan', 1, 'blue', true, '{}'),
  ('jenis_usulan_pangkat', 'pilihan', 'Kenaikan Pangkat Pilihan', 'Kenaikan pangkat jabatan struktural / fungsional', 2, 'indigo', true, '{}'),
  ('jenis_usulan_pangkat', 'kgb', 'Kenaikan Gaji Berkala (KGB)', 'Penyesuaian gaji berkala 2 tahunan', 3, 'emerald', true, '{}'),

  -- Jenis Mutasi
  ('jenis_mutasi', 'mutasi', 'Mutasi Antar Unit', 'Perpindahan tugas antar unit kerja', 1, 'blue', true, '{}'),
  ('jenis_mutasi', 'rotasi', 'Rotasi Jabatan', 'Penyegaran tugas pada unit kerja yang sama', 2, 'amber', true, '{}'),
  ('jenis_mutasi', 'promosi', 'Promosi Jabatan', 'Kenaikan jenjang jabatan ke tingkat lebih tinggi', 3, 'emerald', true, '{}'),

  -- Predikat SKP
  ('predikat_skp', 'Sangat Baik', 'Sangat Baik', 'Melampaui ekspektasi tinggi', 1, 'emerald', true, '{"min_skor": 90}'),
  ('predikat_skp', 'Baik', 'Baik', 'Memenuhi ekspektasi pimpinan', 2, 'blue', true, '{"min_skor": 75}'),
  ('predikat_skp', 'Cukup', 'Cukup / Butuh Perbaikan', 'Sebagian memenuhi ekspektasi', 3, 'amber', true, '{"min_skor": 60}'),
  ('predikat_skp', 'Kurang', 'Kurang', 'Di bawah ekspektasi pimpinan', 4, 'orange', true, '{"min_skor": 50}'),
  ('predikat_skp', 'Sangat Kurang', 'Sangat Kurang', 'Sangat jauh di bawah ekspektasi', 5, 'rose', true, '{"min_skor": 0}'),

  -- Aspek SKP
  ('aspek_skp', 'kuantitas', 'Kuantitas Hasil', 'Target keluaran volume berkas / kegiatan', 1, 'blue', true, '{}'),
  ('aspek_skp', 'kualitas', 'Kualitas Mutu', 'Target persentase kesesuaian SOP', 2, 'emerald', true, '{}'),
  ('aspek_skp', 'waktu', 'Ketepatan Waktu', 'Target durasi atau batas penyelesaian', 3, 'amber', true, '{}'),
  ('aspek_skp', 'biaya', 'Efisiensi Biaya', 'Target efisiensi penyerapan dana', 4, 'violet', true, '{}'),

  -- Jenis Cuti
  ('jenis_cuti', 'tahunan', 'Cuti Tahunan', 'Hak cuti tahunan (default 12 hari kerja)', 1, 'blue', true, '{"default_hari": 12, "potong_kuota": true}'),
  ('jenis_cuti', 'besar', 'Cuti Besar', 'Cuti setelah masa kerja 5 tahun', 2, 'indigo', true, '{"default_hari": 90, "potong_kuota": false}'),
  ('jenis_cuti', 'sakit', 'Cuti Sakit', 'Cuti karena sakit dengan surat dokter', 3, 'amber', true, '{"potong_kuota": false}'),
  ('jenis_cuti', 'melahirkan', 'Cuti Melahirkan', 'Cuti persalinan', 4, 'rose', true, '{"default_hari": 90, "potong_kuota": false}'),
  ('jenis_cuti', 'alasan_penting', 'Cuti Alasan Penting (CAP)', 'Cuti musibah keluarga inti atau mendesak', 5, 'orange', true, '{"default_hari": 30, "potong_kuota": false}'),
  ('jenis_cuti', 'di_luar_tanggungan', 'Cuti di Luar Tanggungan Negara', 'Cuti khusus di luar tanggungan negara', 6, 'slate', true, '{"potong_kuota": false}'),

  -- Jenis Kompetensi
  ('jenis_kompetensi', 'Manajerial', 'Kompetensi Manajerial', 'Kepemimpinan dan integritas kerja', 1, 'indigo', true, '{}'),
  ('jenis_kompetensi', 'Sosio Kultural', 'Kompetensi Sosio Kultural', 'Perekat kebangsaan dan empati', 2, 'teal', true, '{}'),
  ('jenis_kompetensi', 'Teknis', 'Kompetensi Teknis', 'Keahlian teknis spesifik profesi', 3, 'blue', true, '{}'),

  -- Status Hukuman
  ('status_hukuman', 'aktif', 'Hukuman Masih Berjalan', 'Masa hukuman disiplin sedang berlaku', 1, 'rose', true, '{}'),
  ('status_hukuman', 'berakhir', 'Hukuman Telah Berakhir', 'Masa hukuman disiplin telah selesai', 2, 'emerald', true, '{}'),

  -- Status Pensiun Checklist
  ('status_pensiun_checklist', 'belum', 'Belum Diunggah', 'Berkas belum diserahkan pemohon', 1, 'slate', true, '{}'),
  ('status_pensiun_checklist', 'proses', 'Dalam Pemeriksaan', 'Berkas sedang diverifikasi petugas', 2, 'amber', true, '{}'),
  ('status_pensiun_checklist', 'lengkap', 'Lengkap & Memenuhi Syarat', 'Berkas telah disetujui lengkap', 3, 'emerald', true, '{}'),

  -- Kategori Dokumen
  ('kategori_dokumen', 'SK CPNS/PNS', 'SK CPNS / PNS', 'Surat Keputusan Pengangkatan CPNS atau PNS', 1, 'blue', true, '{}'),
  ('kategori_dokumen', 'SK Pangkat', 'SK Pangkat Terakhir', 'Surat Keputusan Kenaikan Pangkat terakhir', 2, 'indigo', true, '{}'),
  ('kategori_dokumen', 'SK Jabatan', 'SK Pengangkatan Jabatan', 'Surat Keputusan Jabatan', 3, 'violet', true, '{}'),
  ('kategori_dokumen', 'Ijazah', 'Ijazah & Transkrip Nilai', 'Dokumen ijazah formal', 4, 'teal', true, '{}'),
  ('kategori_dokumen', 'KTP', 'Identitas Kependudukan (KTP/KK)', 'Kartu Tanda Penduduk atau Kartu Keluarga', 5, 'cyan', true, '{}'),
  ('kategori_dokumen', 'Sertifikat', 'Sertifikat Pelatihan / Diklat', 'Sertifikat lulus diklat atau uji kompetensi', 6, 'emerald', true, '{}'),
  ('kategori_dokumen', 'Surat Cuti', 'Surat Izin / Cuti Resmi', 'Surat keputusan cuti resmi', 7, 'amber', true, '{}'),
  ('kategori_dokumen', 'Lainnya', 'Dokumen Kedinasan Lainnya', 'Dokumen kepegawaian pendukung lainnya', 8, 'slate', true, '{}'),

  -- Status TTD Dokumen
  ('status_ttd_dokumen', 'belum', 'Belum Ditandatangani', 'Belum ada tanda tangan basah atau elektronik', 1, 'slate', true, '{}'),
  ('status_ttd_dokumen', 'internal', 'Paraf / TTD Internal', 'Sudah diparaf/ditandatangani pejabat internal', 2, 'amber', true, '{}'),
  ('status_ttd_dokumen', 'tte', 'Tanda Tangan Elektronik (TTE BSrE)', 'Disahkan TTE resmi bersertifikat BSrE', 3, 'emerald', true, '{}'),

  -- Kategori Notifikasi
  ('kategori_notifikasi', 'Kepangkatan', 'Layanan Kepangkatan', 'Pemberitahuan usulan dan SK pangkat', 1, 'indigo', true, '{"icon": "Award"}'),
  ('kategori_notifikasi', 'Cuti', 'Layanan Cuti', 'Pemberitahuan alur cuti pegawai', 2, 'blue', true, '{"icon": "Calendar"}'),
  ('kategori_notifikasi', 'Disiplin', 'Peringatan Disiplin', 'Pemberitahuan tindak lanjut disiplin', 3, 'rose', true, '{"icon": "AlertTriangle"}'),
  ('kategori_notifikasi', 'Kinerja', 'Penilaian Kinerja (SKP)', 'Pengingat sasaran dan penilaian SKP', 4, 'amber', true, '{"icon": "Target"}'),
  ('kategori_notifikasi', 'Pensiun', 'Layanan Pensiun', 'Pemberitahuan masa purna tugas dan berkas', 5, 'teal', true, '{"icon": "HeartHandshake"}'),
  ('kategori_notifikasi', 'Sistem', 'Informasi Sistem', 'Pengumuman pemeliharaan dan info umum', 6, 'slate', true, '{"icon": "Settings"}')

on conflict (kategori, kode) do update set
  nama = excluded.nama,
  deskripsi = coalesce(nullif(excluded.deskripsi, ''), public.master_referensi.deskripsi),
  urutan = excluded.urutan,
  badge_color = excluded.badge_color,
  is_system = excluded.is_system,
  metadata = coalesce(excluded.metadata, public.master_referensi.metadata),
  updated_at = now();
