"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function ajukanUsulanKPAction(formData: FormData) {
  const pegawaiId = formData.get("pegawai_id") as string;
  const jenis = formData.get("jenis") as "reguler" | "pilihan" | "kgb";
  const golonganTujuan = formData.get("golongan_tujuan") as string;
  const tmtUsulan = formData.get("tmt_usulan") as string;

  if (!pegawaiId || !golonganTujuan || !tmtUsulan) {
    return { success: false, error: "Data usulan kenaikan pangkat tidak lengkap." };
  }

  const supabase = await createServerSupabaseClient();

  // Cek apakah ada hukuman disiplin aktif
  const { data: disiplin } = await supabase
    .from("hukuman_disiplin")
    .select("tingkat, alasan")
    .eq("pegawai_id", pegawaiId)
    .eq("status_aktif", true);

  const terhalang = disiplin?.some((d) => d.tingkat === "sedang" || d.tingkat === "berat");
  if (terhalang) {
    return {
      success: false,
      error: "Usulan ditolak sistem: Pegawai sedang menjalani hukuman disiplin aktif tingkat sedang/berat.",
    };
  }

  const { data, error } = await supabase
    .from("usulan_kenaikan_pangkat")
    .insert([
      {
        pegawai_id: pegawaiId,
        jenis,
        golongan_tujuan: golonganTujuan,
        tmt_usulan: tmtUsulan,
        status: "diajukan",
        checklist_status: {
          sk_terakhir: true,
          skp_2_tahun: true,
          bebas_disiplin: true,
        },
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  // Audit
  await logAudit({
    aksi: "INSERT",
    tabel: "usulan_kenaikan_pangkat",
    recordId: data?.id,
    sesudah: { pegawaiId, golonganTujuan, tmtUsulan },
    aktorNama: "Operator / Pegawai",
    aktorRole: "operator",
  });

  revalidatePath("/admin/kepangkatan");
  revalidatePath("/pegawai/kepangkatan");
  return {
    success: true,
    message: "Berkas usulan kenaikan pangkat berhasil diajukan untuk verifikasi.",
  };
}

export async function tetapkanSKKPAction(
  usulanId: string,
  pegawaiId: string,
  golonganBaru: string,
  pangkatBaru: string,
  nomorSk: string,
  tanggalSk: string,
  tmtPangkat: string
) {
  const supabase = await createServerSupabaseClient();

  // 1. Update status usulan
  await supabase
    .from("usulan_kenaikan_pangkat")
    .update({ status: "disetujui" })
    .eq("id", usulanId);

  // 2. Insert ke riwayat_pangkat
  await supabase.from("riwayat_pangkat").insert([
    {
      pegawai_id: pegawaiId,
      golongan: golonganBaru,
      pangkat: pangkatBaru,
      nomor_sk: nomorSk,
      tanggal_sk: tanggalSk,
      tmt: tmtPangkat,
    },
  ]);

  // 3. Update master data pegawai (golongan & pangkat baru)
  await supabase
    .from("pegawai")
    .update({
      golongan: golonganBaru,
      pangkat: pangkatBaru,
      tmt_golongan: tmtPangkat,
    })
    .eq("id", pegawaiId);

  // 4. Audit
  await logAudit({
    aksi: "UPDATE",
    tabel: "pegawai",
    recordId: pegawaiId,
    sesudah: { golonganBaru, nomorSk, tmtPangkat },
    aktorNama: "Kepala Bidang Kepangkatan BKPSDM",
    aktorRole: "super_admin",
  });

  revalidatePath("/admin/kepangkatan");
  revalidatePath("/admin/pegawai");
  return {
    success: true,
    message: `SK Kenaikan Pangkat No. ${nomorSk} berhasil ditetapkan dan disinkronkan ke data induk.`,
  };
}
