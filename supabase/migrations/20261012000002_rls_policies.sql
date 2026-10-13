-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Migration: 20261012000002_rls_policies.sql
-- Kepatuhan: Bab 5 & Bab 8 PRD, Row Level Security (RLS) 7 Peran & Append-Only WORM
-- ==============================================================================

-- ==============================================================================
-- 1. FUNGSI HELPER RBAC & PD SCOPE
-- ==============================================================================

-- Cek apakah user memiliki peran tertentu
create or replace function public.has_role(user_uuid uuid, req_role role_enum)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = user_uuid and role = req_role
  );
end;
$$ language plpgsql security definer;

-- Ambil cakupan Perangkat Daerah (PD Scope) user
create or replace function public.pd_scope(user_uuid uuid)
returns uuid as $$
declare
  v_pd_id uuid;
begin
  select pd_id into v_pd_id
  from public.user_roles
  where user_id = user_uuid
  limit 1;
  return v_pd_id;
end;
$$ language plpgsql security definer;

-- Ambil id pegawai berdasarkan auth.uid()
create or replace function public.current_pegawai_id()
returns uuid as $$
declare
  v_pegawai_id uuid;
begin
  select id into v_pegawai_id
  from public.pegawai
  where user_id = auth.uid()
  limit 1;
  return v_pegawai_id;
end;
$$ language plpgsql security definer;

-- Cek apakah user adalah atasan dari pegawai tertentu
create or replace function public.is_atasan_of(target_pegawai_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.pegawai
    where id = target_pegawai_id and atasan_id = public.current_pegawai_id()
  );
end;
$$ language plpgsql security definer;

-- Cek apakah user adalah Admin Global (super_admin / operator BKPSDM)
create or replace function public.is_admin_or_super()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('super_admin', 'operator')
  );
end;
$$ language plpgsql security definer;

-- Cek apakah user adalah Eksekutif / Auditor / Pimpinan
create or replace function public.is_pimpinan_or_auditor()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('pimpinan', 'auditor', 'super_admin')
  );
end;
$$ language plpgsql security definer;


-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY PADA SELURUH TABEL
-- ==============================================================================
alter table perangkat_daerah enable row level security;
alter table jabatan enable row level security;
alter table user_roles enable row level security;
alter table pegawai enable row level security;
alter table perubahan_data_pegawai enable row level security;
alter table riwayat_pangkat enable row level security;
alter table aturan_kepangkatan enable row level security;
alter table usulan_kenaikan_pangkat enable row level security;
alter table mutasi enable row level security;
alter table formasi enable row level security;
alter table lowongan_internal enable row level security;
alter table skp enable row level security;
alter table skp_target enable row level security;
alter table absensi enable row level security;
alter table saldo_cuti enable row level security;
alter table cuti enable row level security;
alter table diklat enable row level security;
alter table pegawai_diklat enable row level security;
alter table kompetensi enable row level security;
alter table pegawai_kompetensi enable row level security;
alter table hukuman_disiplin enable row level security;
alter table pensiun_checklist enable row level security;
alter table dokumen enable row level security;
alter table talent_pool enable row level security;
alter table notifikasi enable row level security;
alter table notifikasi_log enable row level security;
alter table workflow_approval enable row level security;
alter table audit_log enable row level security;


-- ==============================================================================
-- 3. KEBIJAKAN RLS PER ENTITAS
-- ==============================================================================

-- A. PERANGKAT DAERAH & JABATAN (Read publik / all authenticated, Write admin)
create policy "PD can be read by all authenticated"
  on perangkat_daerah for select
  to authenticated
  using (true);

create policy "PD can be managed by super_admin"
  on perangkat_daerah for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

create policy "Jabatan can be read by all authenticated"
  on jabatan for select
  to authenticated
  using (true);

create policy "Jabatan can be managed by super_admin"
  on jabatan for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));


-- B. USER ROLES
create policy "User roles can be read by owner or admin"
  on user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin_or_super());

create policy "User roles can be managed by super_admin"
  on user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));


-- C. DATA INDUK PEGAWAI
create policy "Pegawai view policy"
  on pegawai for select
  to authenticated
  using (
    user_id = auth.uid() -- Pegawai itu sendiri
    or public.is_atasan_of(id) -- Atasan langsung
    or (pd_id = public.pd_scope(auth.uid()) and public.has_role(auth.uid(), 'kepala_pd')) -- Kepala PD
    or (pd_id = public.pd_scope(auth.uid()) and public.has_role(auth.uid(), 'operator')) -- Operator PD
    or public.is_admin_or_super() -- Super admin / operator BKPSDM
    or public.is_pimpinan_or_auditor() -- Bupati / Sekda / Auditor
  );

create policy "Pegawai update policy"
  on pegawai for update
  to authenticated
  using (
    public.is_admin_or_super()
    or (pd_id = public.pd_scope(auth.uid()) and public.has_role(auth.uid(), 'operator'))
  );

create policy "Pegawai insert policy"
  on pegawai for insert
  to authenticated
  with check (public.is_admin_or_super());


-- D. PERUBAHAN DATA PEGAWAI (Mandiri)
create policy "Perubahan data select"
  on perubahan_data_pegawai for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_admin_or_super()
    or (public.has_role(auth.uid(), 'operator') and exists (
      select 1 from public.pegawai p where p.id = pegawai_id and p.pd_id = public.pd_scope(auth.uid())
    ))
  );

create policy "Perubahan data insert by pegawai"
  on perubahan_data_pegawai for insert
  to authenticated
  with check (pegawai_id = public.current_pegawai_id());

create policy "Perubahan data update by admin"
  on perubahan_data_pegawai for update
  to authenticated
  using (public.is_admin_or_super());


-- E. CUTI & SALDO CUTI
create policy "Saldo cuti select"
  on saldo_cuti for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
  );

create policy "Saldo cuti manage by admin"
  on saldo_cuti for all
  to authenticated
  using (public.is_admin_or_super());

create policy "Cuti select"
  on cuti for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
    or (public.has_role(auth.uid(), 'kepala_pd') and exists (
      select 1 from public.pegawai p where p.id = pegawai_id and p.pd_id = public.pd_scope(auth.uid())
    ))
  );

create policy "Cuti insert by pegawai"
  on cuti for insert
  to authenticated
  with check (pegawai_id = public.current_pegawai_id());

create policy "Cuti update workflow"
  on cuti for update
  to authenticated
  using (
    public.is_atasan_of(pegawai_id)
    or public.has_role(auth.uid(), 'kepala_pd')
    or public.is_admin_or_super()
  );


-- F. ABSENSI
create policy "Absensi select"
  on absensi for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
    or (public.has_role(auth.uid(), 'kepala_pd') and exists (
      select 1 from public.pegawai p where p.id = pegawai_id and p.pd_id = public.pd_scope(auth.uid())
    ))
  );

create policy "Absensi insert/update by admin or device"
  on absensi for all
  to authenticated
  using (public.is_admin_or_super());


-- G. KINERJA (SKP)
create policy "SKP select"
  on skp for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
    or public.is_pimpinan_or_auditor()
  );

create policy "SKP manage by pegawai and atasan"
  on skp for all
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
  );

create policy "SKP Target manage"
  on skp_target for all
  to authenticated
  using (
    exists (
      select 1 from public.skp
      where skp.id = skp_id and (
        skp.pegawai_id = public.current_pegawai_id()
        or public.is_atasan_of(skp.pegawai_id)
        or public.is_admin_or_super()
      )
    )
  );


-- H. KEPANGKATAN & ATURAN
create policy "Aturan kepangkatan select all"
  on aturan_kepangkatan for select
  to authenticated
  using (true);

create policy "Aturan kepangkatan manage admin"
  on aturan_kepangkatan for all
  to authenticated
  using (public.is_admin_or_super());

create policy "Usulan KP select"
  on usulan_kenaikan_pangkat for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
    or public.is_pimpinan_or_auditor()
  );

create policy "Usulan KP manage"
  on usulan_kenaikan_pangkat for all
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_admin_or_super()
  );


-- I. ARSIP DOKUMEN DIGITAL
create policy "Dokumen select"
  on dokumen for select
  to authenticated
  using (
    pegawai_id = public.current_pegawai_id()
    or public.is_atasan_of(pegawai_id)
    or public.is_admin_or_super()
    or public.is_pimpinan_or_auditor()
  );

create policy "Dokumen insert by owner or admin"
  on dokumen for insert
  to authenticated
  with check (
    pegawai_id = public.current_pegawai_id()
    or public.is_admin_or_super()
  );


-- J. NOTIFIKASI
create policy "Notifikasi own select"
  on notifikasi for select
  to authenticated
  using (user_id = auth.uid());

create policy "Notifikasi own update"
  on notifikasi for update
  to authenticated
  using (user_id = auth.uid());


-- K. AUDIT LOG (WORM: WRITE ONCE READ MANY)
-- Aturan Wajib Bab 8 & Bab 10: Hanya SELECT untuk super_admin & auditor, INSERT oleh authenticated, NO UPDATE, NO DELETE.
create policy "Audit log select by auditor and super_admin"
  on audit_log for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'auditor')
    or public.has_role(auth.uid(), 'super_admin')
  );

create policy "Audit log insert by authenticated system"
  on audit_log for insert
  to authenticated
  with check (true);

-- TIDAK ADA POLICY UPDATE MAUPUN DELETE PADA AUDIT_LOG (IMMUTABLE WORM)
