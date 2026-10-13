"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RoleEnum } from "@/types";

interface RoleContextType {
  currentRole: RoleEnum;
  setRole: (role: RoleEnum) => void;
  roleLabels: Record<RoleEnum, string>;
  userProfile: {
    nama: string;
    nip: string;
    jabatan: string;
    pd: string;
  };
}

const roleLabels: Record<RoleEnum, string> = {
  super_admin: "Super Admin (BKPSDM)",
  operator: "Operator Kepegawaian",
  kepala_pd: "Kepala Perangkat Daerah",
  atasan: "Atasan Langsung",
  pegawai: "Pegawai ASN (Budi Santoso)",
  pimpinan: "Pimpinan Tinggi (Bupati / Sekda)",
  auditor: "Auditor (Inspektorat)",
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleEnum>("pegawai");

  useEffect(() => {
    const saved = localStorage.getItem("simpeg_active_role");
    if (saved && saved in roleLabels) {
      setCurrentRole(saved as RoleEnum);
    }
  }, []);

  const setRole = (role: RoleEnum) => {
    setCurrentRole(role);
    localStorage.setItem("simpeg_active_role", role);
  };

  const userProfile = {
    nama:
      currentRole === "pegawai"
        ? "Dr. Budi Santoso, S.E., M.M."
        : currentRole === "atasan"
        ? "Drs. H. Suryadi, M.Si."
        : currentRole === "kepala_pd"
        ? "Drs. H. Suryadi, M.Si."
        : currentRole === "super_admin"
        ? "Ir. Hendra Gunawan, M.T."
        : currentRole === "operator"
        ? "Siti Nurhaliza, S.Kom."
        : currentRole === "pimpinan"
        ? "H. Mochammad Ridwan, S.H., M.Si."
        : "Drs. Wahyudi, Ak., CA (Auditor Utama)",
    nip:
      currentRole === "pegawai"
        ? "198506122010011003"
        : currentRole === "atasan" || currentRole === "kepala_pd"
        ? "196804151994031005"
        : currentRole === "super_admin"
        ? "197005181996031002"
        : "198902142013022001",
    jabatan:
      currentRole === "pegawai"
        ? "Kepala Seksi Pembinaan SMP"
        : currentRole === "atasan" || currentRole === "kepala_pd"
        ? "Kepala Dinas Pendidikan & Kebudayaan"
        : currentRole === "super_admin"
        ? "Kepala BKPSDM Kabupaten Nusantara Jaya"
        : currentRole === "operator"
        ? "Staf Pengelola Sistem Kepegawaian"
        : currentRole === "pimpinan"
        ? "Sekretaris Daerah"
        : "Inspektur Pembantu Wilayah I",
    pd:
      currentRole === "pegawai" || currentRole === "atasan" || currentRole === "kepala_pd"
        ? "Dinas Pendidikan dan Kebudayaan"
        : currentRole === "super_admin" || currentRole === "operator"
        ? "BKPSDM Kabupaten Nusantara Jaya"
        : currentRole === "pimpinan"
        ? "Sekretariat Daerah"
        : "Inspektorat Daerah",
  };

  return (
    <RoleContext.Provider
      value={{ currentRole, setRole, roleLabels, userProfile }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
