"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface NotifikasiRealtime {
  id: string;
  judul: string;
  pesan: string;
  tautan?: string;
  kategori: string;
  dibaca: boolean;
  created_at: string;
}

export function useRealtimeNotifikasi(userId?: string) {
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiRealtime[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    // Dengarkan perubahan realtime di tabel notifikasi
    const channel = supabase
      .channel("realtime-notifikasi")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifikasi",
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          const newNotif = payload.new as NotifikasiRealtime;
          setNotifikasiList((prev) => [newNotif, ...prev]);
          setUnreadCount((count) => count + 1);

          // Tampilkan toast pop-up realtime
          toast.info(newNotif.judul, {
            description: newNotif.pesan,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    notifikasiList,
    unreadCount,
    setUnreadCount,
  };
}
