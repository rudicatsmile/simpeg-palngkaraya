"use client";

import { useRole } from "@/context/RoleContext";
import { RoleEnum } from "@/types";
import { Users, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function RoleSwitcher() {
  const { currentRole, setRole, roleLabels } = useRole();
  const router = useRouter();

  const handleSelectRole = (r: RoleEnum) => {
    setRole(r);
    // Redirect ke dashboard role yang bersangkutan
    switch (r) {
      case "pegawai":
        router.push("/dashboard");
        break;
      case "atasan":
        router.push("/atasan/dashboard");
        break;
      case "kepala_pd":
        router.push("/kepala-pd/dashboard");
        break;
      case "operator":
      case "super_admin":
        router.push("/admin/dashboard");
        break;
      case "pimpinan":
        router.push("/eksekutif/dashboard");
        break;
      case "auditor":
        router.push("/audit/dashboard");
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted/70 transition-colors shadow-xs">
        <Users className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline text-muted-foreground">Peran:</span>
        <span className="font-semibold text-foreground max-w-[140px] truncate">
          {roleLabels[currentRole]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Ganti Konteks Hak Akses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleLabels) as RoleEnum[]).map((r) => {
          const isSelected = currentRole === r;
          return (
            <DropdownMenuItem
              key={r}
              onClick={() => handleSelectRole(r)}
              className="flex items-center justify-between py-2 cursor-pointer text-xs"
            >
              <div className="flex flex-col">
                <span className={isSelected ? "font-bold text-primary" : "text-foreground"}>
                  {roleLabels[r]}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {r.replace("_", " ")}
                </span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
