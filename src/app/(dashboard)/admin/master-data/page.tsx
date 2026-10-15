"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Edit2,
  Trash2,
  RefreshCw,
  Sliders,
  Layers,
  Sparkles,
  Tag,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMasterReferensi } from "@/hooks/useMasterReferensi";
import { masterService, MASTER_KATEGORI_LIST } from "@/services/master.service";
import { MasterReferensi } from "@/types";

const COLOR_OPTIONS = [
  { value: "slate", label: "Abu-abu (Slate)", bg: "bg-slate-100 text-slate-700 border-slate-300" },
  { value: "blue", label: "Biru (Blue)", bg: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "emerald", label: "Hijau (Emerald)", bg: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "amber", label: "Kuning (Amber)", bg: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "rose", label: "Merah (Rose)", bg: "bg-rose-100 text-rose-700 border-rose-300" },
  { value: "indigo", label: "Indigo (Indigo)", bg: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  { value: "violet", label: "Ungu (Violet)", bg: "bg-violet-100 text-violet-700 border-violet-300" },
  { value: "cyan", label: "Sian (Cyan)", bg: "bg-cyan-100 text-cyan-700 border-cyan-300" },
  { value: "teal", label: "Toska (Teal)", bg: "bg-teal-100 text-teal-700 border-teal-300" },
  { value: "orange", label: "Oranye (Orange)", bg: "bg-orange-100 text-orange-700 border-orange-300" },
];

export default function MasterDataAdminPage() {
  const { allItems, kategoriList, loading, refresh } = useMasterReferensi();

  // Filter States
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyActive, setOnlyActive] = useState<boolean>(false);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterReferensi | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formKategori, setFormKategori] = useState("status_pegawai");
  const [formKode, setFormKode] = useState("");
  const [formNama, setFormNama] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formUrutan, setFormUrutan] = useState<number>(1);
  const [formBadgeColor, setFormBadgeColor] = useState("slate");
  const [formIsActive, setFormIsActive] = useState(true);

  // Filtered List
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchKategori = selectedKategori === "all" || item.kategori === selectedKategori;
      const matchActive = !onlyActive || item.is_active;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        item.nama.toLowerCase().includes(query) ||
        item.kode.toLowerCase().includes(query) ||
        (item.deskripsi || "").toLowerCase().includes(query) ||
        item.kategori.toLowerCase().includes(query);

      return matchKategori && matchActive && matchQuery;
    });
  }, [allItems, selectedKategori, onlyActive, searchQuery]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    const total = allItems.length;
    const active = allItems.filter((i) => i.is_active).length;
    const system = allItems.filter((i) => i.is_system).length;
    const custom = total - system;
    return { total, active, system, custom };
  }, [allItems]);

  // Buka Modal Tambah
  const handleOpenCreate = () => {
    setFormKategori(selectedKategori !== "all" ? selectedKategori : "status_pegawai");
    setFormKode("");
    setFormNama("");
    setFormDeskripsi("");
    setFormUrutan(filteredItems.length + 1);
    setFormBadgeColor("blue");
    setFormIsActive(true);
    setIsCreateOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEdit = (item: MasterReferensi) => {
    setSelectedItem(item);
    setFormKategori(item.kategori);
    setFormKode(item.kode);
    setFormNama(item.nama);
    setFormDeskripsi(item.deskripsi || "");
    setFormUrutan(item.urutan || 1);
    setFormBadgeColor(item.badge_color || "slate");
    setFormIsActive(item.is_active);
    setIsEditOpen(true);
  };

  // Simpan Data Baru
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKode.trim() || !formNama.trim()) {
      toast.error("Kode dan Nama label wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await masterService.createReferensi({
        kategori: formKategori,
        kode: formKode,
        nama: formNama,
        deskripsi: formDeskripsi,
        urutan: Number(formUrutan) || 1,
        badge_color: formBadgeColor,
        is_active: formIsActive,
        is_system: false,
        metadata: {},
      });

      if (res.success) {
        toast.success("Master Referensi Berhasil Ditambahkan!", {
          description: `Item '${formNama}' telah tersimpan di kategori '${formKategori}'.`,
        });
        setIsCreateOpen(false);
        refresh();
      } else {
        toast.error("Gagal menambahkan:", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan:", { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Simpan Perubahan Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !formNama.trim()) return;

    try {
      setSubmitting(true);
      const res = await masterService.updateReferensi(selectedItem.id, {
        nama: formNama.trim(),
        deskripsi: formDeskripsi.trim(),
        urutan: Number(formUrutan) || 1,
        badge_color: formBadgeColor,
        is_active: formIsActive,
      });

      if (res.success) {
        toast.success("Perubahan Berhasil Disimpan!", {
          description: `Item '${formNama}' telah diperbarui.`,
        });
        setIsEditOpen(false);
        refresh();
      } else {
        toast.error("Gagal memperbarui:", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan:", { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Aktif / Nonaktif
  const handleToggleActive = async (item: MasterReferensi) => {
    try {
      const nextState = !item.is_active;
      const res = await masterService.toggleActiveReferensi(item.id, nextState);
      if (res.success) {
        toast.success(
          nextState
            ? `Item '${item.nama}' telah diaktifkan`
            : `Item '${item.nama}' dinonaktifkan`
        );
        refresh();
      } else {
        toast.error("Gagal mengubah status:", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Error:", { description: err?.message });
    }
  };

  // Hapus Data
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      setSubmitting(true);
      const res = await masterService.deleteReferensi(selectedItem.id);
      if (res.success) {
        toast.success(`Item '${selectedItem.nama}' berhasil dihapus.`);
        setIsDeleteOpen(false);
        refresh();
      } else {
        toast.error("Gagal menghapus:", { description: res.error });
      }
    } catch (err: any) {
      toast.error("Error:", { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper render badge dinamis
  const renderItemBadge = (item: MasterReferensi) => {
    const colorClass =
      COLOR_OPTIONS.find((c) => c.value === item.badge_color)?.bg ||
      "bg-slate-100 text-slate-700 border-slate-300";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {item.nama}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Database className="h-5 w-5" />
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Master Data & Referensi Terpusat
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola seluruh opsi status, jenis, klasifikasi, dan parameter sistem yang terhubung langsung dengan Supabase PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refresh();
              toast.info("Data referensi disinkronkan ulang dengan database.");
            }}
            className="gap-1.5 text-xs font-medium"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sinkronkan
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Opsi Baru
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Referensi</span>
            <Tag className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">{stats.total}</div>
          <span className="text-[11px] text-muted-foreground">Tersebar di {kategoriList.length} kategori</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Status Aktif</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{stats.active}</div>
          <span className="text-[11px] text-muted-foreground">Digunakan dalam form</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Bawaan Sistem</span>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.system}</div>
          <span className="text-[11px] text-muted-foreground">Terproteksi dari penghapusan</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Opsi Kustom</span>
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{stats.custom}</div>
          <span className="text-[11px] text-muted-foreground">Ditambahkan oleh admin</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border">
        <CardHeader className="pb-4 border-b border-border/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Daftar Master Referensi
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Pilih kategori master untuk menyaring dan mengontrol opsi yang muncul pada seluruh modul.
              </CardDescription>
            </div>

            {/* Filter Tools */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Selector */}
              <div className="relative min-w-[200px]">
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">Semua Kategori ({allItems.length})</option>
                  {kategoriList.map((kat) => {
                    const count = allItems.filter((i) => i.kategori === kat.kategori).length;
                    return (
                      <option key={kat.kategori} value={kat.kategori}>
                        {kat.nama} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Cari kode atau label..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>

              {/* Toggle Aktif Filter */}
              <button
                type="button"
                onClick={() => setOnlyActive(!onlyActive)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  onlyActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                Hanya Aktif
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Kategori Master</TableHead>
                  <TableHead className="text-xs font-semibold">Kode Referensi</TableHead>
                  <TableHead className="text-xs font-semibold">Nama / Label</TableHead>
                  <TableHead className="text-xs font-semibold">Visual Preview</TableHead>
                  <TableHead className="text-xs font-semibold">Deskripsi</TableHead>
                  <TableHead className="text-center text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-center text-xs font-semibold">Tipe</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                        <p>Tidak ada data referensi yang cocok dengan filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const kategoriInfo = kategoriList.find((k) => k.kategori === item.kategori);

                    return (
                      <TableRow key={item.id} className="hover:bg-muted/30 text-xs">
                        {/* Urutan */}
                        <TableCell className="text-center font-mono text-muted-foreground">
                          {item.urutan}
                        </TableCell>

                        {/* Kategori */}
                        <TableCell>
                          <span className="font-semibold text-foreground block">
                            {kategoriInfo?.nama || item.kategori}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {item.kategori}
                          </span>
                        </TableCell>

                        {/* Kode */}
                        <TableCell>
                          <code className="px-2 py-0.5 rounded bg-muted font-mono text-[11px] text-primary font-semibold">
                            {item.kode}
                          </code>
                        </TableCell>

                        {/* Nama */}
                        <TableCell className="font-medium text-foreground">{item.nama}</TableCell>

                        {/* Visual Preview */}
                        <TableCell>{renderItemBadge(item)}</TableCell>

                        {/* Deskripsi */}
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {item.deskripsi || "-"}
                        </TableCell>

                        {/* Status Aktif */}
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            title={item.is_active ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                            className="inline-flex items-center cursor-pointer transition-transform active:scale-95"
                          >
                            {item.is_active ? (
                              <Badge variant="success" className="cursor-pointer gap-1 text-[11px]">
                                <CheckCircle2 className="h-3 w-3" /> Aktif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="cursor-pointer gap-1 text-[11px] text-muted-foreground">
                                <XCircle className="h-3 w-3" /> Nonaktif
                              </Badge>
                            )}
                          </button>
                        </TableCell>

                        {/* Tipe: Sistem vs Kustom */}
                        <TableCell className="text-center">
                          {item.is_system ? (
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                              <ShieldCheck className="h-3 w-3 text-blue-600" /> Sistem
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                              Kustom
                            </Badge>
                          )}
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(item)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              title="Edit item"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (item.is_system) {
                                  toast.warning("Proteksi Sistem", {
                                    description:
                                      "Item bawaan sistem tidak boleh dihapus. Anda dapat menonaktifkannya jika tidak digunakan.",
                                  });
                                  return;
                                }
                                setSelectedItem(item);
                                setIsDeleteOpen(true);
                              }}
                              disabled={item.is_system}
                              className={`h-7 w-7 p-0 ${
                                item.is_system
                                  ? "text-muted-foreground/30 cursor-not-allowed"
                                  : "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              }`}
                              title={item.is_system ? "Item sistem terlindungi" : "Hapus item"}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH REFERENSI BARU */}
      {/* ========================================================================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <form onSubmit={handleCreateSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Plus className="h-4 w-4 text-primary" />
              Tambah Opsi Master Referensi Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tambahkan nilai pilihan baru ke database. Nilai baru langsung dapat digunakan pada seluruh form aplikasi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Kategori */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Kategori Master <span className="text-rose-500">*</span>
              </label>
              <select
                value={formKategori}
                onChange={(e) => setFormKategori(e.target.value)}
                className="w-full text-xs font-medium rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {kategoriList.map((kat) => (
                  <option key={kat.kategori} value={kat.kategori}>
                    {kat.nama} ({kat.kategori})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">
                Modul atau fitur tujuan opsi referensi ini.
              </p>
            </div>

            {/* Kode & Urutan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Kode Database <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: cuti_studi"
                  value={formKode}
                  onChange={(e) => setFormKode(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Gunakan huruf kecil dan garis bawah (tanpa spasi).
                </p>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Urutan Tampilan (Nomor)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formUrutan}
                  onChange={(e) => setFormUrutan(parseInt(e.target.value) || 1)}
                  className="text-xs"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Posisi saat ditampilkan di menu dropdown.
                </p>
              </div>
            </div>

            {/* Nama / Label */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Nama / Label Tampilan <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Cuti Tugas Belajar"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                className="text-xs"
                required
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Teks resmi yang dibaca oleh pegawai dan pengguna aplikasi.
              </p>
            </div>

            {/* Warna Badge Visual */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Warna Badge Tampilan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setFormBadgeColor(col.value)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all ${
                      formBadgeColor === col.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border ${col.bg.split(" ")[0]} border-current`}
                    />
                    <span className="truncate">{col.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Deskripsi / Keterangan
              </label>
              <Input
                placeholder="Penjelasan aturan atau ketentuan singkat..."
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Switch Aktif */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div>
                <span className="font-semibold text-foreground block text-xs">Aktifkan Langsung</span>
                <span className="text-[11px] text-muted-foreground">
                  Opsi ini dapat langsung dipilih pada formulir transaksi.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              disabled={submitting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {submitting ? "Menyimpan..." : "Simpan Referensi"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT REFERENSI */}
      {/* ========================================================================= */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <form onSubmit={handleEditSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Edit2 className="h-4 w-4 text-primary" />
              Edit Master Referensi: {selectedItem?.nama}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui label, urutan tampilan, atau warna badge. Kode database dikunci untuk menjaga integritas data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Info Kategori & Kode Terkunci */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border font-mono text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">KATEGORI:</span>
                <span className="font-semibold text-foreground">{formKategori}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">KODE DATABASE:</span>
                <span className="font-semibold text-primary">{formKode}</span>
              </div>
            </div>

            {/* Nama / Label */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Nama / Label Tampilan <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            {/* Urutan */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Urutan Tampilan
              </label>
              <Input
                type="number"
                min={1}
                value={formUrutan}
                onChange={(e) => setFormUrutan(parseInt(e.target.value) || 1)}
                className="text-xs"
              />
            </div>

            {/* Warna Badge */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Warna Badge
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setFormBadgeColor(col.value)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all ${
                      formBadgeColor === col.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border ${col.bg.split(" ")[0]} border-current`}
                    />
                    <span className="truncate">{col.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="font-semibold text-foreground block mb-1">
                Deskripsi
              </label>
              <Input
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Switch Aktif */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div>
                <span className="font-semibold text-foreground block text-xs">Status Aktif</span>
                <span className="text-[11px] text-muted-foreground">
                  Jika dinonaktifkan, opsi ini disembunyikan dari pilihan formulir baru.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              disabled={submitting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS */}
      {/* ========================================================================= */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-rose-600">
              <Trash2 className="h-4 w-4" />
              Konfirmasi Hapus Referensi
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus referensi ini secara permanen dari database?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 my-3 rounded-lg bg-rose-50 border border-rose-200 text-xs space-y-1">
            <p className="font-semibold text-rose-900">
              {selectedItem?.nama} ({selectedItem?.kode})
            </p>
            <p className="text-[11px] text-rose-700">
              Kategori: {selectedItem?.kategori}. Pastikan tidak ada data transaksi aktif yang sedang menggunakan kode ini.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              disabled={submitting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="text-xs font-semibold gap-1.5"
            >
              {submitting ? "Menghapus..." : "Ya, Hapus Permanen"}
            </Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}
