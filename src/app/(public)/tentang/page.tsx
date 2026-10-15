"use client";

import { Building2, Compass, Shield, Award, Users, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function TentangPage() {
  const { settings } = useAppSettings();

  const values = [
    {
      title: "Transparansi & Akuntabilitas",
      desc: "Setiap rekam jejak, usulan kepangkatan, dan penilaian kinerja dapat dipantau langsung secara real-time tanpa perantara.",
      icon: Shield,
    },
    {
      title: "Proaktif & Prediktif",
      desc: "Menghilangkan paradigma menunggu berkas dengan menghadirkan notifikasi cerdas H-180 sebelum masa kenaikan pangkat dan pensiun.",
      icon: Compass,
    },
    {
      title: "Meritokrasi ASN",
      desc: "Menempatkan aparatur sesuai kompetensi, kualifikasi, dan rekam jejak kinerja yang obyektif demi pelayanan publik prima.",
      icon: Award,
    },
    {
      title: "Pelayanan Mandiri (Self-Service)",
      desc: "Memudahkan ASN mengurus administrasi kepegawaian kapan saja dan dari mana saja secara paperless.",
      icon: Users,
    },
  ];

  const namaPemda = settings.nama_pemda || settings.nama_sub_aplikasi || "Pemerintah Daerah";
  const namaBkd = settings.nama_bkd || "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM)";

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Building2 className="h-4 w-4" />
            <span>{settings.singkatan_bkd || "Badan Kepegawaian & Pengembangan SDM"}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            Mewujudkan Transformasi SDM Aparatur yang Unggul & Berintegritas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            SIMPEG Daerah adalah langkah strategis {namaPemda} dalam
            mewujudkan ekosistem manajemen kepegawaian modern berbasis teknologi digital
            yang terpadu, terpercaya, dan berorientasi hasil.
          </p>
        </div>

        {/* Visi & Misi Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-primary/20 bg-primary/5 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Visi Kepegawaian
              </span>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                "Terwujudnya ASN {namaPemda} yang Profesional, Adaptif, dan Berakhlak Menuju Pelayanan Publik Berkelas Dunia."
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Mendasarkan seluruh keputusan pembinaan karir pada data riil yang terverifikasi dan sistem merit yang berkeadilan.
            </p>
          </Card>

          <Card className="p-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Misi Strategis
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Mendigitalkan 100% dokumen kepegawaian menuju administrasi tanpa kertas (*paperless office*).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Memastikan ketepatan waktu kenaikan pangkat dan kenaikan gaji berkala tanpa penundaan birokrasi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Mengembangkan kompetensi ASN secara terarah berbasis analisis gap kompetensi jabatan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Menjamin perlindungan data pribadi ASN sesuai Undang-Undang Nomor 27 Tahun 2022.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Nilai Utama */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
              Nilai-Nilai Fondasi Sistem
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Prinsip kerja yang dipegang teguh dalam setiap modul aplikasi SIMPEG Daerah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Profil Instansi Penyelenggara */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {namaBkd}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">Kepala Instansi</p>
              <p className="font-bold text-foreground">Kepala {settings.singkatan_bkd || "BKPSDM"}</p>
              <p>{namaPemda}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Alamat Kantor Pelayanan</p>
              <p>{settings.alamat_kantor || settings.alamat_sekretariat || "Kompleks Perkantoran Pemerintah Daerah"}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Kanal Pelayanan</p>
              <p>Telepon: {settings.no_telepon || settings.telepon_sekretariat || "(0536) 3221234"}</p>
              <p>Email: {settings.email_dinas || settings.email_sekretariat || "bkpsdm@palangkaraya.go.id"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
