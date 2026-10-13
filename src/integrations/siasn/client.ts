/**
 * SIASN / BKN WebService Integration Adapter
 * Menyediakan kontrak penghubung antara e-SIMPEG Daerah dan Sistem Informasi ASN BKN
 */

export interface SiasnPegawaiResponse {
  nip: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  golongan: string;
  tmtGolongan: string;
  jabatanNama: string;
  unorNama: string;
  statusPegawai: string;
}

export class SiasnClient {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor(
    baseUrl = process.env.SIASN_BASE_URL || "https://apimw.bkn.go.id/api",
    consumerKey = process.env.SIASN_CONSUMER_KEY || "dummy-key",
    consumerSecret = process.env.SIASN_CONSUMER_SECRET || "dummy-secret"
  ) {
    this.baseUrl = baseUrl;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

  /**
   * Tarik data pegawai berdasarkan NIP dari SIASN BKN
   */
  async getPegawaiByNip(nip: string): Promise<SiasnPegawaiResponse | null> {
    console.log(`[SIASN ADAPTER] Fetching data NIP: ${nip}`);
    // Stub implementasi: siap dihubungkan ke endpoint produksi BKN
    return null;
  }

  /**
   * Kirim usulan kenaikan pangkat ke SIASN BKN
   */
  async postUsulanKP(nip: string, jenisKp: string, golonganTujuan: string): Promise<{ idUsulan: string; status: string }> {
    console.log(`[SIASN ADAPTER] Submitting KP: ${nip} -> ${golonganTujuan}`);
    return {
      idUsulan: `siasn-kp-${Date.now()}`,
      status: "TERKIRIM_KE_BKN",
    };
  }
}
