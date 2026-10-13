-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Migration: 20261012000004_materialized_views.sql
-- Kepatuhan: Bab 8 & Bab 11 Task 2.12 (Materialized Views Agregat Eksekutif)
-- ==============================================================================

-- 1. MATERIALIZED VIEW STATISTIK KEPEGAWAIAN KABUPATEN
create materialized view if not exists mv_agregat_kepegawaian as
select
  count(*) as total_asn,
  count(*) filter (where status_kepegawaian = 'PNS') as total_pns,
  count(*) filter (where status_kepegawaian = 'PPPK') as total_pppk,
  count(*) filter (where status = 'aktif') as total_aktif,
  count(*) filter (where status = 'pensiun') as total_pensiun,
  count(*) filter (where tanggal_pensiun <= (current_date + interval '12 month') and status = 'aktif') as mendekati_pensiun_12_bln,
  now() as updated_at
from public.pegawai;

create unique index if not exists idx_mv_agregat on mv_agregat_kepegawaian(updated_at);

-- 2. MATERIALIZED VIEW STATISTIK PER PERANGKAT DAERAH
create materialized view if not exists mv_agregat_pd as
select
  pd.id as pd_id,
  pd.nama as pd_nama,
  count(p.id) as total_pegawai,
  count(p.id) filter (where p.status_kepegawaian = 'PNS') as total_pns,
  count(p.id) filter (where p.status_kepegawaian = 'PPPK') as total_pppk,
  now() as updated_at
from public.perangkat_daerah pd
left join public.pegawai p on p.pd_id = pd.id and p.status = 'aktif'
group by pd.id, pd.nama;

create unique index if not exists idx_mv_agregat_pd on mv_agregat_pd(pd_id);

-- 3. FUNGSI REFRESH VIEW AGREGAT
create or replace function refresh_mat_views()
returns void as $$
begin
  refresh materialized view concurrently mv_agregat_kepegawaian;
  refresh materialized view concurrently mv_agregat_pd;
end;
$$ language plpgsql security definer;
