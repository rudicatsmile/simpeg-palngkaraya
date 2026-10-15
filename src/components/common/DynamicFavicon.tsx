"use client";

import { useEffect } from "react";
import { useAppSettings } from "@/services/app-settings.service";

/**
 * Komponen untuk memperbarui Favicon browser secara dinamis
 * sesuai dengan konfigurasi favicon_url yang tersimpan di Supabase.
 */
export function DynamicFavicon() {
  const { settings } = useAppSettings();

  useEffect(() => {
    if (!settings?.favicon_url) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = settings.favicon_url;
  }, [settings?.favicon_url]);

  return null;
}
