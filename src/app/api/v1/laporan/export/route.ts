import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipe = searchParams.get("tipe") || "pegawai";
    const format = searchParams.get("format") || "csv";

    const supabase = await createServerSupabaseClient();
    let dataExport: any[] = [];

    if (tipe === "pegawai") {
      const { data } = await supabase
        .from("pegawai")
        .select("nip, nama_lengkap, status_kepegawaian, golongan, pangkat, email, no_hp, status");
      
      dataExport = data || [];
    }

    if (format === "json") {
      return NextResponse.json(dataExport);
    }

    // Format CSV dengan BOM UTF-8 (\uFEFF) untuk kompatibilitas sempurna Microsoft Excel
    if (dataExport.length === 0) {
      return new NextResponse("\uFEFFNIP;Nama Lengkap;Status;Golongan;Pangkat\n", {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="laporan-${tipe}-${Date.now()}.csv"`,
        },
      });
    }

    const headers = Object.keys(dataExport[0]);
    const csvRows = [headers.join(";")];

    for (const row of dataExport) {
      const values = headers.map((header) => {
        const val = row[header] ?? "";
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(";"));
    }

    const csvContent = "\uFEFF" + csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-${tipe}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
