import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUDI_ID = "e1a1b1c1-0001-4000-8000-000000000001";
const SITI_ID = "e1a1b1c1-0002-4000-8000-000000000002";
const HENDRO_ID = "e1a1b1c1-0003-4000-8000-000000000003";
const AHMAD_ID = "e1a1b1c1-0004-4000-8000-000000000004";
const JOKO_ID = "e1a1b1c1-0005-4000-8000-000000000005";
const DEWI_ID = "e1a1b1c1-0006-4000-8000-000000000006";

const BKPSDM_PD = "d1a1b1c1-0001-4000-8000-000000000001";
const DISDIK_PD = "d1a1b1c1-0002-4000-8000-000000000002";
const DINKES_PD = "d1a1b1c1-0003-4000-8000-000000000003";

async function run() {
  console.log("Seeding all remaining tables...");

  // Usulan Pangkat
  const { error: errPangkat } = await supabaseAdmin.from("usulan_kenaikan_pangkat").insert([
    {
      pegawai_id: SITI_ID,
      jenis: "reguler",
      golongan_tujuan: "III/d",
      tmt_usulan: "2026-10-01",
      status: "diajukan",
      catatan: "Usulan periode Oktober 2026",
      checklist_status: { sk_terakhir: true, skp_2_tahun: true, bebas_disiplin: true },
    },
    {
      pegawai_id: DEWI_ID,
      jenis: "pilihan",
      golongan_tujuan: "III/c",
      tmt_usulan: "2026-04-01",
      status: "disetujui",
      catatan: "Uji kompetensi perawat madya telah lulus",
      checklist_status: { sk_terakhir: true, skp_2_tahun: true, ujikom: true },
    },
  ]);
  if (errPangkat) console.error("Pangkat err:", errPangkat.message);

  // Riwayat Pangkat
  const { error: errRiwayat } = await supabaseAdmin.from("riwayat_pangkat").insert([
    {
      pegawai_id: BUDI_ID,
      golongan: "IV/a",
      pangkat: "Pembina",
      tmt: "2022-04-01",
      nomor_sk: "821.2/045/BKPSDM/2022",
      tanggal_sk: "2022-03-15",
    },
    {
      pegawai_id: SITI_ID,
      golongan: "III/c",
      pangkat: "Penata",
      tmt: "2022-10-01",
      nomor_sk: "821.2/089/BKPSDM/2022",
      tanggal_sk: "2022-09-12",
    },
  ]);
  if (errRiwayat) console.error("Riwayat err:", errRiwayat.message);

  // SKP
  const { error: errSkp } = await supabaseAdmin.from("skp").insert([
    {
      pegawai_id: BUDI_ID,
      tahun: 2024,
      status: "final",
      nilai_akhir: 92.8,
      predikat: "Baik",
    },
    {
      pegawai_id: SITI_ID,
      tahun: 2025,
      status: "dinilai",
      nilai_akhir: 89.2,
      predikat: "Baik",
    },
    {
      pegawai_id: AHMAD_ID,
      tahun: 2025,
      status: "final",
      nilai_akhir: 95.0,
      predikat: "Sangat Baik",
    },
    {
      pegawai_id: DEWI_ID,
      tahun: 2025,
      status: "final",
      nilai_akhir: 91.5,
      predikat: "Baik",
    },
  ]);
  if (errSkp) console.error("SKP err:", errSkp.message);

  // Hukuman Disiplin
  const { error: errDisiplin } = await supabaseAdmin.from("hukuman_disiplin").insert([
    {
      pegawai_id: JOKO_ID,
      tingkat: "ringan",
      jenis_hukuman: "Teguran Tertulis",
      alasan: "Terlambat presensi lebih dari 5 hari berturut-turut pada triwulan III",
      nomor_sk: "862.1/014/DINKES/2025",
      tanggal_sk: "2025-08-10",
      tanggal_mulai: "2025-08-15",
      tanggal_selesai: "2025-11-15",
      pejabat_penetap: "Kepala Dinas Kesehatan",
      status_aktif: false,
    },
  ]);
  if (errDisiplin) console.error("Disiplin err:", errDisiplin.message);

  // Mutasi
  const { error: errMutasi } = await supabaseAdmin.from("mutasi").insert([
    {
      pegawai_id: SITI_ID,
      jenis: "rotasi",
      pd_asal_id: DISDIK_PD,
      pd_tujuan_id: BKPSDM_PD,
      jabatan_tujuan_id: "a1a1b1c1-0005-4000-8000-000000000005",
      alasan: "Penguatan analis kebutuhan ASN di BKPSDM",
      status: "verifikasi",
    },
  ]);
  if (errMutasi) console.error("Mutasi err:", errMutasi.message);

  // Lowongan Internal
  const { error: errLowongan } = await supabaseAdmin.from("lowongan_internal").insert([
    {
      jabatan_id: "a1a1b1c1-0002-4000-8000-000000000002",
      deskripsi: "Seleksi Terbuka Jabatan Administrator Bidang Mutasi dan Kepangkatan BKPSDM",
      batas_daftar: "2026-06-30",
      status: "buka",
    },
    {
      jabatan_id: "a1a1b1c1-0007-4000-8000-000000000007",
      deskripsi: "Peluang Rotasi Internal Perawat Ahli Pertama RSUD Nusantara Jaya",
      batas_daftar: "2026-05-15",
      status: "buka",
    },
  ]);
  if (errLowongan) console.error("Lowongan err:", errLowongan.message);

  // Pegawai Diklat
  const { error: errPegDiklat } = await supabaseAdmin.from("pegawai_diklat").insert([
    {
      pegawai_id: BUDI_ID,
      diklat_id: "b1a1b1c1-0001-4000-8000-000000000001",
      status: "disetujui",
      tanggal_selesai: "2024-11-20",
      sertifikat_path: "sertifikat-diklat/budi/pka_2024.pdf",
    },
    {
      pegawai_id: SITI_ID,
      diklat_id: "b1a1b1c1-0002-4000-8000-000000000002",
      status: "disetujui",
      tanggal_selesai: "2025-05-10",
      sertifikat_path: "sertifikat-diklat/siti/bimtek_talenta.pdf",
    },
  ]);
  if (errPegDiklat) console.error("Pegawai diklat err:", errPegDiklat.message);

  // Perubahan data
  const { error: errPerubahan } = await supabaseAdmin.from("perubahan_data_pegawai").insert([
    {
      pegawai_id: BUDI_ID,
      field: "alamat",
      nilai_lama: { alamat: "Jl. Merdeka No. 45" },
      nilai_baru: { alamat: "Jl. Merdeka No. 50, Blok B" },
      status: "verifikasi",
    },
    {
      pegawai_id: SITI_ID,
      field: "no_hp",
      nilai_lama: { no_hp: "081398765432" },
      nilai_baru: { no_hp: "081399887766" },
      status: "disetujui",
    },
  ]);
  if (errPerubahan) console.error("Perubahan err:", errPerubahan.message);

  console.log("Selesai insert data!");
}

run();
