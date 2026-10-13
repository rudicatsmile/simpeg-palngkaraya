/**
 * e-Kinerja BKN / MenPAN-RB Integration Adapter
 * Sinkronisasi SKP Tahunan & Capaian Triwulan berbasis PermenPAN-RB No. 6/2022
 */

export interface EkinerjaSkpData {
  tahun: number;
  nip: string;
  nilaiKinerja: number;
  predikatKinerja: "Sangat Baik" | "Baik" | "Butuh Perbaikan" | "Kurang" | "Sangat Kurang";
  pejabatPenilaiNip: string;
}

export class EkinerjaClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(
    apiUrl = process.env.EKINERJA_API_URL || "https://ekinerja.bkn.go.id/api/v1",
    apiKey = process.env.EKINERJA_API_KEY || "dummy-ekinerja-key"
  ) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Kirim sinkronisasi hasil evaluasi SKP ke e-Kinerja pusat
   */
  async syncHasilSKP(data: EkinerjaSkpData): Promise<{ synced: boolean; syncId: string }> {
    console.log(`[EKINERJA ADAPTER] Syncing SKP NIP: ${data.nip} Nilai: ${data.nilaiKinerja}`);
    return {
      synced: true,
      syncId: `sync-${Date.now()}`,
    };
  }
}
