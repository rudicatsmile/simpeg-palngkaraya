"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { createClient } from "@/lib/supabase/client";
import { RoleSwitcher } from "./RoleSwitcher";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Shield,
  CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRealtimeNotifikasi } from "@/hooks/useRealtimeNotifikasi";

import { useNotifikasiList } from "@/services";

export function DashboardHeader({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const router = useRouter();
  const { userProfile, currentRole, roleLabels } = useRole();
  const { unreadCount } = useRealtimeNotifikasi();
  const { data: notifList } = useNotifikasiList();
  const [unreadNotifs, setUnreadNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (notifList && notifList.length > 0) {
      setUnreadNotifs(notifList.filter((n) => !n.dibaca_at));
    }
  }, [notifList]);

  const totalUnreadCount = unreadNotifs.length + unreadCount;

  const markAllRead = () => {
    setUnreadNotifs([]);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 px-4 sm:px-6 backdrop-blur-md">
      {/* Kiri: Tombol mobile menu & search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex lg:hidden p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka Menu</span>
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pegawai (NIP / Nama), modul, usulan..."
            className="h-9 w-full rounded-lg border border-border bg-muted/40 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Kanan: RoleSwitcher, Notifikasi, Avatar Pengguna */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Lonceng Notifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-card animate-pulse">
                {totalUnreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl">
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-semibold text-foreground">
                  Pemberitahuan
                </span>
                {totalUnreadCount > 0 && (
                  <Badge variant="diajukan" className="text-[10px] px-1.5">
                    {totalUnreadCount} Baru
                  </Badge>
                )}
              </div>
              {unreadNotifs.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="h-3 w-3" />
                  Tandai Dibaca
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
              {(notifList || []).map((item) => (
                <Link
                  key={item.id}
                  href={item.tautan || "/pegawai/notifikasi"}
                  className="flex flex-col gap-1 p-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-primary">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Baru saja
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {item.judul}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {item.pesan}
                  </p>
                </Link>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <Link
                href="/pegawai/notifikasi"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Lihat Semua Notifikasi →
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 pl-1 rounded-lg hover:bg-muted/50 p-1 transition-colors">
            <Avatar className="h-8 w-8 ring-1 ring-border">
              <AvatarFallback>
                {userProfile.nama
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground max-w-[150px] truncate leading-tight">
                {userProfile.nama}
              </span>
              <span className="text-[10px] text-muted-foreground truncate leading-tight">
                {userProfile.nip}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="px-2 py-1.5 border-b border-border mb-1">
              <p className="text-xs font-bold text-foreground truncate">{userProfile.nama}</p>
              <p className="text-[11px] text-muted-foreground truncate">{userProfile.jabatan}</p>
              <div className="mt-1">
                <Badge variant="outline" className="text-[10px] font-normal">
                  {roleLabels[currentRole]}
                </Badge>
              </div>
            </div>

            <DropdownMenuItem asChild>
              <Link href="/pegawai/profil" className="flex items-center gap-2 text-xs">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Profil Pegawai</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/pegawai/pengaturan" className="flex items-center gap-2 text-xs">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Pengaturan Akun</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="flex items-center gap-2 text-xs text-rose-600 focus:text-rose-600 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar (Logout)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
