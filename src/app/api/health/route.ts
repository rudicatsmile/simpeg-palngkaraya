import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatency = 0;

  try {
    const supabase = await createServerSupabaseClient();
    const dbStart = Date.now();
    const { error } = await supabase.from("perangkat_daerah").select("id").limit(1);
    dbLatency = Date.now() - dbStart;

    if (error && !error.message.includes("dummy-simpeg")) {
      dbStatus = "degraded";
    }
  } catch {
    dbStatus = "mocked";
  }

  const memoryUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: "ok",
      version: "1.0.0",
      app: "e-SIMPEG Daerah",
      timestamp: new Date().toISOString(),

      uptime: Math.floor(process.uptime()),
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
      },
      system: {
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      responseTimeMs: Date.now() - startTime,
    },
    { status: 200 }
  );
}
