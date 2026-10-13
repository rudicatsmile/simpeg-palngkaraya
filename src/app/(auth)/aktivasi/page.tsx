"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AktivasiPage() {
  const router = useRouter();

  // Wizard step: 1 (NIP & Email), 2 (OTP/Kode), 3 (Password)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [nip, setNip] = useState("198506122010011003");
  const [email, setEmail] = useState("budi.santoso@nusantarajaya.go.id");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Aman"];
  const strengthColors = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (nip.length !== 18) {
      setErrorMsg("NIP wajib 18 digit numerik.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.info("Kode Verifikasi Terkirim!", {
        description: `Kode 6-digit aktivasi telah dikirimkan ke surel resmi ${email}. (Gunakan kode demo: 123456)`,
      });
    }, 600);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (otp.length < 6) {
      setErrorMsg("Masukkan 6 digit kode verifikasi aktivasi.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      toast.success("Verifikasi Berhasil!", {
        description: "Silakan buat kata sandi baru untuk akun Anda.",
      });
    }, 600);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (password.length < 8) {
      setErrorMsg("Kata sandi minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Aktivasi Akun Berhasil!", {
        description: "Akun SIMPEG Daerah Anda kini aktif. Silakan masuk dengan kredensial baru.",
      });
      router.push("/login");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="space-y-3">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground text-center sm:text-left">
          Aktivasi Akun Pegawai
        </h2>
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Verifikasi identitas ASN dan buat kata sandi untuk mengakses layanan mandiri.
        </p>

        {/* Indicator 3 Steps */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </span>
            <span className="text-[11px] font-semibold text-foreground">Verifikasi NIP</span>
          </div>
          <div className="h-0.5 w-8 bg-border" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </span>
            <span className="text-[11px] font-semibold text-foreground">Kode OTP</span>
          </div>
          <div className="h-0.5 w-8 bg-border" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </span>
            <span className="text-[11px] font-semibold text-foreground">Buat Password</span>
          </div>
        </div>
      </div>

      <Card className="border-border shadow-md">
        <CardContent className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LANGKAH 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  NIP (Nomor Induk Pegawai)
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 font-mono"
                    maxLength={18}
                    required
                    placeholder="198506122010011003"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Wajib 18 digit angka resmi BKN.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Resmi Terdaftar
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    className="pl-9"
                    required
                    placeholder="budi.santoso@nusantarajaya.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Surel dinas yang didaftarkan oleh Operator BKPSDM.
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full font-semibold gap-2">
                {loading ? "Memeriksa Data Pegawai..." : "Lanjutkan Verifikasi"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* LANGKAH 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Kode aktivasi telah dikirim ke:</p>
                <p className="text-primary font-mono">{email}</p>
                <p className="text-[11px]">Masukkan kode 6-digit untuk melanjutkan (Demo: 123456).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kode Verifikasi (OTP)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 font-mono text-center tracking-widest text-lg font-bold"
                    maxLength={6}
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 text-xs"
                >
                  Kembali
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 font-semibold gap-2">
                  {loading ? "Memverifikasi..." : "Verifikasi Kode"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* LANGKAH 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-9"
                    required
                    placeholder="Minimal 8 karakter..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Kekuatan Sandi:</span>
                      <span className="font-bold text-foreground">
                        {strengthLabels[strength]}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`rounded-full transition-colors ${
                            strength >= bar ? strengthColors[strength] : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Ulangi Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-9"
                    required
                    placeholder="Ketik ulang kata sandi..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full font-semibold gap-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                {loading ? "Menyimpan Kata Sandi..." : "Selesaikan Aktivasi Akun"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Sudah memiliki akun aktif? <span className="font-semibold text-primary">Masuk di sini</span>
        </Link>
      </div>
    </div>
  );
}
