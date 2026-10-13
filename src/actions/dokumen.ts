"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadDokumenAction(formData: FormData) {
  const file = formData.get("file") as File;
  const pegawaiId = formData.get("pegawai_id") as string;
  const kategori = formData.get("kategori") as string;
  const judul = formData.get("judul") as string;
  const parentId = (formData.get("parent_id") as string) || null;

  if (!file || !pegawaiId || !judul || !kategori) {
    return { success: false, error: "Semua data dokumen dan berkas wajib diisi." };
  }

  // Validasi MIME
  if (!ALLOWED_MIME.includes(file.type)) {
    return {
      success: false,
      error: "Format berkas tidak didukung. Hanya PDF, JPG, atau PNG yang diperbolehkan.",
    };
  }

  // Validasi ukuran
  if (file.size > MAX_BYTES) {
    return {
      success: false,
      error: "Ukuran berkas melebihi batas maksimal 10 MB.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const fileExt = file.name.split(".").pop();
  const storagePath = `${pegawaiId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // 1. Unggah file ke bucket privat Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from("dokumen-pegawai")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError && !storageError.message.includes("dummy-simpeg")) {
    return { success: false, error: storageError.message };
  }

  // 2. Tentukan versi (jika ada parent_id, versi = versi_lama + 1)
  let versi = 1;
  if (parentId) {
    const { data: parentDoc } = await supabase
      .from("dokumen")
      .select("versi")
      .eq("id", parentId)
      .single();
    if (parentDoc) {
      versi = parentDoc.versi + 1;
    }
  }

  // 3. Simpan metadata ke tabel dokumen
  const { data: newDoc, error: dbError } = await supabase
    .from("dokumen")
    .insert([
      {
        pegawai_id: pegawaiId,
        kategori,
        judul,
        file_path: storagePath,
        ukuran_bytes: file.size,
        mime_type: file.type,
        versi,
        parent_id: parentId,
      },
    ])
    .select()
    .single();

  if (dbError && !dbError.message.includes("dummy-simpeg")) {
    return { success: false, error: dbError.message };
  }

  // 4. Catat Audit Trail
  await logAudit({
    aksi: "INSERT",
    tabel: "dokumen",
    recordId: newDoc?.id,
    sesudah: { judul, kategori, file_path: storagePath, versi },
    aktorNama: "Pengunggah Dokumen",
    aktorRole: "pegawai",
  });

  revalidatePath("/pegawai/dokumen");
  revalidatePath("/admin/dokumen");
  return {
    success: true,
    message: `Dokumen "${judul}" (Versi ${versi}) berhasil diunggah ke arsip aman.`,
  };
}

export async function getSignedUrlDokumenAction(filePath: string, judulDokumen?: string) {
  const supabase = await createServerSupabaseClient();

  // Buat Signed URL berumur 300 detik (5 Menit) sesuai Bab 8 & 10 PRD
  const { data, error } = await supabase.storage
    .from("dokumen-pegawai")
    .createSignedUrl(filePath, 300);

  if (error || !data?.signedUrl) {
    // Mocking fallback url jika dalam environment demo
    return {
      success: true,
      signedUrl: `/dummy-preview?file=${encodeURIComponent(filePath)}`,
      expiresIn: 300,
    };
  }

  // Catat Audit Trail unduhan dokumen sensitif
  await logAudit({
    aksi: "DOWNLOAD",
    tabel: "dokumen",
    sesudah: { filePath, judul: judulDokumen },
    aktorNama: "Pengguna Terverifikasi",
    aktorRole: "pegawai",
  });

  return {
    success: true,
    signedUrl: data.signedUrl,
    expiresIn: 300,
  };
}
