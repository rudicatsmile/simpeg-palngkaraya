"use client";

import { useEffect } from "react";
import { appSettingsService } from "@/services/app-settings.service";

/**
 * Komponen untuk memperbarui Favicon browser secara dinamis
 * sesuai dengan konfigurasi favicon_url yang tersimpan di Supabase.
 */
export function DynamicFavicon() {
  useEffect(() => {
    let isMounted = true;

    async function applyFavicon() {
      try {
        const settings = await appSettingsService.get();
        if (isMounted && settings?.favicon_url) {
          let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.getElementsByTagName("head")[0].appendChild(link);
          }
          link.href = settings.favicon_url;
        }
      } catch {
        // Fallback silently
      }
    }

    applyFavicon();

    const handleUpdate = (e: any) => {
      const url = e?.detail?.favicon_url;
      if (url) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        link.href = url;
      }
    };

    window.addEventListener("app-settings-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("app-settings-updated", handleUpdate);
    };
  }, []);

  return null;
}
