-- ==============================================================================
-- E-SIMPEG DAERAH (KABUPATEN NUSANTARA JAYA)
-- Migration: 20261012000005_cron_jobs.sql
-- Kepatuhan: Bab 10 & Bab 11 Task 3.3 (pg_cron Scheduled Job Harian)
-- ==============================================================================

-- Aktifkan ekstensi pg_cron dan pg_net jika tersedia di Supabase
create extension if not exists "pg_cron";
create extension if not exists "pg_net";

-- Jadwal harian pukul 02:00 WIB (19:00 UTC) untuk memicu evaluasi kepangkatan & pensiun
-- select cron.schedule(
--   'evaluasi-kepegawaian-harian',
--   '0 19 * * *',
--   $$
--   select net.http_get(
--     url := 'https://simpeg.nusantarajaya.go.id/api/v1/cron/evaluasi-kepegawaian',
--     headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret', true))
--   );
--   $$
-- );
