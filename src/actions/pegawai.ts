"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const pegawaiSchema = z.object({
  nip: z.string().regex(/^[0-9]{18}$/, "NIP harus 18 digit angka"),
  nama_lengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  gelar_depan: z.string().optional(),
  gelar_belakang: z.string().optional(),
  tempat_lahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().min(8, "Tanggal lahir wajib diisi"),
  jenis_kelamin: z.enum(["L", "P"]),
  status_kepegawaian: z.enum(["PNS", "PPPK"]),
  golongan: z.string().min(1, "Golongan wajib diisi"),
  pangkat: z.string().min(1, "Pangkat wajib diisi"),
  pendidikan_terakhir: z.string().min(2, "Pendidikan terakhir wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
  no_hp: z.string().min(10, "Nomor HP wajib diisi"),
  email: z.string().email("Email tidak valid"),
  pd_id: z.string().uuid("Perangkat Daerah wajib dipilih"),
  jabatan_id: z.string().uuid("Jabatan wajib dipilih"),
});

export async function createPegawaiAction(formData: FormData) {
  const rawData = {
    nip: formData.get("nip") as string,
    nama_lengkap: formData.get("nama_lengkap") as string,
    gelar_depan: (formData.get("gelar_depan") as string) || undefined,
    gelar_belakang: (formData.get("gelar_belakang") as string) || undefined,
    tempat_lahir: formData.get("tempat_lahir") as string,
    tanggal_lahir: formData.get("tanggal_lahir") as string,
    jenis_kelamin: formData.get("jenis_kelamin") as "L" | "P",
    status_kepegawaian: formData.get("status_kepegawaian") as "PNS" | "PPPK",
    golongan: formData.get("golongan") as string,
    pangkat: formData.get("pangkat") as string,
    pendidikan_terakhir: formData.get("pendidikan_terakhir") as string,
    alamat: formData.get("alamat") as string,
    no_hp: formData.get("no_hp") as string,
    email: formData.get("email") as string,
    pd_id: formData.get("pd_id") as string,
    jabatan_id: formData.get("jabatan_id") as string,
  };

  const validation = pegawaiSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pegawai")
    .insert([validation.data])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  // Audit Trail
  await logAudit({
    aksi: "INSERT",
    tabel: "pegawai",
    recordId: data?.id,
    sesudah: validation.data,
    aktorNama: "Administrator BKPSDM",
    aktorRole: "super_admin",
  });

  revalidatePath("/admin/pegawai");
  return { success: true, message: "Data pegawai baru berhasil ditambahkan." };
}

export async function ajukanPerubahanDataAction(formData: FormData) {
  const pegawaiId = formData.get("pegawai_id") as string;
  const field = formData.get("field") as string;
  const nilaiLama = formData.get("nilai_lama") as string;
  const nilaiBaru = formData.get("nilai_baru") as string;

  if (!pegawaiId || !field || !nilaiBaru) {
    return { success: false, error: "Data usulan perubahan tidak lengkap." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("perubahan_data_pegawai")
    .insert([
      {
        pegawai_id: pegawaiId,
        field,
        nilai_lama: nilaiLama,
        nilai_baru: nilaiBaru,
        status: "diajukan",
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  // Audit Trail
  await logAudit({
    aksi: "INSERT",
    tabel: "perubahan_data_pegawai",
    recordId: data?.id,
    sesudah: { field, nilai_lama: nilaiLama, nilai_baru: nilaiBaru },
    aktorNama: "Pegawai Mandiri",
    aktorRole: "pegawai",
  });

  revalidatePath("/pegawai/profil/riwayat-perubahan");
  return {
    success: true,
    message: "Permohonan perubahan data berhasil diajukan ke Verifikator BKPSDM.",
  };
}

export async function putuskanPerubahanDataAction(
  id: string,
  status: "disetujui" | "ditolak",
  catatan?: string
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("perubahan_data_pegawai")
    .update({
      status,
      diputuskan_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  // Catat Audit
  await logAudit({
    aksi: "UPDATE",
    tabel: "perubahan_data_pegawai",
    recordId: id,
    sesudah: { status, catatan },
    aktorNama: "Verifikator BKPSDM",
    aktorRole: "operator",
  });

  revalidatePath("/admin/perubahan-data");
  return {
    success: true,
    message: `Permohonan perubahan data telah ${status === "disetujui" ? "disetujui" : "ditolak"}.`,
  };
}
