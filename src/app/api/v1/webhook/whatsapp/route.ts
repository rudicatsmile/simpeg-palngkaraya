import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-webhook-secret");
    const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET || "dummy-wagw-secret";

    // Verifikasi rahasia webhook
    if (signature && signature !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized Webhook Signature" }, { status: 401 });
    }

    const payload = await req.json();
    const { messageId, status, recipient, error } = payload;

    if (messageId && status) {
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("notifikasi_log")
        .update({
          status: status === "delivered" || status === "read" ? "sent" : "failed",
          error_message: error || null,
        })
        .eq("id", messageId);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
