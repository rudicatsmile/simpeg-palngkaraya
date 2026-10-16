import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndApply() {
  console.log("Checking app_settings columns...");
  const { data, error } = await supabase.from("app_settings").select("*").limit(1);
  if (error) {
    console.error("Error fetching app_settings:", error);
    return;
  }
  console.log("Existing columns in app_settings:", Object.keys(data[0] || {}));
}

checkAndApply();
