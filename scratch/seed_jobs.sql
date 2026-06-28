-- Seed data for Scheduled Jobs (Phase 11 Part 2)
-- These jobs will be picked up by the Vercel Cron endpoint (/api/jobs/schedule)

INSERT INTO scheduled_jobs (job_type, job_category, cron_expression, enabled, next_run_at)
VALUES
  ('SEARCH_REINDEX', 'SEARCH', 'Every Night', true, NOW()),
  ('LINK_HEALTH_CHECK', 'AFFILIATE', 'Every 6 Hours', true, NOW()),
  ('MEDIA_CLEANUP', 'MEDIA', 'Weekly', true, NOW()),
  ('GENERATE_SITEMAP', 'SEO', 'Daily', true, NOW()),
  ('HEALTH_CHECK', 'SYSTEM', 'Every Hour', true, NOW()),
  ('CACHE_CLEANUP', 'CACHE', 'Every Day', true, NOW())
ON CONFLICT DO NOTHING;
