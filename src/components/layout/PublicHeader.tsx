"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Menu, X, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/fitur", label: "Fitur Unggulan" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/panduan", label: "Panduan" },
    { href: "/kontak", label: "Kontak" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
              SIMPEG Daerah
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                PRO
              </span>
            </span>
            <span className="text-[11px] font-medium text-muted-foreground leading-none">
              Kabupaten Nusantara Jaya
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/verifikasi/d9e8f7a6-b5c4-4d3e-2f1a-0b9c8d7e6f5a"
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Cek QR Pegawai
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/aktivasi">
            <Button variant="outline" size="sm" className="font-medium gap-1.5">
              <UserCheck className="h-4 w-4" />
              Aktivasi Akun
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="font-semibold gap-1.5 shadow-sm">
              Masuk Sistem
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/verifikasi/d9e8f7a6-b5c4-4d3e-2f1a-0b9c8d7e6f5a"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50"
            >
              Verifikasi QR Pegawai
            </Link>
          </div>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link href="/aktivasi" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Aktivasi Akun Pegawai
              </Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center">
                Masuk Sistem
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
