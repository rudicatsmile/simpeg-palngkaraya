# Daftar Kredensial & Akun Pengguna SIMPEG Daerah
**Pemerintah Kabupaten Nusantara Jaya**

Dokumen ini berisi daftar kredensial akun uji coba (*demo accounts*) untuk 7 peran pengguna pada sistem E-SIMPEG Daerah Kabupaten Nusantara Jaya yang terhubung dengan Supabase Auth & PostgreSQL.

---

## 1. Informasi Autentikasi Umum

- **URL Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Kata Sandi Standar (Seluruh Akun Uji Coba)**: `Nusantara2026!`
- **Enkripsi Kata Sandi**: Bcrypt via Supabase GoTrue Auth
- **Status Akun**: *Confirmed* (Email terverifikasi otomatis)

---

## 2. Tabel Kredensial 7 Peran ASN

| No | Peran (*Role*) | Email Login | Nama ASN | NIP | Jabatan & Unit Kerja | Rute Dasbor | Hak Akses Utama |
|:--:|:---|:---|:---|:---|:---|:---|:---|
| 1 | **Super Admin** | `superadmin@nusantarajaya.go.id` | Dr. Budi Santoso, M.Si. | 197805122002121003 | Kepala Bidang Mutasi & Kepangkatan (BKPSDM) | `/admin/dashboard` | Akses penuh seluruh master data, konfigurasi sistem, dan manajemen user. |
| 2 | **Operator** | `operator@nusantarajaya.go.id` | Admin Operator BKPSDM | 198204102005011004 | Pengelola Sistem Kepegawaian (BKPSDM) | `/admin/dashboard` | Verifikasi data berkas, kenaikan pangkat, formasi, mutasi, dan impor presensi. |
| 3 | **Kepala PD** | `kepalapd@nusantarajaya.go.id` | Drs. Hendro Wibowo, M.Pd. | 197108201995121001 | Kepala Dinas Pendidikan dan Kebudayaan | `/kepala-pd/dashboard` | Persetujuan cuti tingkat 2, pemantauan formasi, dan pengawasan pegawai dinas terkait. |
| 4 | **Atasan** | `atasan@nusantarajaya.go.id` | Ahmad Dahlan, S.T., M.Kom. | 198204102005011004 | Kepala Seksi Pembinaan SMP (Dinas Pendidikan) | `/atasan/dashboard` | Persetujuan cuti bawahan langsung, penilaian SKP bawahan, monitoring tim. |
| 5 | **Pegawai** | `pegawai@nusantarajaya.go.id` | Dewi Lestari, S.E. | 199402282019032007 | Perawat Ahli Pertama (Dinas Kesehatan) | `/dashboard` | Layanan mandiri: Pengajuan cuti, presensi, cek berkas pangkat H-180, cetak QR ID. |
| 6 | **Pimpinan (Eksekutif)** | `eksekutif@nusantarajaya.go.id` | Bupati & Sekda Nusantara Jaya | - | Pimpinan Daerah (Sekretariat Daerah) | `/eksekutif/dashboard` | Dasbor eksekutif agregat, statistik merit system, sebaran formasi ASN kabupaten. |
| 7 | **Auditor** | `auditor@nusantarajaya.go.id` | Auditor Inspektorat | - | Inspektorat Daerah Kabupaten Nusantara Jaya | `/auditor/dashboard` | Pemeriksaan WORM Audit Trail, monitoring kepatuhan disiplin, ekspor rekapitulasi. |

---

## 3. Pintasan Cepat di Halaman Login

Pada halaman login ([http://localhost:3000/login](http://localhost:3000/login)), telah disediakan tombol pintasan **"Pintasan Kredensial Uji Coba (7 Role)"** di bagian bawah kartu form. Anda cukup mengklik salah satu tombol peran untuk langsung mengisi email dan kata sandi tanpa perlu mengetik manual.

Selain itu, pada bagian bilah navigasi atas (header dasbor), tersedia **Role Switcher** untuk mensimulasikan perpindahan hak akses antar-peran secara instan saat pengujian antarmuka.

---

## 4. Perintah Reset & Re-Seed Akun Pengguna

Jika di kemudian hari database di-reset atau tabel auth dibersihkan, Anda dapat mendaftarkan ulang ke-7 akun di atas secara otomatis dengan menjalankan perintah:

```bash
npm run seed:users
```

Perintah tersebut mengeksekusi skrip [`scripts/seed-users.mjs`](../scripts/seed-users.mjs) yang memanfaatkan Supabase Auth Admin API resmi untuk membuat pengguna terkonfirmasi dan memetakan id pengguna ke tabel `public.user_roles` dan `public.pegawai`.

---

## 5. Ringkasan File Terkait

- **Form Autentikasi**: [`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx)
- **Middleware Proteksi Sesi**: [`src/middleware.ts`](../src/middleware.ts)
- **Skrip Pembuat Akun Auth**: [`scripts/seed-users.mjs`](../scripts/seed-users.mjs)
- **Master Skema Database**: [`supabase/01_master_migration.sql`](../supabase/01_master_migration.sql)
- **Master Data Dummy**: [`supabase/02_master_seed.sql`](../supabase/02_master_seed.sql)
