import assert from "node:assert";
import { hitungPrediksiKenaikanPangkat } from "../src/lib/kepangkatan-engine";
import { formatNomorWhatsApp } from "../src/integrations/whatsapp/client";

console.log("=== RUNNING SIMPEG BUSINESS LOGIC TESTS ===");

// 1. Uji Mesin Kepangkatan: TMT 4 Tahun Lalu -> Harusnya memenuhi syarat waktu
const hasilKP = hitungPrediksiKenaikanPangkat("2022-04-01");
assert.ok(hasilKP.tmtPrediksi.includes("2026-04-01") || hasilKP.tmtPrediksi.includes("2026-10-01"), "TMT Prediksi harus pada periode BKN 2026");
console.log("✓ Test 1 Passed: Perhitungan TMT 4 tahun BKN akurat.");

// 2. Uji Mesin Kepangkatan: Blokir sanksi disiplin aktif tingkat sedang/berat
const hasilDisiplin = hitungPrediksiKenaikanPangkat("2022-04-01", [
  { tingkat: "sedang", alasan: "Pelanggaran jam kerja" },
]);
assert.strictEqual(hasilDisiplin.terhambatDisiplin, true, "Harus terhambat jika ada sanksi sedang");
assert.ok(hasilDisiplin.alasanHambatan?.includes("disiplin"), "Alasan hambatan harus menyebutkan disiplin");
console.log("✓ Test 2 Passed: Pemblokiran otomatis akibat hukuman disiplin berhasil.");

// 3. Uji Normalisasi Nomor WhatsApp
assert.strictEqual(formatNomorWhatsApp("081234567890"), "6281234567890", "Format 08 harus menjadi 628");
assert.strictEqual(formatNomorWhatsApp("+6281234567890"), "6281234567890", "Tanda plus harus dibersihkan");
assert.strictEqual(formatNomorWhatsApp("62812-3456-7890"), "6281234567890", "Karakter dash harus dibersihkan");
console.log("✓ Test 3 Passed: Normalisasi nomor WhatsApp gateway valid.");

console.log("=== ALL UNIT TESTS COMPLETED SUCCESSFULLY ===");
