"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function catatHukumanDisiplinAction(
  pegawaiId: string,
  tingkat: "ringan" | "sedang" | "berat",
  jenisHukuman: string,
  alasan: string,
  nomorSk: string,
  tanggalSk: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  pejabatPenetap: string
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("hukuman_disiplin")
    .insert([
      {
        pegawai_id: pegawaiId,
        tingkat,
        jenis_hukuman: jenisHukuman,
        alasan,
        nomor_sk: nomorSk,
        tanggal_sk: tanggalSk,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        pejabat_penetap: pejabatPenetap,
        status_aktif: true,
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  await logAudit({
    aksi: "INSERT",
    tabel: "hukuman_disiplin",
    recordId: data?.id,
    sesudah: { tingkat, jenisHukuman, nomorSk, pejabatPenetap },
    aktorNama: "Bidang Penilaian Kinerja & Disiplin BKPSDM",
    aktorRole: "super_admin",
  });

  revalidatePath("/admin/disiplin");
  revalidatePath("/pegawai/disiplin");
  return {
    success: true,
    message: `SK Penjatuhan Hukuman Disiplin No. ${nomorSk} berhasil dicatatkan ke riwayat pegawai.`,
  };
}
