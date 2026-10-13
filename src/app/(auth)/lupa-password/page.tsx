"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Format email tidak valid");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Instruksi Reset Terkirim!", {
        description: `Tautan pengaturan ulang kata sandi telah dikirim ke ${email}.`,
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left space-y-1">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Lupa Kata Sandi
        </h2>
        <p className="text-xs text-muted-foreground">
          Masukkan alamat surel resmi yang terdaftar untuk menerima tautan pemulihan kata sandi.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardContent className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-foreground">
                  Periksa Kotak Masuk Email Anda
                </h3>
                <p className="text-xs text-muted-foreground">
                  Kami telah mengirimkan petunjuk reset kata sandi ke <strong>{email}</strong>.
                  Tautan berlaku selama 60 menit.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/reset-password">
                  <Button className="w-full text-xs font-semibold">
                    Lanjut ke Halaman Buat Password Baru (Demo) →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="nama@nusantarajaya.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full font-semibold">
                {loading ? "Mengirim Tautan..." : "Kirim Tautan Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Masuk</span>
        </Link>
      </div>
    </div>
  );
}
