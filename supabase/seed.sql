-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Seed Data: supabase/seed.sql
-- Kepatuhan: Bab 9 PRD (Data Dummy Bahasa Indonesia Realistis Pemda)
-- Seluruh UUID menggunakan heksadesimal valid RFC 4122 (0-9, a-f)
-- ==============================================================================

-- 1. PERANGKAT DAERAH
insert into public.perangkat_daerah (id, kode, nama, created_at) values
  ('d1a1b1c1-0001-4000-8000-000000000001', 'PD-01', 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)', now()),
  ('d1a1b1c1-0002-4000-8000-000000000002', 'PD-02', 'Dinas Pendidikan dan Kebudayaan', now()),
  ('d1a1b1c1-0003-4000-8000-000000000003', 'PD-03', 'Dinas Kesehatan', now()),
  ('d1a1b1c1-0004-4000-8000-000000000004', 'PD-04', 'Dinas Pekerjaan Umum dan Penataan Ruang', now()),
  ('d1a1b1c1-0005-4000-8000-000000000005', 'PD-05', 'Badan Perencanaan Pembangunan Daerah (Bappeda)', now()),
  ('d1a1b1c1-0006-4000-8000-000000000006', 'PD-06', 'Inspektorat Daerah', now()),
  ('d1a1b1c1-0007-4000-8000-000000000007', 'PD-07', 'Sekretariat Daerah', now())
on conflict (id) do nothing;

-- 2. JABATAN
insert into public.jabatan (id, kode, nama, jenis, eselon, pd_id, created_at) values
  ('a1a1b1c1-0001-4000-8000-000000000001', 'JAB-01', 'Kepala BKPSDM', 'struktural', 'Eselon II.b', 'd1a1b1c1-0001-4000-8000-000000000001', now()),
  ('a1a1b1c1-0002-4000-8000-000000000002', 'JAB-02', 'Kepala Bidang Mutasi dan Kepangkatan', 'struktural', 'Eselon III.a', 'd1a1b1c1-0001-4000-8000-000000000001', now()),
  ('a1a1b1c1-0003-4000-8000-000000000003', 'JAB-03', 'Kepala Dinas Pendidikan', 'struktural', 'Eselon II.b', 'd1a1b1c1-0002-4000-8000-000000000002', now()),
  ('a1a1b1c1-0004-4000-8000-000000000004', 'JAB-04', 'Kepala Seksi Pembinaan SMP', 'struktural', 'Eselon IV.a', 'd1a1b1c1-0002-4000-8000-000000000002', now()),
  ('a1a1b1c1-0005-4000-8000-000000000005', 'JAB-05', 'Analis SDM Aparatur Ahli Muda', 'fungsional', null, 'd1a1b1c1-0001-4000-8000-000000000001', now()),
  ('a1a1b1c1-0006-4000-8000-000000000006', 'JAB-06', 'Guru Matematika Ahli Pertama', 'fungsional', null, 'd1a1b1c1-0002-4000-8000-000000000002', now()),
  ('a1a1b1c1-0007-4000-8000-000000000007', 'JAB-07', 'Perawat Ahli Pertama', 'fungsional', null, 'd1a1b1c1-0003-4000-8000-000000000003', now()),
  ('a1a1b1c1-0008-4000-8000-000000000008', 'JAB-08', 'Pengadministrasi Perkantoran', 'pelaksana', null, 'd1a1b1c1-0003-4000-8000-000000000003', now())
on conflict (id) do nothing;

-- 3. ATURAN KEPANGKATAN
insert into public.aturan_kepangkatan (id, golongan_dari, golongan_ke, masa_tahun, masa_bulan, berlaku_mulai, checklist) values
  ('c1a1b1c1-0001-4000-8000-000000000001', 'III/a', 'III/b', 4, 0, '2020-01-01', '["SK Pangkat Terakhir", "Penilaian Kinerja (SKP) 2 Tahun Terakhir minimal Baik", "Bebas Hukuman Disiplin Tingkat Sedang/Berat"]'::jsonb),
  ('c1a1b1c1-0002-4000-8000-000000000002', 'III/b', 'III/c', 4, 0, '2020-01-01', '["SK Pangkat Terakhir", "Penilaian Kinerja (SKP) 2 Tahun Terakhir minimal Baik", "Sertifikat Uji Kompetensi / Diklat Fungsional", "Bebas Hukuman Disiplin"]'::jsonb),
  ('c1a1b1c1-0003-4000-8000-000000000003', 'III/c', 'III/d', 4, 0, '2020-01-01', '["SK Pangkat Terakhir", "Penilaian Kinerja (SKP) 2 Tahun Terakhir minimal Baik", "Sertifikat Diklat Struktural Terkait", "Surat Keterangan Bebas Temuan Inspektorat"]'::jsonb)
on conflict (id) do nothing;

-- 4. PEGAWAI (Dataset Realistis Pemkab Nusantara Jaya)
insert into public.pegawai (
  id, nip, nama_lengkap, gelar_depan, gelar_belakang,
  status_kepegawaian, golongan, pangkat,
  tempat_lahir, tanggal_lahir, jenis_kelamin,
  alamat, no_hp, email,
  pd_id, jabatan_id, status,
  tanggal_pensiun, created_at
) values
  (
    'e1a1b1c1-0001-4000-8000-000000000001',
    '197805122002121003', 'Budi Santoso', 'Dr.', 'M.Si.',
    'PNS', 'IV/a', 'Pembina',
    'Nusantara Jaya', '1978-05-12', 'L',
    'Jl. Merdeka No. 45, Nusantara Jaya', '081234567890', 'budi.santoso@nusantarajaya.go.id',
    'd1a1b1c1-0001-4000-8000-000000000001', 'a1a1b1c1-0002-4000-8000-000000000002', 'aktif',
    '2038-05-31', now()
  ),
  (
    'e1a1b1c1-0002-4000-8000-000000000002',
    '198503152009032008', 'Siti Rahmawati', null, 'S.Sos.',
    'PNS', 'III/c', 'Penata',
    'Surabaya', '1985-03-15', 'P',
    'Jl. Pahlawan No. 12, Nusantara Jaya', '081398765432', 'siti.rahmawati@nusantarajaya.go.id',
    'd1a1b1c1-0002-4000-8000-000000000002', 'a1a1b1c1-0005-4000-8000-000000000005', 'aktif',
    '2045-03-31', now()
  ),
  (
    'e1a1b1c1-0003-4000-8000-000000000003',
    '197108201995121001', 'Hendro Wibowo', 'Drs.', 'M.Pd.',
    'PNS', 'IV/c', 'Pembina Utama Muda',
    'Semarang', '1971-08-20', 'L',
    'Jl. Diponegoro No. 88, Nusantara Jaya', '081277665544', 'hendro.wibowo@nusantarajaya.go.id',
    'd1a1b1c1-0002-4000-8000-000000000002', 'a1a1b1c1-0003-4000-8000-000000000003', 'aktif',
    '2031-08-31', now()
  ),
  (
    'e1a1b1c1-0004-4000-8000-000000000004',
    '198204102005011004', 'Ahmad Dahlan', null, 'S.T., M.Kom.',
    'PNS', 'IV/a', 'Pembina',
    'Bandung', '1982-04-10', 'L',
    'Jl. Cendrawasih No. 23, Nusantara Jaya', '081988776655', 'ahmad.dahlan@nusantarajaya.go.id',
    'd1a1b1c1-0002-4000-8000-000000000002', 'a1a1b1c1-0004-4000-8000-000000000004', 'aktif',
    '2042-04-30', now()
  ),
  (
    'e1a1b1c1-0005-4000-8000-000000000005',
    '196611051991031002', 'Joko Purnomo', 'H.', 'S.IP.',
    'PNS', 'III/a', 'Penata Muda',
    'Yogyakarta', '1966-11-05', 'L',
    'Jl. Brawijaya No. 17, Nusantara Jaya', '081322114433', 'joko.purnomo@nusantarajaya.go.id',
    'd1a1b1c1-0003-4000-8000-000000000003', 'a1a1b1c1-0008-4000-8000-000000000008', 'aktif',
    '2026-11-30', now()
  ),
  (
    'e1a1b1c1-0006-4000-8000-000000000006',
    '199402282019032007', 'Dewi Lestari', null, 'S.E.',
    'PNS', 'III/b', 'Penata Muda Tingkat I',
    'Malang', '1994-02-28', 'P',
    'Jl. Kenanga No. 5, Nusantara Jaya', '081233445566', 'dewi.lestari@nusantarajaya.go.id',
    'd1a1b1c1-0003-4000-8000-000000000003', 'a1a1b1c1-0007-4000-8000-000000000007', 'aktif',
    '2054-02-28', now()
  )
on conflict (id) do nothing;

-- 5. RELASI ATASAN
update public.pegawai set atasan_id = 'e1a1b1c1-0004-4000-8000-000000000004' where id = 'e1a1b1c1-0002-4000-8000-000000000002';
update public.pegawai set atasan_id = 'e1a1b1c1-0003-4000-8000-000000000003' where id = 'e1a1b1c1-0004-4000-8000-000000000004';

-- 6. SALDO CUTI
insert into public.saldo_cuti (pegawai_id, tahun, jatah, terpakai) values
  ('e1a1b1c1-0001-4000-8000-000000000001', 2026, 12, 3),
  ('e1a1b1c1-0002-4000-8000-000000000002', 2026, 12, 5),
  ('e1a1b1c1-0003-4000-8000-000000000003', 2026, 12, 2),
  ('e1a1b1c1-0004-4000-8000-000000000004', 2026, 12, 4),
  ('e1a1b1c1-0005-4000-8000-000000000005', 2026, 12, 8),
  ('e1a1b1c1-0006-4000-8000-000000000006', 2026, 12, 1)
on conflict do nothing;

-- 7. FORMASI
insert into public.formasi (id, pd_id, jabatan_id, tahun, kebutuhan, tersedia) values
  ('f1a1b1c1-0001-4000-8000-000000000001', 'd1a1b1c1-0003-4000-8000-000000000003', 'a1a1b1c1-0007-4000-8000-000000000007', 2026, 12, 7),
  ('f1a1b1c1-0002-4000-8000-000000000002', 'd1a1b1c1-0002-4000-8000-000000000002', 'a1a1b1c1-0006-4000-8000-000000000006', 2026, 20, 16),
  ('f1a1b1c1-0003-4000-8000-000000000003', 'd1a1b1c1-0001-4000-8000-000000000001', 'a1a1b1c1-0005-4000-8000-000000000005', 2026, 5, 4)
on conflict do nothing;

-- 8. DIKLAT & KOMPETENSI
insert into public.diklat (id, nama, jenis, penyelenggara, jam_pelajaran, kompetensi_terkait) values
  ('b1a1b1c1-0001-4000-8000-000000000001', 'Pelatihan Kepemimpinan Administrator (PKA)', 'Struktural', 'BPSDM Provinsi Jawa Timur', 908, '["Manajemen Strategis", "Kepemimpinan Pelayanan"]'::jsonb),
  ('b1a1b1c1-0002-4000-8000-000000000002', 'Bimtek Manajemen Talenta Berbasis Merit System', 'Teknis', 'Pusbangkom ASN BKN', 32, '["Manajemen Talenta", "Analisis Beban Kerja"]'::jsonb)
on conflict do nothing;
