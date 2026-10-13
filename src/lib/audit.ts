"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface LogAuditParams {
  aksi: "INSERT" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "DOWNLOAD";
  tabel: string;
  recordId?: string;
  sebelum?: any;
  sesudah?: any;
  aktorId?: string;
  aktorNama?: string;
  aktorRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: LogAuditParams) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Ambil data user aktif jika aktorId belum diberikan
    let userAktorId = params.aktorId;
    if (!userAktorId) {
      const { data: { user } } = await supabase.auth.getUser();
      userAktorId = user?.id;
    }

    const { error } = await supabase.from("audit_log").insert({
      aksi: params.aksi,
      tabel: params.tabel,
      record_id: params.recordId,
      sebelum: params.sebelum ? JSON.stringify(params.sebelum) : null,
      sesudah: params.sesudah ? JSON.stringify(params.sesudah) : null,
      aktor_id: userAktorId,
      aktor_nama: params.aktorNama || "Pengguna Sistem",
      aktor_role: params.aktorRole || "pegawai",
      ip_address: params.ipAddress || "127.0.0.1",
      user_agent: params.userAgent || "Next.js WebApp",
    });

    if (error && !error.message.includes("dummy-simpeg")) {
      console.warn("Gagal mencatat audit log ke Supabase:", error.message);
    }
  } catch (err) {
    // Audit log tidak boleh memblokir transaksi utama jika terjadi kendala logging
    console.error("Kesalahan internal saat menulis audit trail:", err);
  }
}
