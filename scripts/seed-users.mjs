import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ACCOUNTS = [
  {
    role: "super_admin",
    email: "superadmin@nusantarajaya.go.id",
    nama: "Dr. Budi Santoso, M.Si.",
    pd_id: "d1a1b1c1-0001-4000-8000-000000000001",
    pegawai_id: "e1a1b1c1-0001-4000-8000-000000000001",
  },
  {
    role: "operator",
    email: "operator@nusantarajaya.go.id",
    nama: "Admin Operator BKPSDM",
    pd_id: "d1a1b1c1-0001-4000-8000-000000000001",
    pegawai_id: null,
  },
  {
    role: "kepala_pd",
    email: "kepalapd@nusantarajaya.go.id",
    nama: "Drs. Hendro Wibowo, M.Pd.",
    pd_id: "d1a1b1c1-0002-4000-8000-000000000002",
    pegawai_id: "e1a1b1c1-0003-4000-8000-000000000003",
  },
  {
    role: "atasan",
    email: "atasan@nusantarajaya.go.id",
    nama: "Ahmad Dahlan, S.T., M.Kom.",
    pd_id: "d1a1b1c1-0002-4000-8000-000000000002",
    pegawai_id: "e1a1b1c1-0004-4000-8000-000000000004",
  },
  {
    role: "pegawai",
    email: "pegawai@nusantarajaya.go.id",
    nama: "Dewi Lestari, S.E.",
    pd_id: "d1a1b1c1-0003-4000-8000-000000000003",
    pegawai_id: "e1a1b1c1-0006-4000-8000-000000000006",
  },
  {
    role: "pimpinan",
    email: "eksekutif@nusantarajaya.go.id",
    nama: "Bupati & Sekda Nusantara Jaya",
    pd_id: "d1a1b1c1-0007-4000-8000-000000000007",
    pegawai_id: null,
  },
  {
    role: "auditor",
    email: "auditor@nusantarajaya.go.id",
    nama: "Auditor Inspektorat",
    pd_id: "d1a1b1c1-0006-4000-8000-000000000006",
    pegawai_id: null,
  },
];

async function seed() {
  console.log("Menghubungkan ke Supabase Admin:", supabaseUrl);

  for (const acc of ACCOUNTS) {
    console.log(`Membuat akun auth: ${acc.email} (${acc.role})...`);
    
    // 1. Buat user via Supabase Auth Admin API
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: acc.email,
      password: "Nusantara2026!",
      email_confirm: true,
      user_metadata: {
        nama: acc.nama,
        role: acc.role,
      },
    });

    let userId = userData?.user?.id;

    if (userError) {
      console.warn(`Peringatan untuk ${acc.email}:`, userError.message);
      // Jika user sudah ada, coba cari ID-nya
      continue;
    }

    if (userId) {
      console.log(` -> User Auth ID: ${userId}`);

      // 2. Hubungkan ke user_roles
      const { error: roleErr } = await supabaseAdmin.from("user_roles").upsert(
        {
          user_id: userId,
          role: acc.role,
          pd_id: acc.pd_id,
        },
        { onConflict: "user_id, role, pd_id" }
      );
      if (roleErr) console.error(` -> Error insert user_roles:`, roleErr.message);

      // 3. Hubungkan ke pegawai jika ada
      if (acc.pegawai_id) {
        const { error: pegErr } = await supabaseAdmin
          .from("pegawai")
          .update({ user_id: userId })
          .eq("id", acc.pegawai_id);
        if (pegErr) console.error(` -> Error update pegawai user_id:`, pegErr.message);
      }
    }
  }

  console.log("\nSelesai membuat seluruh akun auth via Admin API!");
}

seed();
