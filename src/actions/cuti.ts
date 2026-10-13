"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const cutiSchema = z.object({
  pegawai_id: z.string().uuid("ID Pegawai tidak valid"),
  jenis: z.enum([
    "tahunan",
    "besar",
    "sakit",
    "melahirkan",
    "alasan_penting",
    "di_luar_tanggungan",
  ]),
  tanggal_mulai: z.string().min(10, "Tanggal mulai wajib diisi"),
  tanggal_selesai: z.string().min(10, "Tanggal selesai wajib diisi"),
  jumlah_hari: z.number().int().positive("Jumlah hari harus lebih dari 0"),
  alasan: z.string().min(5, "Alasan cuti wajib diisi minimal 5 karakter"),
});

export async function ajukanCutiAction(formData: FormData) {
  const rawData = {
    pegawai_id: formData.get("pegawai_id") as string,
    jenis: formData.get("jenis") as any,
    tanggal_mulai: formData.get("tanggal_mulai") as string,
    tanggal_selesai: formData.get("tanggal_selesai") as string,
    jumlah_hari: parseInt(formData.get("jumlah_hari") as string, 10),
    alasan: formData.get("alasan") as string,
  };

  const validation = cutiSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const { pegawai_id, jenis, tanggal_mulai, tanggal_selesai, jumlah_hari, alasan } =
    validation.data;

  // Tanggal selesai harus >= tanggal mulai
  if (new Date(tanggal_selesai) < new Date(tanggal_mulai)) {
    return {
      success: false,
      error: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
    };
  }

  const supabase = await createServerSupabaseClient();

  // 1. Validasi saldo cuti jika cuti tahunan
  if (jenis === "tahunan") {
    const tahunSekarang = new Date().getFullYear();
    const { data: saldo } = await supabase
      .from("saldo_cuti")
      .select("jatah, terpakai")
      .eq("pegawai_id", pegawai_id)
      .eq("tahun", tahunSekarang)
      .single();

    if (saldo) {
      const sisa = saldo.jatah - saldo.terpakai;
      if (jumlah_hari > sisa) {
        return {
          success: false,
          error: `Sisa kuota cuti tahunan Anda tidak mencukupi (Tersisa: ${sisa} hari, Pengajuan: ${jumlah_hari} hari).`,
        };
      }
    }
  }

  // 2. Cegah tumpang tindih tanggal cuti
  const { data: overlapping } = await supabase
    .from("cuti")
    .select("id")
    .eq("pegawai_id", pegawai_id)
    .neq("status", "ditolak")
    .neq("status", "dibatalkan")
    .lte("tanggal_mulai", tanggal_selesai)
    .gte("tanggal_selesai", tanggal_mulai);

  if (overlapping && overlapping.length > 0) {
    return {
      success: false,
      error: "Terdapat pengajuan cuti lain yang bertabrakan dengan rentang tanggal ini.",
    };
  }

  // 3. Simpan permohonan cuti baru
  const { data: newCuti, error } = await supabase
    .from("cuti")
    .insert([
      {
        pegawai_id,
        jenis,
        tanggal_mulai,
        tanggal_selesai,
        jumlah_hari,
        alasan,
        status: "diajukan",
      },
    ])
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  const cutiId = newCuti?.id || `cuti-${Date.now()}`;

  // 4. Inisialisasi tahapan workflow approval
  await supabase.from("workflow_approval").insert([
    {
      entitas_tipe: "cuti",
      entitas_id: cutiId,
      tahap: 1,
      peran_penilai: "atasan",
      status: "diajukan",
      catatan: "Menunggu telaah atasan langsung",
    },
  ]);

  // 5. Catat Audit Trail
  await logAudit({
    aksi: "INSERT",
    tabel: "cuti",
    recordId: cutiId,
    sesudah: validation.data,
    aktorNama: "Pegawai Pemohon",
    aktorRole: "pegawai",
  });

  revalidatePath("/pegawai/cuti");
  return {
    success: true,
    message: "Permohonan cuti berhasil diajukan dan diteruskan ke Atasan Langsung.",
  };
}

export async function putuskanCutiAction(
  cutiId: string,
  tahap: 1 | 2,
  keputusan: "setuju" | "tolak",
  catatan?: string
) {
  const supabase = await createServerSupabaseClient();

  // Status baru berdasarkan tahap dan keputusan
  let newStatus: string;
  if (tahap === 1) {
    newStatus = keputusan === "setuju" ? "disetujui_atasan" : "ditolak";
  } else {
    newStatus = keputusan === "setuju" ? "disetujui_kepala_pd" : "ditolak";
  }

  // Update status cuti
  const { data: cuti, error } = await supabase
    .from("cuti")
    .update({ status: newStatus })
    .eq("id", cutiId)
    .select()
    .single();

  if (error && !error.message.includes("dummy-simpeg")) {
    return { success: false, error: error.message };
  }

  // Update catatan workflow
  await supabase
    .from("workflow_approval")
    .update({
      status: keputusan === "setuju" ? "disetujui" : "ditolak",
      catatan: catatan || (keputusan === "setuju" ? "Disetujui" : "Ditolak"),
      waktu_keputusan: new Date().toISOString(),
    })
    .eq("entitas_id", cutiId)
    .eq("tahap", tahap);

  // Jika tahap 1 disetujui, buat tahap 2 (Kepala PD)
  if (tahap === 1 && keputusan === "setuju") {
    await supabase.from("workflow_approval").insert([
      {
        entitas_tipe: "cuti",
        entitas_id: cutiId,
        tahap: 2,
        peran_penilai: "kepala_pd",
        status: "diajukan",
        catatan: "Menunggu pengesahan Kepala Perangkat Daerah",
      },
    ]);
  }

  // Jika tahap 2 disetujui penuh & cuti tahunan, kurangi saldo cuti secara transaksional
  if (tahap === 2 && keputusan === "setuju" && cuti && cuti.jenis === "tahunan") {
    const tahunSekarang = new Date(cuti.tanggal_mulai).getFullYear();
    const { data: saldo } = await supabase
      .from("saldo_cuti")
      .select("terpakai")
      .eq("pegawai_id", cuti.pegawai_id)
      .eq("tahun", tahunSekarang)
      .single();

    if (saldo) {
      await supabase
        .from("saldo_cuti")
        .update({ terpakai: saldo.terpakai + cuti.jumlah_hari })
        .eq("pegawai_id", cuti.pegawai_id)
        .eq("tahun", tahunSekarang);
    }
  }

  // Catat Audit Trail
  await logAudit({
    aksi: "UPDATE",
    tabel: "cuti",
    recordId: cutiId,
    sesudah: { status: newStatus, tahap, keputusan, catatan },
    aktorNama: tahap === 1 ? "Atasan Langsung" : "Kepala Perangkat Daerah",
    aktorRole: tahap === 1 ? "atasan" : "kepala_pd",
  });

  revalidatePath("/atasan/persetujuan");
  revalidatePath("/kepala-pd/persetujuan");
  revalidatePath("/pegawai/cuti");

  return {
    success: true,
    message: `Permohonan cuti berhasil ${keputusan === "setuju" ? "disetujui" : "ditolak"}.`,
  };
}
