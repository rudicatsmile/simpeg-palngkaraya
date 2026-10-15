-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- FILE 7: MASTER REFERENSI & DYNAMIC DATA LOOKUP
-- Siap dieksekusi di Supabase SQL Editor
-- Bersifat Idempotent (Aman dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. Buat Tabel Master Referensi Universal
create table if not exists public.master_referensi (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,               -- misal: 'status_pegawai', 'jenis_cuti', 'kategori_dokumen'
  kode text not null,                   -- misal: 'aktif', 'tahunan', 'sk_cpns'
  nama text not null,                   -- Label tampilan: 'Aktif', 'Cuti Tahunan', 'SK CPNS/PNS'
  deskripsi text default '',
  urutan integer not null default 0,
  badge_color text default 'slate',     -- 'emerald', 'blue', 'amber', 'rose', 'violet', 'cyan', 'slate'
  is_active boolean not null default true,
  is_system boolean not null default false, -- Data bawaan sistem yang tidak boleh dihapus sembarangan
  metadata jsonb default '{}'::jsonb,   -- Konfigurasi tambahan fleksibel (kuota, bobot, icon, dll)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_master_referensi_kategori_kode unique (kategori, kode)
);

-- 2. Index Performa Pencarian & Filter
create index if not exists idx_master_referensi_kategori on public.master_referensi(kategori);
create index if not exists idx_master_referensi_kategori_active on public.master_referensi(kategori, is_active);
create index if not exists idx_master_referensi_kategori_urutan on public.master_referensi(kategori, urutan asc);

-- 3. Trigger Timestamp Otomatis
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

-- 4. Keamanan Akses (Row Level Security / RLS)
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

-- 5. Relaksasi CHECK Constraint Kaku pada Tabel Transaksi Eksisting
-- Agar opsi baru yang ditambahkan di master data tidak diblokir oleh check constraint statis lama
alter table public.perangkat_daerah drop constraint if exists perangkat_daerah_status_check;
alter table public.jabatan drop constraint if exists jabatan_jenis_check;
alter table public.pegawai drop constraint if exists pegawai_status_kepegawaian_check;
alter table public.pegawai drop constraint if exists pegawai_jenis_kelamin_check;
alter table public.usulan_kenaikan_pangkat drop constraint if exists usulan_kenaikan_pangkat_jenis_check;
alter table public.mutasi drop constraint if exists mutasi_jenis_check;
alter table public.skp_target drop constraint if exists skp_target_aspek_check;
alter table public.cuti drop constraint if exists cuti_jenis_check;
alter table public.dokumen drop constraint if exists dokumen_kategori_check;

-- 6. SEED DATA AWAL 20 KATEGORI MASTER REFERENSI
-- Disertai kode, nama, deskripsi, urutan, badge_color, dan is_system: true

insert into public.master_referensi (kategori, kode, nama, deskripsi, urutan, badge_color, is_system, metadata)
values
  -- 1. Status Pegawai (L22-L27)
  ('status_pegawai', 'aktif', 'Aktif', 'Pegawai aktif menjalankan tugas kedinasan', 1, 'emerald', true, '{"icon": "UserCheck"}'),
  ('status_pegawai', 'cuti_besar', 'Cuti Besar', 'Pegawai sedang dalam masa cuti besar', 2, 'amber', true, '{"icon": "Calendar"}'),
  ('status_pegawai', 'diberhentikan', 'Diberhentikan', 'Pegawai diberhentikan dengan hormat/tidak hormat', 3, 'rose', true, '{"icon": "UserX"}'),
  ('status_pegawai', 'pensiun', 'Pensiun', 'Pegawai telah purna tugas', 4, 'blue', true, '{"icon": "HeartHandshake"}'),
  ('status_pegawai', 'meninggal', 'Meninggal Dunia', 'Pegawai telah wafat', 5, 'slate', true, '{"icon": "Cross"}'),

  -- 2. Status Cuti (L29-L36)
  ('status_cuti', 'draft', 'Draft', 'Permohonan cuti masih dalam penyusunan pegawai', 1, 'slate', true, '{}'),
  ('status_cuti', 'diajukan', 'Diajukan', 'Permohonan cuti telah diajukan ke atasan langsung', 2, 'blue', true, '{}'),
  ('status_cuti', 'disetujui_atasan', 'Disetujui Atasan', 'Telah disetujui atasan langsung, menunggu Kepala PD', 3, 'cyan', true, '{}'),
  ('status_cuti', 'disetujui_kepala_pd', 'Disetujui Kepala PD', 'Telah disetujui Kepala Perangkat Daerah / BKPSDM', 4, 'emerald', true, '{}'),
  ('status_cuti', 'ditolak', 'Ditolak', 'Permohonan cuti ditolak dengan alasan tercatat', 5, 'rose', true, '{}'),
  ('status_cuti', 'dibatalkan', 'Dibatalkan', 'Permohonan cuti dibatalkan oleh pemohon', 6, 'slate', true, '{}'),
  ('status_cuti', 'selesai', 'Selesai', 'Masa cuti telah selesai dijalankan', 7, 'emerald', true, '{}'),

  -- 3. Status Workflow Approval (L38-L44)
  ('status_workflow', 'draft', 'Draft', 'Berkas masih berbentuk draft awal', 1, 'slate', true, '{}'),
  ('status_workflow', 'diajukan', 'Diajukan', 'Berkas diajukan untuk proses verifikasi', 2, 'blue', true, '{}'),
  ('status_workflow', 'verifikasi', 'Dalam Verifikasi', 'Sedang diverifikasi tim penilai/verifikator', 3, 'amber', true, '{}'),
  ('status_workflow', 'disetujui', 'Disetujui', 'Usulan atau permohonan telah disetujui resmi', 4, 'emerald', true, '{}'),
  ('status_workflow', 'ditolak', 'Ditolak', 'Usulan ditolak dengan catatan perbaikan', 5, 'rose', true, '{}'),
  ('status_workflow', 'selesai', 'Selesai', 'Seluruh siklus workflow telah tuntas', 6, 'teal', true, '{}'),

  -- 4. Jenis Disiplin (L46)
  ('jenis_disiplin', 'ringan', 'Tingkat Ringan', 'Pelanggaran disiplin ringan (teguran lisan/tertulis/pernyataan)', 1, 'amber', true, '{"bobot": 1}'),
  ('jenis_disiplin', 'sedang', 'Tingkat Sedang', 'Pelanggaran disiplin sedang (pemotongan tunjangan kinerja/penundaan kenaikan)', 2, 'orange', true, '{"bobot": 2}'),
  ('jenis_disiplin', 'berat', 'Tingkat Berat', 'Pelanggaran disiplin berat (penurunan pangkat/pembebasan jabatan/pemberhentian)', 3, 'rose', true, '{"bobot": 3}'),

  -- 5. Status Absensi (L48-L55)
  ('status_absensi', 'hadir', 'Hadir Tepat Waktu', 'Pegawai hadir sesuai jam kerja yang ditentukan', 1, 'emerald', true, '{}'),
  ('status_absensi', 'terlambat', 'Terlambat Hadir', 'Hadir melebihi toleransi waktu keterlambatan', 2, 'amber', true, '{}'),
  ('status_absensi', 'izin', 'Izin Resmi', 'Izin tidak masuk kerja dengan surat izin sah', 3, 'blue', true, '{}'),
  ('status_absensi', 'sakit', 'Sakit', 'Tidak masuk kerja karena sakit dengan surat dokter', 4, 'cyan', true, '{}'),
  ('status_absensi', 'cuti', 'Cuti', 'Sedang dalam masa pelaksanaan cuti kerja resmi', 5, 'violet', true, '{}'),
  ('status_absensi', 'alpha', 'Tanpa Keterangan (Alpha)', 'Tidak hadir tanpa ada konfirmasi atau izin sah', 6, 'rose', true, '{}'),
  ('status_absensi', 'dinas_luar', 'Dinas Luar', 'Melaksanakan tugas kedinasan di luar kantor (SPT)', 7, 'indigo', true, '{}'),

  -- 6. Status SKP (L57)
  ('status_skp', 'draft', 'Draft Rencana', 'Sasaran Kinerja Pegawai masih dalam penyusunan', 1, 'slate', true, '{}'),
  ('status_skp', 'ditetapkan', 'Ditetapkan', 'Sasaran SKP telah disetujui & ditetapkan oleh penilai', 2, 'blue', true, '{}'),
  ('status_skp', 'dinilai', 'Sedang Dinilai', 'Realisasi sasaran sedang dalam tahap penilaian', 3, 'amber', true, '{}'),
  ('status_skp', 'final', 'Final Disahkan', 'Hasil penilaian SKP telah final dan disahkan', 4, 'emerald', true, '{}'),

  -- 7. Status Perangkat Daerah (L69)
  ('status_pd', 'aktif', 'Aktif Beroperasi', 'Unit perangkat daerah aktif menjalankan fungsi', 1, 'emerald', true, '{}'),
  ('status_pd', 'nonaktif', 'Non-Aktif / Dilebur', 'Unit kerja telah dilikuidasi atau digabung', 2, 'slate', true, '{}'),

  -- 8. Jenis Jabatan (L79)
  ('jenis_jabatan', 'struktural', 'Struktural', 'Jabatan manajerial dan kepemimpinan berjenjang', 1, 'indigo', true, '{}'),
  ('jenis_jabatan', 'fungsional', 'Fungsional Tertentu', 'Jabatan fungsional keahlian dan keterampilan khusus', 2, 'blue', true, '{}'),
  ('jenis_jabatan', 'pelaksana', 'Pelaksana Umum', 'Jabatan fungsional umum dan administrasi operasional', 3, 'cyan', true, '{}'),

  -- 9. Jenis Kelamin (L97)
  ('jenis_kelamin', 'L', 'Laki-Laki', 'Jenis kelamin laki-laki', 1, 'blue', true, '{}'),
  ('jenis_kelamin', 'P', 'Perempuan', 'Jenis kelamin perempuan', 2, 'rose', true, '{}'),

  -- 10. Status Kepegawaian (L98)
  ('status_kepegawaian', 'PNS', 'Pegawai Negeri Sipil (PNS)', 'Aparatur Sipil Negara berstatus Pegawai Negeri Sipil', 1, 'blue', true, '{}'),
  ('status_kepegawaian', 'PPPK', 'Pegawai Pemerintah dengan Perjanjian Kerja (PPPK)', 'Aparatur Sipil Negara berstatus perjanjian kerja', 2, 'teal', true, '{}'),

  -- 11. Jenis Usulan Kenaikan Pangkat (L159)
  ('jenis_usulan_pangkat', 'reguler', 'Kenaikan Pangkat Reguler', 'Kenaikan pangkat berkala 4 tahunan bagi pegawai non-jabatan', 1, 'blue', true, '{}'),
  ('jenis_usulan_pangkat', 'pilihan', 'Kenaikan Pangkat Pilihan', 'Kenaikan pangkat pilihan jabatan struktural / fungsional / prestasi', 2, 'indigo', true, '{}'),
  ('jenis_usulan_pangkat', 'kgb', 'Kenaikan Gaji Berkala (KGB)', 'Penyesuaian gaji berkala setiap 2 tahun sekali', 3, 'emerald', true, '{}'),

  -- 12. Jenis Mutasi (L188)
  ('jenis_mutasi', 'mutasi', 'Mutasi Antar Unit', 'Perpindahan tugas antar unit perangkat daerah setingkat', 1, 'blue', true, '{}'),
  ('jenis_mutasi', 'rotasi', 'Rotasi Jabatan', 'Penyegaran tugas dan posisi pada unit yang sama', 2, 'amber', true, '{}'),
  ('jenis_mutasi', 'promosi', 'Promosi Jabatan', 'Kenaikan jenjang jabatan atau tanggung jawab lebih tinggi', 3, 'emerald', true, '{}'),

  -- 13. Predikat Kinerja SKP (L231)
  ('predikat_skp', 'Sangat Baik', 'Sangat Baik', 'Capaian kinerja dan perilaku kerja melampaui ekspektasi tinggi', 1, 'emerald', true, '{"min_skor": 90}'),
  ('predikat_skp', 'Baik', 'Baik', 'Capaian kinerja dan perilaku kerja memenuhi ekspektasi pimpinan', 2, 'blue', true, '{"min_skor": 75}'),
  ('predikat_skp', 'Cukup', 'Cukup / Butuh Perbaikan', 'Capaian kinerja sebagian memenuhi ekspektasi pimpinan', 3, 'amber', true, '{"min_skor": 60}'),
  ('predikat_skp', 'Kurang', 'Kurang', 'Capaian kinerja di bawah ekspektasi standar minimum', 4, 'orange', true, '{"min_skor": 50}'),
  ('predikat_skp', 'Sangat Kurang', 'Sangat Kurang', 'Kinerja sangat jauh di bawah ekspektasi yang ditentukan', 5, 'rose', true, '{"min_skor": 0}'),

  -- 14. Aspek Target SKP (L239)
  ('aspek_skp', 'kuantitas', 'Kuantitas Hasil', 'Target keluaran dalam jumlah volume / berkas / kegiatan', 1, 'blue', true, '{}'),
  ('aspek_skp', 'kualitas', 'Kualitas Mutu', 'Target persentase kesesuaian mutu standar SOP', 2, 'emerald', true, '{}'),
  ('aspek_skp', 'waktu', 'Ketepatan Waktu', 'Target durasi atau tenggat penyelesaian tugas kerja', 3, 'amber', true, '{}'),
  ('aspek_skp', 'biaya', 'Efisiensi Biaya', 'Target efisiensi penyerapan anggaran / dana operasional', 4, 'violet', true, '{}'),

  -- 15. Jenis Cuti (L268)
  ('jenis_cuti', 'tahunan', 'Cuti Tahunan', 'Hak cuti tahunan pegawai ASN (default 12 hari kerja)', 1, 'blue', true, '{"default_hari": 12, "potong_kuota": true}'),
  ('jenis_cuti', 'besar', 'Cuti Besar', 'Cuti setelah masa pengabdian minimal 5 tahun terus-menerus', 2, 'indigo', true, '{"default_hari": 90, "potong_kuota": false}'),
  ('jenis_cuti', 'sakit', 'Cuti Sakit', 'Cuti karena sakit dengan rujukan tenaga medis resmi', 3, 'amber', true, '{"potong_kuota": false}'),
  ('jenis_cuti', 'melahirkan', 'Cuti Melahirkan', 'Cuti persalinan untuk kelahiran anak pertama s/d ketiga', 4, 'rose', true, '{"default_hari": 90, "potong_kuota": false}'),
  ('jenis_cuti', 'alasan_penting', 'Cuti Alasan Penting (CAP)', 'Cuti karena musibah keluarga inti atau keperluan mendesak', 5, 'orange', true, '{"default_hari": 30, "potong_kuota": false}'),
  ('jenis_cuti', 'di_luar_tanggungan', 'Cuti di Luar Tanggungan Negara (CLTN)', 'Cuti khusus di luar tanggungan negara', 6, 'slate', true, '{"potong_kuota": false}'),

  -- 16. Jenis Kompetensi (L312)
  ('jenis_kompetensi', 'Manajerial', 'Kompetensi Manajerial', 'Integritas, kepemimpinan, kerjasama, dan komunikasi publik', 1, 'indigo', true, '{}'),
  ('jenis_kompetensi', 'Sosio Kultural', 'Kompetensi Sosio Kultural', 'Perekat bangsa, kebhinekaan, dan empati sosial masyarakat', 2, 'teal', true, '{}'),
  ('jenis_kompetensi', 'Teknis', 'Kompetensi Teknis', 'Keahlian spesifik sesuai bidang tugas fungsional profesi', 3, 'blue', true, '{}'),

  -- 17. Status Hukuman Disiplin (L327)
  ('status_hukuman', 'aktif', 'Hukuman Masih Berjalan', 'Masa hukuman disiplin sedang aktif berlaku dan berdampak', 1, 'rose', true, '{}'),
  ('status_hukuman', 'berakhir', 'Hukuman Telah Berakhir', 'Masa hukuman disiplin telah tuntas dijalani pegawai', 2, 'emerald', true, '{}'),

  -- 18. Status Verifikasi Syarat Pensiun (L336)
  ('status_pensiun_checklist', 'belum', 'Belum Diunggah / Belum Ada', 'Berkas persyaratan belum diserahkan pemohon', 1, 'slate', true, '{}'),
  ('status_pensiun_checklist', 'proses', 'Dalam Pemeriksaan', 'Berkas sedang diperiksa validitasnya oleh verifikator', 2, 'amber', true, '{}'),
  ('status_pensiun_checklist', 'lengkap', 'Lengkap & Memenuhi Syarat', 'Berkas telah dinyatakan lengkap dan valid', 3, 'emerald', true, '{}'),

  -- 19. Kategori Dokumen Digital (L344)
  ('kategori_dokumen', 'SK CPNS/PNS', 'SK CPNS / PNS', 'Surat Keputusan Pengangkatan CPNS atau PNS', 1, 'blue', true, '{}'),
  ('kategori_dokumen', 'SK Pangkat', 'SK Pangkat Terakhir', 'Surat Keputusan Kenaikan Pangkat terakhir', 2, 'indigo', true, '{}'),
  ('kategori_dokumen', 'SK Jabatan', 'SK Pengangkatan Jabatan', 'Surat Keputusan Pengangkatan Jabatan struktural/fungsional', 3, 'violet', true, '{}'),
  ('kategori_dokumen', 'Ijazah', 'Ijazah & Transkrip Nilai', 'Dokumen ijazah formal yang telah diakui dinas', 4, 'teal', true, '{}'),
  ('kategori_dokumen', 'KTP', 'Identitas Kependudukan (KTP/KK)', 'Kartu Tanda Penduduk atau Kartu Keluarga pegawai', 5, 'cyan', true, '{}'),
  ('kategori_dokumen', 'Sertifikat', 'Sertifikat Pelatihan / Diklat', 'Sertifikat lulus diklat, workshop, atau uji kompetensi', 6, 'emerald', true, '{}'),
  ('kategori_dokumen', 'Surat Cuti', 'Surat Izin / Cuti Resmi', 'Surat keputusan izin cuti atau surat keterangan sakit', 7, 'amber', true, '{}'),
  ('kategori_dokumen', 'Lainnya', 'Dokumen Kedinasan Lainnya', 'Dokumen pendukung administrasi kepegawaian lainnya', 8, 'slate', true, '{}'),

  -- 20. Status Tanda Tangan Dokumen (L351)
  ('status_ttd_dokumen', 'belum', 'Belum Ditandatangani', 'Dokumen belum dibubuhi tanda tangan basah maupun digital', 1, 'slate', true, '{}'),
  ('status_ttd_dokumen', 'internal', 'Paraf / TTD Internal', 'Telah diparaf atau ditandatangani pejabat struktural internal', 2, 'amber', true, '{}'),
  ('status_ttd_dokumen', 'tte', 'Tanda Tangan Elektronik (TTE / BSrE)', 'Telah disahkan melalui TTE bersertifikasi resmi BSrE BSSN', 3, 'emerald', true, '{}'),

  -- 21. Kategori Notifikasi Sistem (L372)
  ('kategori_notifikasi', 'Kepangkatan', 'Layanan Kepangkatan', 'Pemberitahuan usulan, verifikasi, atau SK kenaikan pangkat', 1, 'indigo', true, '{"icon": "Award"}'),
  ('kategori_notifikasi', 'Cuti', 'Layanan Cuti', 'Pemberitahuan pengajuan, persetujuan, atau penolakan cuti', 2, 'blue', true, '{"icon": "Calendar"}'),
  ('kategori_notifikasi', 'Disiplin', 'Peringatan Disiplin', 'Pemberitahuan tindak lanjut atau putusan hukuman disiplin', 3, 'rose', true, '{"icon": "AlertTriangle"}'),
  ('kategori_notifikasi', 'Kinerja', 'Penilaian Kinerja (SKP)', 'Pengingat target sasaran, penetapan, atau penilaian SKP', 4, 'amber', true, '{"icon": "Target"}'),
  ('kategori_notifikasi', 'Pensiun', 'Layanan Pensiun', 'Peringatan dini BUP pensiun dan checklist verifikasi berkas', 5, 'teal', true, '{"icon": "HeartHandshake"}'),
  ('kategori_notifikasi', 'Sistem', 'Informasi Sistem & Pemeliharaan', 'Pemberitahuan umum aplikasi dan pembaruan sistem kepegawaian', 6, 'slate', true, '{"icon": "Settings"}')

on conflict (kategori, kode) do update set
  nama = excluded.nama,
  deskripsi = coalesce(nullif(excluded.deskripsi, ''), public.master_referensi.deskripsi),
  urutan = excluded.urutan,
  badge_color = excluded.badge_color,
  is_system = excluded.is_system,
  metadata = coalesce(excluded.metadata, public.master_referensi.metadata),
  updated_at = now();
