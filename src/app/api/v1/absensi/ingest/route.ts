import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface IngestRecord {
  device_user_id: string;
  timestamp: string; // ISO 8601 string
  event_type: "check_in" | "check_out";
  device_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature-hmac");
    const secret = process.env.ATTENDANCE_INGEST_SECRET || "dummy-attendance-secret";

    // 1. Verifikasi HMAC SHA-256
    if (signature) {
      const calculated = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
      if (calculated !== signature) {
        return NextResponse.json({ error: "Invalid HMAC Signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const records: IngestRecord[] = Array.isArray(payload) ? payload : payload.records || [];

    if (!records.length) {
      return NextResponse.json({ error: "No records found in payload" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    let successCount = 0;
    let skippedCount = 0;

    for (const item of records) {
      // 2. Petakan device_user_id ke pegawai
      const { data: pegawai } = await supabase
        .from("pegawai")
        .select("id")
        .eq("device_user_id", item.device_user_id)
        .single();

      if (!pegawai) {
        skippedCount++;
        continue;
      }

      const eventDate = new Date(item.timestamp);
      const tanggal = eventDate.toISOString().split("T")[0];

      // Jam kerja masuk standar Pemda: 07:30 WIB, toleransi batas 07:45 WIB
      const jam = eventDate.getHours();
      const menit = eventDate.getMinutes();
      const totalMenit = jam * 60 + menit;
      const isLate = totalMenit > 7 * 60 + 45; // Lewat dari 07:45 WIB

      // 3. Upsert data absensi harian
      if (item.event_type === "check_in") {
        await supabase.from("absensi").upsert(
          {
            pegawai_id: pegawai.id,
            tanggal,
            jam_masuk: item.timestamp,
            status: isLate ? "terlambat" : "hadir",
            sumber: "perangkat",
            device_id: item.device_id,
          },
          { onConflict: "pegawai_id,tanggal" }
        );
      } else {
        await supabase.from("absensi").upsert(
          {
            pegawai_id: pegawai.id,
            tanggal,
            jam_pulang: item.timestamp,
            sumber: "perangkat",
            device_id: item.device_id,
          },
          { onConflict: "pegawai_id,tanggal" }
        );
      }

      successCount++;
    }

    return NextResponse.json({
      success: true,
      recordsIngested: successCount,
      unmappedSkipped: skippedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
