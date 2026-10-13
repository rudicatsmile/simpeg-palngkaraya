"use client";

import React, { useState } from "react";
import { 
  Users, UserPlus, Shield, Building2, Search, Filter, 
  MoreVertical, CheckCircle2, XCircle, KeyRound, Mail, RefreshCw, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { usePerangkatDaerahList, usePegawaiList } from "@/services";
import { UserRole } from "@/types";
import { toast } from "sonner";

interface UserAccount {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: UserRole;
  pdScope: string;
  isActive: boolean;
  lastLogin: string;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-1",
    name: "Dr. Budi Santoso, M.Si.",
    nip: "197805122002121003",
    email: "budi.santoso@nusantarajaya.go.id",
    role: "admin",
    pdScope: "Semua Perangkat Daerah (Global)",
    isActive: true,
    lastLogin: "12 Okt 2026, 14:20 WIB"
  },
  {
    id: "usr-2",
    name: "Siti Rahmawati, S.Sos.",
    nip: "198503152009032008",
    email: "siti.rahmawati@nusantarajaya.go.id",
    role: "operator_pd",
    pdScope: "Dinas Pendidikan",
    isActive: true,
    lastLogin: "12 Okt 2026, 11:05 WIB"
  },
  {
    id: "usr-3",
    name: "Drs. Hendro Wibowo, M.Pd.",
    nip: "197108201995121001",
    email: "hendro.wibowo@nusantarajaya.go.id",
    role: "kepala_pd",
    pdScope: "Dinas Pendidikan",
    isActive: true,
    lastLogin: "11 Okt 2026, 09:30 WIB"
  },
  {
    id: "usr-4",
    name: "Ahmad Dahlan, S.T., M.Kom.",
    nip: "198204102005011004",
    email: "ahmad.dahlan@nusantarajaya.go.id",
    role: "atasan",
    pdScope: "Dinas Pendidikan (Bidang Ketenagaan)",
    isActive: true,
    lastLogin: "12 Okt 2026, 13:45 WIB"
  },
  {
    id: "usr-5",
    name: "H. Joko Purnomo, S.IP.",
    nip: "196611051991031002",
    email: "joko.purnomo@nusantarajaya.go.id",
    role: "pegawai",
    pdScope: "Dinas Kesehatan",
    isActive: true,
    lastLogin: "08 Okt 2026, 16:10 WIB"
  },
  {
    id: "usr-6",
    name: "Dewi Lestari, S.E.",
    nip: "199402282019032007",
    email: "dewi.lestari@nusantarajaya.go.id",
    role: "pegawai",
    pdScope: "Dinas Kesehatan",
    isActive: true,
    lastLogin: "12 Okt 2026, 08:00 WIB"
  },
  {
    id: "usr-7",
    name: "Ir. H. Raden Mas Bagus, M.Eng.",
    nip: "196801011993031005",
    email: "sekda@nusantarajaya.go.id",
    role: "pimpinan_tinggi",
    pdScope: "Pemerintah Kabupaten (Sekretariat Daerah)",
    isActive: true,
    lastLogin: "10 Okt 2026, 10:15 WIB"
  },
  {
    id: "usr-8",
    name: "Rudi Hartono, S.H., CFrA.",
    nip: "197509141999031002",
    email: "inspektorat.rudi@nusantarajaya.go.id",
    role: "auditor",
    pdScope: "Inspektorat Daerah",
    isActive: true,
    lastLogin: "12 Okt 2026, 15:10 WIB"
  }
];

export default function ManajemenPenggunaPage() {
  const { data: pdList } = usePerangkatDaerahList();
  const { data: pegawaiList } = usePegawaiList();
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Form states
  const [inviteNip, setInviteNip] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("pegawai");
  const [invitePd, setInvitePd] = useState("Dinas Pendidikan");

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.nip.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="bg-rose-600 font-semibold">Admin BKPSDM</Badge>;
      case "operator_pd":
        return <Badge className="bg-indigo-600">Operator PD</Badge>;
      case "kepala_pd":
        return <Badge className="bg-blue-600">Kepala Perangkat Daerah</Badge>;
      case "atasan":
        return <Badge className="bg-amber-600">Atasan Langsung</Badge>;
      case "pimpinan_tinggi":
        return <Badge className="bg-purple-600">Bupati / Sekda</Badge>;
      case "auditor":
        return <Badge className="bg-emerald-600">Auditor Inspektorat</Badge>;
      default:
        return <Badge variant="secondary">Pegawai ASN</Badge>;
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteNip || !inviteEmail) {
      toast.error("NIP dan Email wajib diisi");
      return;
    }
    const matched = pegawaiList.find((p) => p.nip === inviteNip);
    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      name: matched ? (matched.nama_lengkap || "ASN Baru") : "ASN Baru",
      nip: inviteNip,
      email: inviteEmail,
      role: inviteRole,
      pdScope: invitePd,
      isActive: true,
      lastLogin: "Belum pernah login"
    };

    setUsers([newAccount, ...users]);
    toast.success(`Aktivasi undangan akun berhasil dikirim ke ${inviteEmail}`);
    setIsInviteOpen(false);
    setInviteNip("");
    setInviteEmail("");
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    toast.success(`Hak akses akun ${selectedUser.name} berhasil diperbarui.`);
    setIsEditRoleOpen(false);
  };

  const handleToggleStatus = (user: UserAccount) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    toast.info(`Status akun ${user.name} diubah menjadi ${!user.isActive ? "Aktif" : "Dinonaktifkan"}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Pengguna & RBAC</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pengelolaan autentikasi akun, peran sistem (7 Role SIMPEG), dan pembatasan lingkup unit kerja (PD Scope).
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsInviteOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Undang Akun Pegawai
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Akun Terdaftar</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">100% Akun ASN Terverifikasi</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Administrator BKPSDM</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {users.filter(u => u.role === "admin").length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Hak akses penuh (Global)</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Shield className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Operator Perangkat Daerah</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {users.filter(u => u.role === "operator_pd").length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Terikat Scope PD</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Pengawas & Eksekutif</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {users.filter(u => u.role === "pimpinan_tinggi" || u.role === "auditor").length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Bupati, Sekda & Auditor</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <KeyRound className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Daftar Akun Pengguna</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Daftar ASN yang memiliki hak akses sistem e-SIMPEG Daerah.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Cari nama, NIP, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 h-9"
              >
                <option value="all">Semua Peran</option>
                <option value="admin">Admin BKPSDM</option>
                <option value="operator_pd">Operator PD</option>
                <option value="kepala_pd">Kepala PD</option>
                <option value="atasan">Atasan Langsung</option>
                <option value="pegawai">Pegawai</option>
                <option value="pimpinan_tinggi">Pimpinan Tinggi</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Nama Pegawai & NIP</th>
                  <th className="py-3 px-4">Email Dinas</th>
                  <th className="py-3 px-4">Peran (RBAC)</th>
                  <th className="py-3 px-4">Lingkup Unit Kerja (Scope)</th>
                  <th className="py-3 px-4">Login Terakhir</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ditemukan akun yang sesuai pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{user.nip}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate" title={user.pdScope}>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{user.pdScope}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {user.lastLogin}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditRoleOpen(true);
                            }}
                          >
                            Atur Peran
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-7 w-7 p-0 ${user.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                            title={user.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Undang Pengguna Baru */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Undang / Daftarkan Akun ASN</DialogTitle>
            <DialogDescription>
              Kirimkan instruksi aktivasi akun ke email dinas pegawai bersangkutan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">NIP Pegawai *</label>
              <Input
                placeholder="18 digit NIP..."
                value={inviteNip}
                onChange={(e) => setInviteNip(e.target.value)}
                maxLength={18}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Data nama pegawai akan otomatis disinkronkan dari database kepegawaian.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Kedinasan *</label>
              <Input
                type="email"
                placeholder="nama@nusantarajaya.go.id"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Peran Akses (RBAC) *</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              >
                <option value="pegawai">Pegawai ASN (Default)</option>
                <option value="atasan">Atasan Langsung (Penilai SKP)</option>
                <option value="operator_pd">Operator Perangkat Daerah</option>
                <option value="kepala_pd">Kepala Perangkat Daerah</option>
                <option value="admin">Administrator BKPSDM</option>
                <option value="pimpinan_tinggi">Pimpinan Tinggi (Bupati / Sekda)</option>
                <option value="auditor">Auditor Inspektorat</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lingkup Perangkat Daerah (PD Scope) *</label>
              <select
                value={invitePd}
                onChange={(e) => setInvitePd(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              >
                <option value="Semua Perangkat Daerah (Global)">Semua Perangkat Daerah (Global Admin)</option>
                {pdList.map((inst) => (
                  <option key={inst.id} value={inst.nama}>{inst.nama}</option>
                ))}
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                Kirim Tautan Aktivasi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Atur Peran & Scope */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Peran & Lingkup Akses</DialogTitle>
            <DialogDescription>
              Penyesuaian otorisasi RBAC dan pembatasan data unit kerja untuk pegawai ini.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-900 text-sm">{selectedUser.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{selectedUser.nip}</div>
                <div className="text-xs text-indigo-600 font-mono mt-0.5">{selectedUser.email}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Peran Sistem (Role)</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
                >
                  <option value="pegawai">Pegawai ASN</option>
                  <option value="atasan">Atasan Langsung</option>
                  <option value="operator_pd">Operator Perangkat Daerah</option>
                  <option value="kepala_pd">Kepala Perangkat Daerah</option>
                  <option value="admin">Administrator BKPSDM</option>
                  <option value="pimpinan_tinggi">Pimpinan Tinggi (Bupati / Sekda)</option>
                  <option value="auditor">Auditor Inspektorat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Lingkup Unit Kerja (PD Scope)</label>
                <select
                  value={selectedUser.pdScope}
                  onChange={(e) => setSelectedUser({ ...selectedUser, pdScope: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
                >
                  <option value="Semua Perangkat Daerah (Global)">Semua Perangkat Daerah (Global / Admin)</option>
                  {pdList.map((inst) => (
                    <option key={inst.id} value={inst.nama}>{inst.nama}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Operator PD dan Kepala PD hanya dapat memvalidasi dan memantau ASN yang bertugas di dalam unit kerjanya.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdateRole} className="bg-indigo-600 hover:bg-indigo-700">
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
