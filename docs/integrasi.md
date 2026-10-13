# Kontrak Integrasi Eksternal (External Integrations) e-SIMPEG Daerah

Dokumen ini mendefinisikan spesifikasi antarmuka teknis dan kontrak komunikasi antara sistem **e-SIMPEG Pemerintah Kabupaten Nusantara Jaya** dengan sistem-sistem nasional dan regional.

---

## 1. BKN SIASN WebService (Layanan Data ASN Nasional)
- **Tujuan**: Sinkronisasi data utama PNS/PPPK, riwayat SK kepangkatan, dan usulan pensiun langsung ke database BKN.
- **Lokasi Kode**: `src/integrations/siasn/client.ts`
- **Metode Autentikasi**: OAuth 2.0 / API Key Bearer Token BKN.
- **Endpoint Utama**:
  - `GET /api/pns/data-utama/{nip}`: Mengambil data induk ASN terverifikasi nasional.
  - `POST /api/kp/usulan`: Mengirim berkas usulan kenaikan pangkat secara elektronik.
- **Status MVP**: Siap pakai (Production Stub & Contract Ready).

---

## 2. e-Kinerja BKN (PermenPAN-RB No. 6 Tahun 2022)
- **Tujuan**: Sinkronisasi Penetapan Sasaran Kinerja Pegawai (SKP) tahunan dan capaian predikat kinerja periodik.
- **Lokasi Kode**: `src/integrations/ekinerja/client.ts`
- **Metode Autentikasi**: REST API Key & Webhook Secret.
- **Payload Penting**:
  ```json
  {
    "tahun": 2026,
    "nip": "197805122002121003",
    "nilaiKinerja": 94.5,
    "predikatKinerja": "Sangat Baik",
    "pejabatPenilaiNip": "197108201995121001"
  }
  ```

---

## 3. Balai Sertifikasi Elektronik - BSSN (TTE BSrE)
- **Tujuan**: Penerbitan Tanda Tangan Elektronik tersertifikasi pada dokumen SK Kenaikan Pangkat, SK Mutasi, dan Surat Izin Cuti ASN.
- **Lokasi Kode**: `src/integrations/tte-bsre/client.ts`
- **Protokol**: Mutual TLS (mTLS) & Passphrase Signer dengan enkripsi SHA-256.
- **Validasi Publik**: Dilengkapi QR Code token yang dapat dipindai melalui halaman publik `/verifikasi/[token]`.

---

## 4. WhatsApp Gateway (Pemberitahuan Cerdas ASN)
- **Tujuan**: Pengiriman siaran pengingat H-180 kepangkatan, status cuti, dan token aktivasi akun.
- **Lokasi Kode**: `src/integrations/whatsapp/client.ts`
- **Webhook Status**: `POST /api/v1/webhook/whatsapp`
- **Format Nomor**: Normalisasi otomatis awalan Indonesia (`628...`).
- **Resiliensi**: Retry maksimal 3x dengan eksponensial backoff dan audit di `notifikasi_log`.
