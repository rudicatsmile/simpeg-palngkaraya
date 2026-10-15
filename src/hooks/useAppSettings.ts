"use client";

import { useState, useEffect, useCallback } from "react";
import { appSettingsService, DEFAULT_APP_SETTINGS } from "@/services/app-settings.service";
import { AppSettings } from "@/types";

/**
 * React Hook untuk mengakses dan memantau atribut konfigurasi aplikasi secara reaktif.
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appSettingsService.get();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listener custom event untuk sinkronisasi instan antar komponen saat admin menyimpan data
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        fetchSettings();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("app-settings-updated", handleUpdate);
      return () => {
        window.removeEventListener("app-settings-updated", handleUpdate);
      };
    }
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };
}
