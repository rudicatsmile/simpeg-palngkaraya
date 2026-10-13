/**
 * Mesin Perhitungan Kenaikan Pangkat ASN (Kabupaten Nusantara Jaya)
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
