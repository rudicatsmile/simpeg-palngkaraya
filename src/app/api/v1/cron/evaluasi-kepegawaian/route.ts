import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hitungPrediksiKenaikanPangkat } from "@/lib/kepangkatan-engine";
import { dispatchNotification } from "@/integrations/notifications/dispatcher";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dummy-cron-secret";

    // Validasi Bearer Token Keamanan Job
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized Cron Trigger" }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    // 1. Ambil seluruh ASN aktif beserta TMT dan tanggal pensiun
    const { data: pegawaiList, error } = await supabase
      .from("pegawai")
      .select("id, user_id, nama_lengkap, nip, tmt_golongan, tanggal_pensiun, email, no_hp")
      .eq("status", "aktif");

    if (error && !error.message.includes("dummy-simpeg")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let notifKPCount = 0;
    let notifPensiunCount = 0;

    const list = pegawaiList || [];

    for (const p of list) {
      // Evaluasi Kenaikan Pangkat
      if (p.tmt_golongan) {
        const prediksi = hitungPrediksiKenaikanPangkat(p.tmt_golongan);
        if (
          prediksi.faseNotifikasi === "H-180" ||
          prediksi.faseNotifikasi === "H-90" ||
          prediksi.faseNotifikasi === "H-30" ||
          prediksi.faseNotifikasi === "Overdue"
        ) {
          if (p.user_id) {
            await dispatchNotification({
              userId: p.user_id,
              pegawaiId: p.id,
              judul: `Peringatan Kenaikan Pangkat: Periode ${prediksi.tmtPrediksi} (${prediksi.faseNotifikasi})`,
              pesan: `Halo ${p.nama_lengkap}, periode kenaikan pangkat Anda diprediksi pada ${prediksi.tmtPrediksi} (${prediksi.sisaHari} hari lagi). Mohon lengkapi checklist berkas SKP dan dokumen pendukung di portal e-SIMPEG.`,
              tautan: "/pegawai/kepangkatan",
              kategori: "kepangkatan",
            });
            notifKPCount++;
          }
        }
      }

      // Evaluasi Batas Usia Pensiun (BUP)
      if (p.tanggal_pensiun) {
        const pensiunDate = new Date(p.tanggal_pensiun);
        const today = new Date();
        const diffDays = Math.ceil((pensiunDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 365 || diffDays === 180 || diffDays === 30) {
          if (p.user_id) {
            await dispatchNotification({
              userId: p.user_id,
              pegawaiId: p.id,
              judul: `Pemberitahuan Persiapan Masa Bebas Tugas (BUP) - H-${diffDays}`,
              pesan: `Yth. ${p.nama_lengkap}, Anda akan memasuki Batas Usia Pensiun pada ${p.tanggal_pensiun}. Silakan periksa kelengkapan checklist dokumen Taspen & BKN di menu Layanan Pensiun.`,
              tautan: "/pegawai/pensiun",
              kategori: "pensiun",
            });
            notifPensiunCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      pegawaiDiproses: list.length,
      notifikasiKPTerkirim: notifKPCount,
      notifikasiPensiunTerkirim: notifPensiunCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
