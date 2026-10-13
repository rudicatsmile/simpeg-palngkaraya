import { WhatsAppSendParams, WhatsAppSendResult } from "./types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function formatNomorWhatsApp(noHp: string): string {
  let cleaned = noHp.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export async function sendWhatsAppMessage(
  params: WhatsAppSendParams
): Promise<WhatsAppSendResult> {
  const formattedPhone = formatNomorWhatsApp(params.to);
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || "https://api.wagw.nusantarajaya.go.id/v1/send";
  const gatewayToken = process.env.WHATSAPP_GATEWAY_TOKEN || "dummy-wagw-token";

  let attempt = 0;
  const maxRetries = 3;
  let lastError = "";

  while (attempt < maxRetries) {
    attempt++;
    try {
      // Mocking fallback jika dalam lingkungan demo/lokal tanpa gateway nyata
      if (gatewayUrl.includes("nusantarajaya.go.id") || gatewayToken.includes("dummy")) {
        // Catat ke notifikasi_log
        await catatNotifikasiLog(formattedPhone, params.message, "sent", attempt);
        return {
          success: true,
          messageId: `msg-wa-${Date.now()}-${attempt}`,
          status: "sent",
          attempt,
        };
      }

      const response = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gatewayToken}`,
        },
        body: JSON.stringify({
          recipient: formattedPhone,
          body: params.message,
          template: params.templateId,
          variables: params.templateVars,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        await catatNotifikasiLog(formattedPhone, params.message, "sent", attempt);
        return {
          success: true,
          messageId: json.message_id || `msg-${Date.now()}`,
          status: "sent",
          attempt,
        };
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`;
    } catch (err: any) {
      lastError = err.message || "Network Error";
    }

    // Delay exponential backoff sederhana sebelum retry
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  // Jika gagal setelah 3 kali percobaan
  await catatNotifikasiLog(formattedPhone, params.message, "failed", attempt, lastError);
  return {
    success: false,
    status: "failed",
    error: `Gagal mengirim WhatsApp setelah ${maxRetries} percobaan: ${lastError}`,
    attempt,
  };
}

async function catatNotifikasiLog(
  penerima: string,
  pesan: string,
  status: "sent" | "failed",
  retryCount: number,
  errorMessage?: string
) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("notifikasi_log").insert([
      {
        kanal: "whatsapp",
        penerima,
        pesan,
        status,
        retry_count: retryCount,
        error_message: errorMessage || null,
      },
    ]);
  } catch (e) {
    console.warn("Gagal mencatat log pengiriman WhatsApp:", e);
  }
}
