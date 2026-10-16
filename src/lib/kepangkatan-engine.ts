/**
 * Mesin Perhitungan Kenaikan Pangkat ASN (Pemerintah Daerah)
 * Kepatuhan: Bab 6 & Bab 11 PRD, PP No. 11/2017, & Perka BKN No. 12/2002
 */

export interface PrediksiKPHasil {
  memenuhiSyaratWaktu: boolean;
  tmtPrediksi: string;
  sisaHari: number;
  faseNotifikasi: "H-180" | "H-90" | "H-30" | "Overdue" | "Belum Waktunya";
  terhambatDisiplin: boolean;
  alasanHambatan?: string;
}

export function hitungPrediksiKenaikanPangkat(
  tmtGolonganTerakhir: string,
  hukumanDisiplinAktif?: { tingkat: "ringan" | "sedang" | "berat"; alasan: string }[]
): PrediksiKPHasil {
  const parts = tmtGolonganTerakhir.split("-").map(Number);
  const y = parts[0];
  const m = parts[1] || 1;

  const targetYear = y + 4;
  let resYear = targetYear;
  let resMonth = 4;

  if (m <= 4) {
    resMonth = 4;
  } else if (m <= 10) {
    resMonth = 10;
  } else {
    resYear = targetYear + 1;
    resMonth = 4;
  }

  const tmtResmiStr = `${resYear}-${String(resMonth).padStart(2, "0")}-01`;
  const tmtResmi = new Date(resYear, resMonth - 1, 1);

  const today = new Date();
  const diffTime = tmtResmi.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Tentukan fase notifikasi
  let fase: "H-180" | "H-90" | "H-30" | "Overdue" | "Belum Waktunya";
  if (diffDays < 0) {
    fase = "Overdue";
  } else if (diffDays <= 30) {
    fase = "H-30";
  } else if (diffDays <= 90) {
    fase = "H-90";
  } else if (diffDays <= 180) {
    fase = "H-180";
  } else {
    fase = "Belum Waktunya";
  }

  // Cek apakah ada sanksi disiplin sedang atau berat yang aktif
  const adaHambatan = hukumanDisiplinAktif?.some(
    (h) => h.tingkat === "sedang" || h.tingkat === "berat"
  );

  return {
    memenuhiSyaratWaktu: diffDays <= 180,
    tmtPrediksi: tmtResmiStr,
    sisaHari: diffDays,
    faseNotifikasi: fase,
    terhambatDisiplin: !!adaHambatan,
    alasanHambatan: adaHambatan
      ? "Pegawai sedang menjalani masa hukuman disiplin aktif tingkat sedang/berat."
      : undefined,
  };
}

export const DAFTAR_GOLONGAN_PANGKAT: Record<string, string> = {
  "I/a": "Juru Muda",
  "I/b": "Juru Muda Tingkat I",
  "I/c": "Juru",
  "I/d": "Juru Tingkat I",
  "II/a": "Pengatur Muda",
  "II/b": "Pengatur Muda Tingkat I",
  "II/c": "Pengatur",
  "II/d": "Pengatur Tingkat I",
  "III/a": "Penata Muda",
  "III/b": "Penata Muda Tingkat I",
  "III/c": "Penata",
  "III/d": "Penata Tingkat I",
  "IV/a": "Pembina",
  "IV/b": "Pembina Tingkat I",
  "IV/c": "Pembina Utama Muda",
  "IV/d": "Pembina Utama Madya",
  "IV/e": "Pembina Utama",
};

export const URUTAN_GOLONGAN = [
  "I/a", "I/b", "I/c", "I/d",
  "II/a", "II/b", "II/c", "II/d",
  "III/a", "III/b", "III/c", "III/d",
  "IV/a", "IV/b", "IV/c", "IV/d", "IV/e"
];

export function getNextGolongan(currentGolongan: string): string {
  const idx = URUTAN_GOLONGAN.indexOf(currentGolongan);
  if (idx !== -1 && idx < URUTAN_GOLONGAN.length - 1) {
    return URUTAN_GOLONGAN[idx + 1];
  }
  return currentGolongan;
}

export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-").map(Number);
    if (parts.length < 3) return dateStr;
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${parts[2]} ${bulan[parts[1] - 1]} ${parts[0]}`;
  } catch {
    return dateStr;
  }
}

