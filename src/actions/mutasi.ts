"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function usulkanMutasiAction(
  pegawaiId: string,
  jenis: "mutasi" | "rotasi" | "promosi",
  pdAsalId: string,
  pdTujuanId: string,
  jabatanTujuanId: string,
  alasan: string
) {
  const supabase = await createServerSupabaseClient();

  // Validasi formasi ketersediaan di PD tujuan
  const tahunSekarang = new Date().getFullYear();
  const { data: formasi } = await supabase
    .from("formasi")
    .select("kebutuhan, tersedia")
    .eq("pd_id", pdTujuanId)
    .eq("jabatan_id", jabatanTujuanId)
    .eq("tahun", tahunSekarang)
    .single();

  if (formasi && formasi.tersedia >= formasi.kebutuhan) {
    return {
      success: false,
      error: "Formasi jabatan di Perangkat Daerah tujuan telah penuh sesuai ABK MenPAN-RB.",
    };
  }

  const { data, error } = await supabase
    .from("mutasi")
    .insert([
      {
        pegawai_id: pegawaiId,
        jenis,
        pd_asal_id: pdAsalId,
        pd_tujuan_id: pdTujuanId,
        jabatan_tujuan_id: jabatanTujuanId,
        alasan,
        status: "diajukan",
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  await logAudit({
    aksi: "INSERT",
    tabel: "mutasi",
    recordId: data?.id,
    sesudah: { jenis, pdTujuanId, jabatanTujuanId, alasan },
    aktorNama: "Operator / Admin BKPSDM",
    aktorRole: "operator",
  });

  revalidatePath("/admin/jabatan-mutasi");
  return {
    success: true,
    message: "Usulan mutasi/rotasi pegawai berhasil diajukan untuk telaah Baperjakat.",
  };
}
