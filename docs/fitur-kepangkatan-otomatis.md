# Panduan Lengkap: Fitur Prediksi & Pengusulan Kenaikan Pangkat Otomatis

Dokumen ini memuat dokumentasi komprehensif mengenai arsitektur, landasan regulasi, mekanisme kerja, panduan operasional per peran, serta implementasi teknis fitur **Prediksi & Pengusulan Kenaikan Pangkat Otomatis** pada platform **SIMPEG Daerah (Sistem Informasi Manajemen Kepegawaian Pemerintah Daerah)**.

---

## 1. Ringkasan & Tujuan Fitur

### A. Latar Belakang Masalah
Dalam tata kelola kepegawaian konvensional, proses kenaikan pangkat (KP) ASN sering kali mengalami kendala:
- **Pendekatan Pasif-Reaktif:** Pengusulan baru dimulai saat pegawai berinisiatif mengajukan secara manual ke BKPSDM.
- **Keterlambatan Penerbitan SK:** Menghitung masa kerja golongan ribuan pegawai secara manual rentan kelalaian, mengakibatkan TMT kenaikan pangkat terlampaui (*overdue*).
- **Tumpukan Berkas Fisik:** Pegawai harus mengumpulkan kembali fotokopi berkas legalisir (SK terakhir, ijazah, SKP) yang sebenarnya sudah ada di arsip daerah.

### B. Definisi & Nilai Solusi
**Prediksi & Pengusulan Kenaikan Pangkat Otomatis** adalah modul cerdas di SIMPEG Daerah yang secara proaktif dan terjadwal menghitung masa kerja golongan seluruh ASN, memverifikasi syarat administratif dari pangkalan data, mengirimkan peringatan dini bertingkat (*early warning*), dan membentuk draf usulan nominatif secara otomatis (*paperless*).

---

## 2. Landasan Hukum & Sumber Regulasi

Fitur ini dirancang dengan mematuhi hierarki peraturan perundang-undangan Republik Indonesia dan standar meritokrasi Badan Kepegawaian Negara (BKN):

| No | Peraturan / Landasan Hukum | Muatan Regulasi yang Diadopsi Sistem |
| :---: | :--- | :--- |
| 1 | **PP No. 11/2017 *jo.* PP No. 17/2020** (Manajemen PNS) | **Masa Kerja Minimal:** PNS wajib memenuhi masa kerja sekurang-kurangnya 4 (empat) tahun dalam pangkat terakhir untuk kenaikan reguler.<br>**Syarat Kinerja:** Penilaian prestasi kerja (SKP) sekurang-kurangnya bernilai *Baik* dalam 2 (dua) tahun berturut-turut. |
| 2 | **Keputusan Kepala BKN No. 12/2002** (Ketentuan Pelaksanaan KP PNS) | **Perhitungan Periode TMT:** Standar penetapan Terhitung Mulai Tanggal periode reguler yaitu **1 April** dan **1 Oktober**.<br>**Kelengkapan Berkas:** Standarisasi checklist syarat berkas portofolio pegawai. |
| 3 | **Peraturan BKN No. 4/2023** (Periodisasi Kenaikan Pangkat PNS) | **Fleksibilitas Periodisasi:** Memberikan dukungan pada arsitektur sistem untuk menyesuaikan periodisasi penetapan pangkat secara dinamis. |
| 4 | **PP No. 94/2021** (Disiplin Pegawai Negeri Sipil) | **Aturan Pembatasan (*Guardrail*):** ASN yang sedang menjalani sanksi hukuman disiplin tingkat sedang atau berat secara otomatis diblokir (*auto-blocked*) dari usulan kenaikan pangkat hingga sanksi berakhir. |
| 5 | **PermenPAN-RB No. 6/2022** (Pengelolaan Kinerja ASN) | **Konversi Nilai SKP:** Integrasi capaian kinerja berkala pegawai sebagai syarat mutlak usulan pangkat. |

---

## 3. Cara Kerja & Mekanisme Sistem

```
[Database Pegawai] ──▶ [Mesin Kalkulasi Otomatis] ──▶ [Penyaringan Disiplin & SKP]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [Notifikasi Bertingkat]        [Daftar Nominatif Digital]
       (H-180, H-90, H-30, Overdue)   (Verifikasi Operator BKPSDM)
```

### A. Perhitungan Otomatis Jadwal Kenaikan Pangkat
1. Sistem membaca tanggal **TMT Golongan Terakhir** pegawai dari tabel `pegawai`.
2. Mengacu pada tabel konfigurasi `aturan_kepangkatan`, sistem menambahkan rentang masa kerja (standar 4 tahun).
3. Tanggal target disinkronkan ke periode resmi BKN terdekat (1 April atau 1 Oktober).
4. Job terjadwal (*scheduled cron job*) berjalan setiap hari pukul 02.00 WIB untuk memperbarui sisa hari hitung mundur (*countdown*) seluruh pegawai.

### B. Penyaringan Kelayakan Otomatis (*Auto-Filter & Guardrail*)
Sebelum memasukkan pegawai ke dalam daftar nominatif, sistem menjalankan validasi otomatis:
- **Validasi SKP:** Memeriksa apakah nilai predikat kinerja 2 tahun terakhir berstatus minimal *"Baik"*.
- **Pengecekan Disiplin:** Memeriksa tabel `hukuman_disiplin`. Jika ada sanksi aktif tingkat sedang atau berat, status usulan otomatis ditandai **"Tertunda"** dengan penjelasan pasal terkait.

### C. Sistem Peringatan Dini Multi-Kanal (*Early Warning System*)
Sistem mengirimkan notifikasi multi-kanal (WhatsApp Gateway, Email Resmi, dan In-App Notification):
- **H-180 (6 Bulan Sebelum TMT):** Notifikasi persiapan awal bagi pegawai untuk memeriksa profil dan berkas.
- **H-90 (3 Bulan Sebelum TMT):** Pemberitahuan bahwa draf usulan masuk antrean verifikasi operator.
- **H-30 (1 Bulan Sebelum TMT):** Batas akhir penutupan kelengkapan berkas usulan ke BKN.
- **Overdue:** Peringatan status merah bagi Administrator dan Pimpinan apabila ada pegawai yang melewati TMT tanpa proses usulan.

### D. Pembentukan Usulan Semi-Otomatis
Pegawai yang memenuhi syarat langsung masuk ke tabel `usulan_kenaikan_pangkat` dengan status draf/verifikasi. Dokumen digital yang tersimpan di sistem (SK lama, ijazah, sertifikat) secara otomatis dipetakan ke dalam checklist digital tanpa perlu unggah ulang berkas yang sama.

---

## 4. Panduan Operasional Berdasarkan Peran Pengguna (Role)

### A. Pegawai ASN (Self-Service)
1. **Akses Menu:** Masuk ke portal mandiri melalui menu **Kepangkatan Saya** (`/pegawai/kepangkatan`).
2. **Monitoring Countdown:** Melihat kartu informasi pangkat saat ini, pangkat tujuan, estimasi periode TMT, dan sisa hari hitung mundur.
3. **Cek Checklist Berkas:** Memeriksa item syarat yang telah terpenuhi (centang hijau).
4. **Unggah Kekurangan Dokumen:** Jika ada dokumen pendukung baru (misal: ijazah pendidikan lanjutan atau sertifikat diklat), pegawai dapat mengunggahnya langsung dari halaman tersebut.
5. **Menerima Update:** Menerima notifikasi berkala di WhatsApp/Email mengenai setiap progres verifikasi berkas.

### B. Atasan Langsung (Pejabat Penilai)
1. **Akses Menu:** Membuka **Dasbor Atasan** (`/atasan/dashboard`).
2. **Monitoring Bawahan:** Memeriksa daftar bawahan yang masuk dalam radar kenaikan pangkat pada semester berjalan.
3. **Finalisasi SKP:** Memastikan penilaian kinerja tahunan bawahan telah difinalisasi agar tidak menghambat sistem validasi kenaikan pangkat.
4. **Pemberian Rekomendasi:** Memberikan persetujuan awal secara digital atas kelayakan integritas dan kinerja bawahan.

### C. Operator Kepegawaian / Admin BKPSDM
1. **Akses Menu:** Membuka menu **Manajemen Kepangkatan** (`/admin/kepangkatan`).
2. **Review Daftar Nominatif:** Meninjau daftar pegawai yang telah disaring otomatis oleh sistem per periode.
3. **Verifikasi Checklist:** Membuka halaman detail pegawai (`/admin/kepangkatan/[id]`) untuk memvalidasi checklist dokumen secara digital (*one-click verification*).
4. **Penetapan Usulan:** Menyetujui usulan dan meneruskannya ke BKN atau menyiapkan penetapan SK.
5. **Konfigurasi Aturan Fleksibel:** Mengakses menu **Aturan Masa Kerja** (`/admin/kepangkatan/aturan`) jika ada perubahan kebijakan nasional untuk mengubah masa kerja tahun/bulan tanpa perlu mengubah kode program.

### D. Pimpinan Tinggi / Pejabat yang Berwenang (Bupati / Sekda / Kepala PD)
1. **Akses Menu:** Membuka **Dasbor Eksekutif** (`/eksekutif/dashboard`) dan **Early Warning Kepangkatan** (`/eksekutif/early-warning`).
2. **Pengawasan Makro:** Memantau agregat pegawai yang akan naik pangkat per unit kerja/Perangkat Daerah.
3. **Mitigasi Keterlambatan:** Memantau indikator peringatan merah (usulan yang mandek/overdue) untuk menginstruksikan percepatan kepada jajaran BKPSDM.
4. **Otorisasi Akhir:** Mengesahkan penerbitan SK Kenaikan Pangkat definitif.

---

## 5. Matriks Output yang Dihasilkan

| Peran Pengguna | Output / Hasil yang Diterima |
| :--- | :--- |
| **Pegawai ASN** | Transparansi jadwal karier, pengingat otomatis berkala, dan jaminan penerbitan SK tepat waktu tanpa pungutan maupun hambatan birokrasi manual. |
| **Atasan Langsung** | Visibilitas riwayat karier bawahan dan pengingat penyelesaian kewajiban evaluasi kinerja aparatur. |
| **Admin BKPSDM** | Daftar nominatif siap proses yang bebas dari kesalahan hitung manual, proses verifikasi dokumen digital yang cepat, dan pencatatan audit log yang transparan. |
| **Pimpinan Daerah** | Indeks profesionalitas ASN meningkat, penerapan sistem merit yang terukur, serta terwujudnya target *zero-delay* kenaikan pangkat di lingkungan pemerintah daerah. |

---

## 6. Referensi Implementasi Teknis di Codebase

Untuk kebutuhan pemeliharaan dan pengembangan lanjutan, berikut adalah komponen kode utama yang menyusun fitur ini:

1. **Mesin Kalkulasi Algoritma:**
   - [`src/lib/kepangkatan-engine.ts`](file:///d:/project/mobile/e-simpeg/src/lib/kepangkatan-engine.ts)
   - Fungsi utama: `hitungPrediksiKenaikanPangkat(tmtGolonganTerakhir, hukumanDisiplinAktif)`
2. **Skema Database & Migrasi (Supabase PostgreSQL):**
   - [`supabase/migrations/20261012000001_initial_schema.sql`](file:///d:/project/mobile/e-simpeg/supabase/migrations/20261012000001_initial_schema.sql)
   - Tabel: `aturan_kepangkatan`, `usulan_kenaikan_pangkat`, `riwayat_pangkat`, `hukuman_disiplin`
3. **Service & Data Layer:**
   - [`src/services/kepangkatan.service.ts`](file:///d:/project/mobile/e-simpeg/src/services/kepangkatan.service.ts)
4. **Antarmuka Pengguna (Frontend Pages):**
   - Halaman Portal Mandiri ASN: [`src/app/(dashboard)/pegawai/kepangkatan/page.tsx`](file:///d:/project/mobile/e-simpeg/src/app/(dashboard)/pegawai/kepangkatan/page.tsx)
   - Halaman Manajemen Admin BKPSDM: [`src/app/(dashboard)/admin/kepangkatan/page.tsx`](file:///d:/project/mobile/e-simpeg/src/app/(dashboard)/admin/kepangkatan/page.tsx)
   - Halaman Detail & Verifikasi Checklist: [`src/app/(dashboard)/admin/kepangkatan/[id]/page.tsx`](file:///d:/project/mobile/e-simpeg/src/app/(dashboard)/admin/kepangkatan/[id]/page.tsx)
   - Halaman Konfigurasi Aturan Dinamis: [`src/app/(dashboard)/admin/kepangkatan/aturan/page.tsx`](file:///d:/project/mobile/e-simpeg/src/app/(dashboard)/admin/kepangkatan/aturan/page.tsx)
   - Halaman Early Warning Eksekutif: [`src/app/(dashboard)/eksekutif/early-warning/page.tsx`](file:///d:/project/mobile/e-simpeg/src/app/(dashboard)/eksekutif/early-warning/page.tsx)
