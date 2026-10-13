# Standar Operasional Prosedur (SOP) Cadangan & Pemulihan Basis Data (Backup & Disaster Recovery)

**Sistem**: e-SIMPEG Daerah Kabupaten Nusantara Jaya  
**Regulasi Acuan**: Bab 8 PRD, UU Pelindungan Data Pribadi No. 27/2022, Peraturan BSSN No. 4/2021

---

## 1. Kebijakan Pencadangan (Backup Policy)

| Parameter | Kebijakan Resmi |
|---|---|
| **Frekuensi Cadangan Penuh** | Setiap hari pukul 01:00 WIB (Point-in-Time Recovery enabled) |
| **Retensi Cadangan** | 30 Hari kalender aktif di Cloud Object Storage terenkripsi |
| **Lokasi Cadangan Geografis** | Multi-region terpisah dari server komputasi aktif |
| **Enkripsi Cadangan** | AES-256 GCM pada level storage dan file backup dump |
| **Uji Pemulihan Rutin** | Dilakukan pengujian simulasi *Restore Drill* setiap triwulan |

---

## 2. Prosedur Pencadangan Manual (Ad-hoc Dump)

Gunakan perintah PostgreSQL CLI resmi dari terminal server atau runner CI/CD:

```bash
# Export skema dan seluruh data kepegawaian (terkompresi gzip)
pg_dump -h db.nusantarajaya.supabase.co -U postgres -d postgres -F c -b -v -f "simpeg_backup_$(date +%Y%m%d_%H%M%S).dump"
```

---

## 3. Prosedur Pemulihan Bencana (Disaster Recovery)

Jika terjadi insiden fatal pada kluster basis data utama:

1. **Aktivasi Mode Pemeliharaan (Maintenance Mode)**:
   Arahkan traffic web app ke halaman status pemeliharaan dinas.
2. **Siapkan Target Basis Data Bersih**:
   Inisialisasi instance PostgreSQL baru atau reset skema target.
3. **Restorasi Berkas Cadangan**:
   ```bash
   pg_restore -h db.nusantarajaya.supabase.co -U postgres -d postgres -v "simpeg_backup_YYYYMMDD_HHMMSS.dump"
   ```
4. **Verifikasi Integritas Row Level Security**:
   Jalankan query validasi tabel `audit_log` dan fungsi helper RLS:
   ```sql
   select count(*) from public.pegawai;
   select count(*) from public.audit_log;
   ```
5. **Kembalikan Akses Layanan**:
   Buka kembali rute normal dan catat Berita Acara Insiden Pemulihan Sistem.
