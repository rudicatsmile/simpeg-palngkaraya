"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function buatSKPTahunanAction(pegawaiId: string, tahun: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("skp")
    .insert([
      {
        pegawai_id: pegawaiId,
        tahun,
        status: "draft",
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pegawai/kinerja");
  return { success: true, message: `Kontrak SKP Tahun ${tahun} berhasil dibuat.` };
}

export async function tambahTargetSKPAction(
  skpId: string,
  uraian: string,
  aspek: "kuantitas" | "kualitas" | "waktu" | "biaya",
  target: number,
  satuan: string,
  bobot: number
) {
  const supabase = await createServerSupabaseClient();

  // Validasi total bobot tidak boleh melebihi 100%
  const { data: targets } = await supabase
    .from("skp_target")
    .select("bobot")
    .eq("skp_id", skpId);

  const totalBobotEksisting = targets?.reduce((sum, t) => sum + Number(t.bobot), 0) || 0;
  if (totalBobotEksisting + bobot > 100) {
    return {
      success: false,
      error: `Total bobot melebihi 100% (Saat ini: ${totalBobotEksisting}%, Tambahan: ${bobot}%).`,
    };
  }

  const { data, error } = await supabase.from("skp_target").insert([
    {
      skp_id: skpId,
      uraian,
      aspek,
      target,
      satuan,
      bobot,
      realisasi: 0,
    },
  ]);

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pegawai/kinerja");
  return { success: true, message: "Target indikator SKP berhasil ditambahkan." };
}

export async function beriNilaiSKPAction(
  skpId: string,
  nilaiAkhir: number,
  umpanBalik?: string
) {
  let predikat: string;
  if (nilaiAkhir >= 90) predikat = "Sangat Baik";
  else if (nilaiAkhir >= 75) predikat = "Baik";
  else if (nilaiAkhir >= 60) predikat = "Cukup";
  else predikat = "Kurang";

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("skp")
    .update({
      status: "dinilai",
      nilai_akhir: nilaiAkhir,
      predikat,
    })
    .eq("id", skpId);

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  await logAudit({
    aksi: "UPDATE",
    tabel: "skp",
    recordId: skpId,
    sesudah: { nilaiAkhir, predikat, umpanBalik },
    aktorNama: "Atasan Penilai Kinerja",
    aktorRole: "atasan",
  });

  revalidatePath("/atasan/penilaian");
  revalidatePath("/pegawai/kinerja");
  return {
    success: true,
    message: `Penilaian SKP selesai. Predikat Kinerja Pegawai: "${predikat}" (${nilaiAkhir}).`,
  };
}
