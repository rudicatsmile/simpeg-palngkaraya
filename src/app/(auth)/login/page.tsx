"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { RoleEnum } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthCopyrightFooter } from "@/components/auth/AuthBranding";
import { useAppSettings } from "@/hooks/useAppSettings";


function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const { setRole } = useRole();
  const { settings } = useAppSettings();

  const [email, setEmail] = useState("superadmin@palangkaraya.go.id");
  const [password, setPassword] = useState("Admin2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      if (!cleanEmail.includes("@")) {
        setErrorMsg("Format email resmi tidak valid. Gunakan format nama@instansi.go.id");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Kata sandi minimal 6 karakter.");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Autentikasi langsung ke Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setLoading(false);
        const translatedMsg =
          error.message === "Invalid login credentials"
            ? "Email atau kata sandi tidak sesuai. Pastikan akun sudah di-seed dan terdaftar."
            : error.message;
        setErrorMsg(translatedMsg);
        toast.error("Gagal Masuk ke SIMPEG", {
          description: translatedMsg,
        });
        return;
      }

      // Deteksi peran pengguna dari database user_roles
      let detectedRole: RoleEnum = "pegawai";
      if (data?.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (roleData?.role) {
          detectedRole = roleData.role as RoleEnum;
        } else if (cleanEmail.includes("superadmin")) {
          detectedRole = "super_admin";
        } else if (cleanEmail.includes("operator")) {
          detectedRole = "operator";
        } else if (cleanEmail.includes("kepalapd")) {
          detectedRole = "kepala_pd";
        } else if (cleanEmail.includes("atasan")) {
          detectedRole = "atasan";
        } else if (cleanEmail.includes("eksekutif")) {
          detectedRole = "pimpinan";
        } else if (cleanEmail.includes("auditor")) {
          detectedRole = "auditor";
        }
      }

      setRole(detectedRole);

      toast.success("Autentikasi Berhasil!", {
        description: `Selamat datang di SIMPEG ${settings.nama_pemda || "Pemerintah Daerah"}. Masuk sebagai ${detectedRole.toUpperCase()}.`,
      });

      // Tentukan rute dashboard tujuan sesuai peran atau query param `next`
      let targetRoute = "/dashboard";
      if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("/login")) {
        targetRoute = nextParam;
      } else {
        if (detectedRole === "super_admin" || detectedRole === "operator") {
          targetRoute = "/admin/dashboard";
        } else if (detectedRole === "atasan") {
          targetRoute = "/atasan/dashboard";
        } else if (detectedRole === "kepala_pd") {
          targetRoute = "/kepala-pd/dashboard";
        } else if (detectedRole === "pimpinan") {
          targetRoute = "/eksekutif/dashboard";
        } else if (detectedRole === "auditor") {
          targetRoute = "/audit/dashboard";
        } else {
          targetRoute = "/dashboard";
        }
      }

      router.refresh();
      router.push(targetRoute);
    } catch (err: unknown) {
      setLoading(false);
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan koneksi autentikasi.";
      setErrorMsg(errMsg);
      toast.error("Kesalahan Sistem", { description: errMsg });
    }
  };

  const setDemoRole = (role: RoleEnum, demoEmail: string) => {
    setRole(role);
    setEmail(demoEmail);
    setPassword("Nusantara2026!");
    setErrorMsg("");
    toast.info(`Kredensial disetel ke: ${demoEmail}`, {
      description: "Klik 'Masuk ke Sistem' untuk login dengan akun ini.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center sm:text-left space-y-1">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Masuk ke Akun Anda
        </h2>
        <p className="text-xs text-muted-foreground">
          Masukkan email resmi dan kata sandi yang telah terdaftar pada sistem SIMPEG.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardContent className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Email Resmi Instansi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-9"
                  placeholder="superadmin@nusantarajaya.go.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Kata Sandi
                </label>
                <Link
                  href="/lupa-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-9"
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold gap-2 shadow-sm"
            >
              {loading ? "Memverifikasi ke Supabase..." : "Masuk ke Sistem"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Demo Role Shortcuts */}
          <div className="pt-2 border-t border-border">
            <p className="text-[11px] font-semibold text-muted-foreground mb-2">
              Pintasan Kredensial Uji Coba (7 Role):
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setDemoRole("super_admin", "superadmin@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                ⚙️ Super Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("operator", "operator@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                🛠️ Operator BKPSDM
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("kepala_pd", "kepalapd@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                🏢 Kepala Dinas (PD)
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("atasan", "atasan@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                👔 Atasan Langsung
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("pegawai", "pegawai@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                👤 Pegawai ASN
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("pimpinan", "eksekutif@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate"
              >
                📊 Bupati / Sekda
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("auditor", "auditor@nusantarajaya.go.id")}
                className="rounded-md border border-border p-1.5 text-left hover:bg-muted font-medium truncate col-span-2"
              >
                🔍 Auditor Inspektorat
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Belum mengaktifkan akun pegawai baru?
        </p>
        <Link href="/aktivasi">
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-medium">
            <UserCheck className="h-4 w-4 text-primary" />
            Aktivasi Akun Menggunakan NIP
          </Button>
        </Link>
      </div>

      <div className="text-center pt-2">
        <AuthCopyrightFooter className="text-muted-foreground/80" />
      </div>
    </div>
  );

}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
          Memuat formulir autentikasi...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
