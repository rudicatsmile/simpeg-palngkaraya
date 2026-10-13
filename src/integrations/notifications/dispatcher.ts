"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "../whatsapp/client";
import { sendEmailMessage, generateEmailTemplate } from "../email/client";

export interface DispatchNotificationParams {
  userId: string;
  pegawaiId?: string;
  judul: string;
  pesan: string;
  tautan?: string;
  kategori?: string;
}

export async function dispatchNotification(params: DispatchNotificationParams) {
  const supabase = await createServerSupabaseClient();

  // 1. In-App Notification (Selalu dikirim untuk lonceng aplikasi)
  await supabase.from("notifikasi").insert([
    {
      user_id: params.userId,
      judul: params.judul,
      pesan: params.pesan,
      tautan: params.tautan || "/dashboard",
      kategori: params.kategori || "umum",
      dibaca: false,
    },
  ]);

  // 2. Ambil kontak pegawai untuk pengiriman kanal sekunder
  let emailPenerima: string | undefined;
  let noHpPenerima: string | undefined;

  if (params.pegawaiId) {
    const { data: pegawai } = await supabase
      .from("pegawai")
      .select("email, no_hp")
      .eq("id", params.pegawaiId)
      .single();
    if (pegawai) {
      emailPenerima = pegawai.email;
      noHpPenerima = pegawai.no_hp;
    }
  }

  // 3. Saluran WhatsApp (jika nomor tersedia)
  if (noHpPenerima) {
    await sendWhatsAppMessage({
      to: noHpPenerima,
      message: `*SIMPEG DAERAH KAB. NUSANTARA JAYA*\n\n*${params.judul}*\n\n${params.pesan}\n\nSilakan periksa di portal: ${process.env.NEXT_PUBLIC_SITE_URL || "https://simpeg.nusantarajaya.go.id"}${params.tautan || ""}`,
    });
  }

  // 4. Saluran Email Resmi (jika email tersedia)
  if (emailPenerima) {
    const fullLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${params.tautan || "/dashboard"}`;
    const htmlBody = generateEmailTemplate(params.judul, params.pesan, fullLink);
    await sendEmailMessage({
      to: emailPenerima,
      subject: `[SIMPEG DAERAH] ${params.judul}`,
      htmlContent: htmlBody,
    });
  }

  return { success: true };
}
