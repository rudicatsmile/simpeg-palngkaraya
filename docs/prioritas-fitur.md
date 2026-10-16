# Prioritas Fitur Andalan SIMPEG Daerah

Dokumen ini memuat identifikasi, pemetaan, dan urutan prioritas fitur andalan aplikasi **SIMPEG Daerah (Sistem Informasi Manajemen Kepegawaian Pemerintah Daerah)**, mulai dari fitur paling penting (*mission-critical*) hingga fitur pelengkap (*nice-to-have*).

---

## 1. Kerangka Kriteria Prioritas

| Kategori | Tingkat Kepentingan | Karakteristik Utama |
| :--- | :--- | :--- |
| **Kategori I: Inti / Wajib Ada** | **Sangat Tinggi** | Fitur fondasi manajemen ASN. Sistem tidak dapat beroperasi atau kehilangan fungsi pokoknya jika fitur ini tidak tersedia. |
| **Kategori II: Pendukung Utama** | **Tinggi / Sedang** | Fitur operasional yang sering digunakan sehari-hari atau memiliki dampak langsung terhadap kedisiplinan, karier, dan efisiensi birokrasi. |
| **Kategori III: Pelengkap** | **Sedang / Rendah** | Fitur penambah nilai (*value-add*), visualisasi makro, pelengkap identitas, atau kebutuhan audit berkala (*nice-to-have*). |

---

## 2. Daftar & Urutan Prioritas Fitur

### Kategori I: Paling Penting (Inti / Wajib Ada — Mission Critical)

#### 1. Manajemen Data Induk Pegawai (Master Data ASN)
- **Tingkat Kepentingan:** Sangat Tinggi
- **Status:** Wajib Ada (Fondasi Sistem)
- **Deskripsi:** Pangkalan data terpusat dan sumber kebenaran tunggal (*single source of truth*) yang mencakup profil identitas, NIP, pangkat/golongan, jabatan, unit kerja/Perangkat Daerah, riwayat pendidikan, keluarga, dan status kepegawaian (PNS/PPPK).
- **Alasan Prioritas:** Seluruh modul operasional, perhitungan kenaikan pangkat, mutasi, hingga hak pensiun bergantung 100% pada keabsahan data induk ini.

#### 2. Mesin Prediksi & Pengusulan Kenaikan Pangkat Otomatis
- **Tingkat Kepentingan:** Sangat Tinggi
- **Status:** Wajib Ada (Fitur Pembeda Utama)
- **Deskripsi:** Mesin kalkulasi otomatis masa kerja golongan dan angka kredit sesuai regulasi BKN & PP Manajemen PNS. Dilengkapi daftar otomatis pegawai eligible naik pangkat per periode (April & Oktober), checklist syarat berkas, serta validasi kelayakan otomatis.
- **Alasan Prioritas:** Kenaikan pangkat merupakan hak karier paling vital bagi ASN. Otomasi sistem mengeliminasi keterlambatan usulan manual dan memangkas berkas fisik.

#### 3. Layanan Mandiri Cuti & Persetujuan Berjenjang (Self-Service Cuti)
- **Tingkat Kepentingan:** Sangat Tinggi
- **Status:** Wajib Ada (Fitur Teraktif)
- **Deskripsi:** Portal pengajuan cuti mandiri (cuti tahunan, besar, sakit, melahirkan, alasan penting) dengan kalkulasi sisa cuti *real-time*, validasi tanggal libur nasional, dan alur persetujuan digital berjenjang (*Atasan Langsung* $\rightarrow$ *Kepala Perangkat Daerah*).
- **Alasan Prioritas:** Merupakan layanan administratif harian dengan frekuensi interaksi tertinggi di antara seluruh pegawai dan pimpinan unit kerja.

#### 4. Autentikasi, Manajemen Pengguna & RBAC (Role-Based Access Control)
- **Tingkat Kepentingan:** Sangat Tinggi
- **Status:** Wajib Ada (Keamanan & Kepatuhan Regulasi)
- **Deskripsi:** Sistem pembatasan hak akses berjenjang berbasis peran untuk 7 jenis pengguna: *Super Admin, Operator PD, Atasan Langsung, Kepala PD, Pegawai ASN, Eksekutif, dan Auditor*, didukung verifikasi email instansi dan proteksi data sensitif.
- **Alasan Prioritas:** Menjamin integritas data, mencegah penyalahgunaan wewenang, dan memenuhi standar kepatuhan UU Pelindungan Data Pribadi (PDP).

---

### Kategori II: Penting (Pendukung Utama & Operasional Rutin)

#### 5. Notifikasi Proaktif & Early Warning System (H-180 s.d. H-30)
- **Tingkat Kepentingan:** Tinggi
- **Status:** Prioritas Tinggi (Nilai Tambah Strategis)
- **Deskripsi:** Sistem peringatan dini terjadwal yang mengirimkan notifikasi multi-kanal (WhatsApp Gateway, Email Resmi, dan In-App Notification) pada periode H-180, H-90, H-30, serta status overdue sebelum batas tenggat kenaikan pangkat, masa persiapan pensiun, dan Kenaikan Gaji Berkala (KGB).
- **Alasan Prioritas:** Mengubah paradigma manajemen kepegawaian dari pasif-reaktif menjadi proaktif-prediktif, meminimalkan kelalaian administratif pegawai maupun pengelola kepegawaian.

#### 6. Pengelolaan Pensiun & Purna Tugas (Countdown & Checklist BUP)
- **Tingkat Kepentingan:** Tinggi
- **Status:** Prioritas Tinggi
- **Deskripsi:** Perhitungan otomatis Batas Usia Pensiun (BUP) berdasarkan jabatan, hitung mundur masa purna tugas, dan penyusunan checklist dokumen usulan pensiun ke BKN/Taspen.
- **Alasan Prioritas:** Memastikan kepastian terbitnya SK Pensiun tepat waktu sehingga hak pensiun dan tunjangan hari tua ASN tersalurkan tanpa jeda pembayaran gaji.

#### 7. Manajemen & Integrasi Presensi Kehadiran
- **Tingkat Kepentingan:** Tinggi
- **Status:** Prioritas Tinggi
- **Deskripsi:** Rekapitulasi kehadiran harian/bulanan, rekap keterlambatan, pulang cepat, dan ketidakhadiran dengan integrasi endpoint API perangkat fingerprint/mobile.
- **Alasan Prioritas:** Data absensi berkorelasi langsung dengan penegakan disiplin kerja dan menjadi komponen dasar perhitungan Tunjangan Penghasilan Pegawai (TPP).

#### 8. Manajemen Jabatan, Formasi & Usulan Mutasi/Rotasi
- **Tingkat Kepentingan:** Tinggi
- **Status:** Prioritas Tinggi
- **Deskripsi:** Pengelolaan formasi jabatan struktural/fungsional/pelaksana, pengajuan usulan mutasi antar-PD atau rotasi internal, serta pelacakan riwayat perpindahan tugas.
- **Alasan Prioritas:** Dibutuhkan BKPSDM untuk penataan dan pemerataan distribusi sumber daya manusia aparatur di lingkungan pemerintah daerah.

#### 9. Penilaian Kinerja ASN (Sasaran Kinerja Pegawai / SKP)
- **Tingkat Kepentingan:** Tinggi
- **Status:** Prioritas Tinggi
- **Deskripsi:** Penetapan target kinerja tahunan/periodik, pemantauan realisasi capaian, formulir evaluasi berkala oleh atasan langsung, dan konversi predikat kinerja.
- **Alasan Prioritas:** Nilai SKP minimal bernilai 'Baik' merupakan syarat mutlak dalam proses kenaikan pangkat, promosi jabatan, dan pemberian penghargaan ASN.

#### 10. Manajemen Dokumen Digital Kepegawaian (Digital DMS)
- **Tingkat Kepentingan:** Sedang
- **Status:** Prioritas Sedang
- **Deskripsi:** Repositori arsip digital terpusat untuk SK, ijazah, sertifikat diklat, dan transkrip dengan riwayat versi (*versioning*) dan validasi status internal.
- **Alasan Prioritas:** Mendukung gerakan kantor tanpa kertas (*paperless office*) dan mempermudah verifikasi keabsahan dokumen usulan secara daring.

#### 11. Pencatatan Hukuman Disiplin & Kepatuhan
- **Tingkat Kepentingan:** Sedang
- **Status:** Prioritas Sedang
- **Deskripsi:** Pencatatan jenis hukuman disiplin (ringan, sedang, berat) berdasarkan PP No. 94/2021, masa berlaku sanksi, dan otomatisasi pembatasan (*blocking rule*) terhadap promosi dan kenaikan pangkat.
- **Alasan Prioritas:** Menjamin kepatuhan hukum dan menegakkan asas keadilan dalam pembinaan disiplin ASN.

---

### Kategori III: Kurang Penting (Pelengkap / Nilai Tambah / Nice-to-Have)

#### 12. Dashboard Eksekutif & Analisis Beban Formasi (Pimpinan Daerah)
- **Tingkat Kepentingan:** Sedang
- **Status:** Pelengkap Strategis
- **Deskripsi:** Visualisasi grafik makro demografi ASN, rasio jabatan, tren pensiun lima tahun ke depan, dan analisis belanja pegawai bagi Bupati/Walikota/Sekda.
- **Alasan Prioritas:** Sangat berguna bagi pimpinan daerah dalam mengambil kebijakan makro SDM, namun ketiadaannya tidak mengganggu operasional harian administrasi kepegawaian.

#### 13. Pengelolaan Diklat & Analisis Kesenjangan Kompetensi (Gap Analysis)
- **Tingkat Kepentingan:** Sedang
- **Status:** Pelengkap Operasional
- **Deskripsi:** Riwayat keikutsertaan pelatihan/diklat kepemimpinan/fungsional/teknis serta analisis kesenjangan kompetensi pegawai terhadap standar kompetensi jabatan.
- **Alasan Prioritas:** Berperan dalam pengembangan kapasitas jangka menengah, namun bersifat pendukung setelah urusan pokok kepangkatan dan mutasi tertata.

#### 14. Talent Pool & Pemetaan 9-Box Grid Suksesi
- **Tingkat Kepentingan:** Rendah
- **Status:** Nice-to-Have
- **Deskripsi:** Matriks penilaian potensi dan kinerja ASN ke dalam model 9-Box Grid untuk identifikasi suksesi kepemimpinan dan promosi talenta unggul.
- **Alasan Prioritas:** Merupakan penerapan sistem merit tingkat lanjut (*advanced merit system*); belum mendesak jika kebutuhan dasar administrasi baru distandarisasi.

#### 15. Kartu Identitas Digital ASN & Halaman Verifikasi QR Code Publik
- **Tingkat Kepentingan:** Rendah
- **Status:** Nice-to-Have
- **Deskripsi:** Kartu tanda pengenal ASN digital berformat responsif dengan QR Code unik yang dapat dipindai oleh publik melalui URL `/verifikasi/[token]` untuk mengecek keaslian status pegawai secara aman tanpa membuka data rahasia.
- **Alasan Prioritas:** Fitur modernisasi identitas yang memberikan kemudahan estetis dan validasi cepat, namun operasional kepegawaian tetap sah melalui SK resmi fisik/digital.

#### 16. Audit Trail & Log Forensik Aktivitas (Inspektorat)
- **Tingkat Kepentingan:** Rendah
- **Status:** Nice-to-Have (Kebutuhan Pengawasan)
- **Deskripsi:** Rekaman kronologis perubahan data (*before & after*), identitas aktor, IP address, waktu, serta log riwayat autentikasi untuk keperluan audit kepatuhan.
- **Alasan Prioritas:** Bersifat pasif dan hanya dibuka saat ada pemeriksaan berkala oleh aparat pemeriksa internal pemerintah (APIP/Inspektorat/BPK).

#### 17. Pengaturan Branding Dinamis Portal Pemda (Logo, Nama Pemda, Tema)
- **Tingkat Kepentingan:** Rendah
- **Status:** Nice-to-Have (Kustomisasi Sistem)
- **Deskripsi:** Konfigurasi visual terpusat dari tabel `app_settings` untuk logo daerah, nama pemda, nama aplikasi, alamat sekretariat, kontak resmi, dan teks hak cipta (*copyright*).
- **Alasan Prioritas:** Memudahkan portabilitas dan *rebranding* sistem saat diadopsi oleh pemerintah daerah lain tanpa perlu mengubah kode sumber aplikasi.

---

## 3. Matriks Ringkasan Prioritas

| No | Nama Fitur | Kategori Prioritas | Tingkat Kepentingan | Pengguna Utama |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Manajemen Data Induk Pegawai | Inti / Wajib | **Sangat Tinggi** | Admin, Operator, Seluruh ASN |
| 2 | Prediksi & Kenaikan Pangkat Otomatis | Inti / Wajib | **Sangat Tinggi** | Admin, Pegawai, Atasan |
| 3 | Self-Service Cuti & Approval Berjenjang | Inti / Wajib | **Sangat Tinggi** | Seluruh ASN, Atasan, Kepala PD |
| 4 | Autentikasi & RBAC (7 Level Peran) | Inti / Wajib | **Sangat Tinggi** | Seluruh Pengguna Sistem |
| 5 | Early Warning System (H-180 s.d. H-30) | Pendukung Utama | **Tinggi** | Seluruh ASN, Operator |
| 6 | Manajemen Pensiun & Hitung Mundur BUP | Pendukung Utama | **Tinggi** | Pegawai Jelang BUP, Admin |
| 7 | Manajemen Presensi & Kehadiran | Pendukung Utama | **Tinggi** | Pegawai, Operator, Atasan |
| 8 | Manajemen Jabatan, Formasi & Mutasi | Pendukung Utama | **Tinggi** | Admin, Kepala PD, Pegawai |
| 9 | Penilaian Kinerja (SKP) | Pendukung Utama | **Tinggi** | Pegawai, Atasan Langsung |
| 10 | Manajemen Dokumen Digital (DMS) | Pendukung Utama | **Sedang** | Pegawai, Operator |
| 11 | Pencatatan Hukuman Disiplin | Pendukung Utama | **Sedang** | Admin, Inspektorat |
| 12 | Dashboard Eksekutif & Beban Formasi | Pelengkap | **Sedang** | Pimpinan Daerah (Bupati/Sekda) |
| 13 | Diklat & Analisis Gap Kompetensi | Pelengkap | **Sedang** | Pegawai, Operator Diklat |
| 14 | Talent Pool & 9-Box Grid Suksesi | Pelengkap | **Rendah** | Pimpinan Tinggi, BKPSDM |
| 15 | Kartu ASN Digital & QR Code Publik | Pelengkap | **Rendah** | Seluruh ASN, Publik Umum |
| 16 | Audit Trail & Log Forensik | Pelengkap | **Rendah** | Auditor, Inspektorat |
| 17 | Pengaturan Branding Dinamis Pemda | Pelengkap | **Rendah** | Super Administrator |
